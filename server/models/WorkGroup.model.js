import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import MemGroup from './MemGroup.model.js';

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
    // 确保数据类型正确
    const workIdInt = parseInt(workId);
    const groupIdInt = parseInt(groupId);
    const memIdInt = parseInt(memId);
    
    console.log('collectWork 参数:', { workId: workIdInt, groupId: groupIdInt, memId: memIdInt });
    
    if (isNaN(workIdInt) || isNaN(groupIdInt) || isNaN(memIdInt)) {
      throw new Error('参数类型错误：workId、groupId、memId 必须是数字');
    }
    
    // 检查是否已经采集过（只检查work_id和group_id的组合，因为数据库唯一约束是这两个字段）
    // 使用paranoid: false来包括软删除的记录，因为唯一约束不考虑软删除
    const existing = await WorkGroup.findOne({
      where: {
        wg_work_id: workIdInt,
        wg_mg_id: groupIdInt
      },
      paranoid: false, // 包括软删除的记录
      transaction: options.transaction
    });
    
    if (existing) {
      if (existing.wg_deleted_at) {
        // 如果记录被软删除了，恢复它
        console.log(`作品 ${workIdInt} 在分组 ${groupIdInt} 中的记录被软删除，正在恢复...`);
        existing.wg_deleted_at = null;
        existing.wg_mem_id = memIdInt; // 更新会员ID
        existing.wg_collected_at = Date.now(); // 更新采集时间
        existing.wg_updated_at = new Date(); // 更新修改时间
        await existing.save({ 
          transaction: options.transaction,
          paranoid: false // 允许更新软删除的记录
        });
        return { ...existing.toJSON(), isNewRecord: false }; // 标记为已存在的记录
      } else {
        // 记录存在且未被删除，跳过创建
        console.log(`作品 ${workIdInt} 已经在分组 ${groupIdInt} 中，跳过创建`);
        return { ...existing.toJSON(), isNewRecord: false }; // 标记为已存在的记录
      }
    }
    
    // 创建采集记录
    const workGroup = await WorkGroup.create({
      wg_work_id: workIdInt,
      wg_mg_id: groupIdInt,
      wg_mem_id: memIdInt,
      wg_collected_at: Date.now()
    }, {
      transaction: options.transaction
    });
    
    return { ...workGroup.toJSON(), isNewRecord: true }; // 标记为新创建的记录
  } catch (error) {
    console.error('collectWork 错误:', error);
    throw error;
  }
};

// 类方法：从分组中移除作品
WorkGroup.removeWork = async function(workId, groupId, memId) {
  try {
    const result = await WorkGroup.destroy({
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
  
  const { count, rows } = await WorkGroup.findAndCountAll({
    where: {
      wg_mg_id: groupId,
      wg_mem_id: memId
    },
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
  try {
    // 先获取作品分组关联记录
    const workGroups = await WorkGroup.findAll({
      where: {
        wg_work_id: workId,
        wg_mem_id: memId
      },
      order: [['wg_collected_at', 'DESC']]
    });
    
    if (workGroups.length === 0) {
      return [];
    }
    
    // 获取分组ID列表
    const groupIds = workGroups.map(wg => wg.wg_mg_id);
    
    // 查询分组详情
    const groups = await MemGroup.findAll({
      where: {
        mg_id: groupIds,
        mg_mem_id: memId
      },
      attributes: ['mg_id', 'mg_name', 'mg_desc', 'mg_color', 'mg_cover_url', 'mg_item_count']
    });
    
    // 返回分组信息
    return groups;
  } catch (error) {
    console.error('获取作品分组失败:', error);
    throw error;
  }
};

// 类方法：检查作品是否在指定分组中
WorkGroup.isWorkInGroup = async function(workId, groupId, memId) {
  const result = await WorkGroup.findOne({
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
  
  const { count, rows } = await WorkGroup.findAndCountAll({
    where: {
      wg_mem_id: memId
    },
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
