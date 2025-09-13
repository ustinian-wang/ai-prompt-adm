import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// 作品分组关联模型（work_group）
const WorkGroup = sequelize.define('WorkGroup', {
  wg_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    comment: '关联ID'
  },
  wg_work_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '作品ID，关联 work.work_id'
  },
  wg_mg_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '分组ID，关联 mem_group.mg_id'
  },
  wg_mem_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '会员ID，关联 member_accounts.mem_id（冗余字段，便于查询）'
  },
  wg_collected_at: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: () => Date.now(),
    comment: '采集时间戳（毫秒）'
  },
  wg_created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  },
  wg_updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新时间'
  },
  wg_deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '软删除时间'
  }
}, {
  tableName: 'work_group',
  timestamps: true,
  createdAt: 'wg_created_at',
  updatedAt: 'wg_updated_at',
  paranoid: true,
  deletedAt: 'wg_deleted_at',
  comment: '作品分组关联表',
  indexes: [
    {
      unique: true,
      fields: ['wg_work_id', 'wg_mg_id'],
      name: 'uk_work_group'
    },
    {
      fields: ['wg_mem_id'],
      name: 'idx_work_group_mem_id'
    },
    {
      fields: ['wg_mg_id'],
      name: 'idx_work_group_mg_id'
    },
    {
      fields: ['wg_work_id'],
      name: 'idx_work_group_work_id'
    }
  ]
});

// 类方法：采集作品到分组
WorkGroup.collectWork = async function(workId, groupId, memId, options = {}) {
  try {
    // 检查是否已经采集过
    const existing = await this.findOne({
      where: {
        wg_work_id: workId,
        wg_mg_id: groupId
      },
      transaction: options.transaction
    });
    
    if (existing) {
      throw new Error('该作品已经在此分组中');
    }
    
    // 创建采集记录
    const workGroup = await this.create({
      wg_work_id: workId,
      wg_mg_id: groupId,
      wg_mem_id: memId,
      wg_collected_at: Date.now()
    }, {
      transaction: options.transaction
    });
    
    return workGroup;
  } catch (error) {
    throw error;
  }
};

// 类方法：从分组中移除作品
WorkGroup.removeWork = async function(workId, groupId, memId) {
  try {
    const result = await this.destroy({
      where: {
        wg_work_id: workId,
        wg_mg_id: groupId,
        wg_mem_id: memId
      }
    });
    
    if (result === 0) {
      throw new Error('该作品不在此分组中');
    }
    
    return result;
  } catch (error) {
    throw error;
  }
};

// 类方法：获取分组下的作品列表
WorkGroup.getGroupWorks = async function(groupId, memId, options = {}) {
  const {
    page = 1,
    limit = 20,
    orderBy = 'wg_collected_at',
    order = 'DESC'
  } = options;
  
  const offset = (page - 1) * limit;
  
  const { count, rows } = await this.findAndCountAll({
    where: {
      wg_mg_id: groupId,
      wg_mem_id: memId
    },
    include: [
      {
        model: sequelize.models.Work,
        as: 'work',
        attributes: ['work_id', 'work_name', 'work_desc', 'work_img_path', 'work_status', 'metadata', 'work_created_at', 'work_updated_at']
      }
    ],
    order: [[orderBy, order]],
    limit,
    offset,
    distinct: true
  });
  
  return {
    works: rows,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  };
};

// 类方法：获取作品所在的分组列表
WorkGroup.getWorkGroups = async function(workId, memId) {
  const rows = await this.findAll({
    where: {
      wg_work_id: workId,
      wg_mem_id: memId
    },
    include: [
      {
        model: sequelize.models.MemGroup,
        as: 'memGroup',
        attributes: ['mg_id', 'mg_name', 'mg_desc', 'mg_color', 'mg_cover_url']
      }
    ],
    order: [['wg_collected_at', 'DESC']]
  });
  
  return rows;
};

// 类方法：检查作品是否在指定分组中
WorkGroup.isWorkInGroup = async function(workId, groupId, memId) {
  const result = await this.findOne({
    where: {
      wg_work_id: workId,
      wg_mg_id: groupId,
      wg_mem_id: memId
    }
  });
  
  return !!result;
};

// 类方法：获取会员采集的所有作品（跨分组）
WorkGroup.getMemberCollectedWorks = async function(memId, options = {}) {
  const {
    page = 1,
    limit = 20,
    orderBy = 'wg_collected_at',
    order = 'DESC'
  } = options;
  
  const offset = (page - 1) * limit;
  
  const { count, rows } = await this.findAndCountAll({
    where: {
      wg_mem_id: memId
    },
    include: [
      {
        model: sequelize.models.Work,
        as: 'work',
        attributes: ['work_id', 'work_name', 'work_desc', 'work_img_path', 'work_status', 'metadata', 'work_created_at', 'work_updated_at']
      },
      {
        model: sequelize.models.MemGroup,
        as: 'memGroup',
        attributes: ['mg_id', 'mg_name', 'mg_color']
      }
    ],
    order: [[orderBy, order]],
    limit,
    offset,
    distinct: true
  });
  
  return {
    works: rows,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  };
};

// 格式化时间戳为 YYYY-MM-DD HH:mm:ss 格式
WorkGroup.prototype.formatTimestamp = function(timestamp) {
  if (!timestamp) return null;
  
  const date = new Date(timestamp);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) return null;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 重写 toJSON 方法，添加格式化的时间字符串
WorkGroup.prototype.toJSON = function() {
  const data = this.get();
  
  // 确保时间字段返回原始数值
  if (data.wg_collected_at) {
    data.wg_collected_at = parseInt(data.wg_collected_at);
    data.wg_collected_at_str = this.formatTimestamp(data.wg_collected_at);
  }
  
  return data;
};

export default WorkGroup;
