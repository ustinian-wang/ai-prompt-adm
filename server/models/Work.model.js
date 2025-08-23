import { DataTypes, Op } from 'sequelize'
import sequelize from '../config/database.js'

const Work = sequelize.define('work', {
  work_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  work_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  work_desc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  work_prompt_cn: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  work_prompt_en: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  work_guide_desc: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  work_img_path: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '作品图片路径',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  work_status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
    allowNull: false
  },
  work_category_list: {
    type: DataTypes.VIRTUAL,
    get() {
      // 这个方法会在读取时自动调用
      // 当没有分类关联时，返回空数组
      if (!this.getWorkCategoryIds) {
        return []
      }
      // 由于虚拟字段的 getter 不能是异步的，我们返回一个空数组
      // 实际的分类数据将通过实例方法获取
      return []
    },
    set(value) {
      // 这个方法会在设置时自动调用
      // 将分类ID数组同步到 work_category 表
      if (Array.isArray(value)) {
        this._categoryIds = value
      }
    }
  },
  work_outer_link_list: {
    type: DataTypes.JSON,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('work_outer_link_list');
      if (typeof rawValue === 'string') {
        try {
          return JSON.parse(rawValue);
        } catch (e) {
          console.warn('Failed to parse work_outer_link_list JSON:', e);
          return [];
        }
      }
      return rawValue || [];
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('work_outer_link_list', value);
      } else if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          this.setDataValue('work_outer_link_list', parsed);
        } catch (e) {
          this.setDataValue('work_outer_link_list', []);
        }
      } else {
        this.setDataValue('work_outer_link_list', value);
      }
    }
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('metadata');
      if (typeof rawValue === 'string') {
        try {
          return JSON.parse(rawValue);
        } catch (e) {
          return rawValue;
        }
      }
      return rawValue;
    }
  },
  work_created_at: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: () => Date.now(),
    comment: '创建时间戳（毫秒）'
  },
  work_updated_at: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: () => Date.now(),
    comment: '更新时间戳（毫秒）'
  }
}, {
  tableName: 'work',
  timestamps: false,
  // 禁用时间字段的自动转换，直接返回原始值
  getterMethods: {},
  setterMethods: {},
  hooks: {
    beforeCreate: async (work) => {
      work.work_created_at = Date.now()
      work.work_updated_at = Date.now()
    },
    beforeUpdate: async (work) => {
      work.work_updated_at = Date.now()
    },
    // 注意：移除了分类同步的 hooks，改在服务层处理
  }
})

// 类方法：获取作品列表（带分页和筛选）
Work.getList = async function(options = {}) {
  const {
    page = 1,
    limit = 10,
    work_id,
    user_id,
    work_status,
    work_name
  } = options
  
  const where = {}
  if (work_id) where.work_id = work_id
  if (user_id) where.user_id = user_id
  if (work_status) where.work_status = work_status
  if (work_name) {
    where[Op.or] = [
      { work_name: { [Op.like]: `%${work_name}%` } },
    ]
  }
  
  const offset = (page - 1) * limit
  
  const { count, rows } = await this.findAndCountAll({
    where,
    order: [['work_created_at', 'DESC']],
    limit,
    offset
  })
  
  return {
    works: rows,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  }
}

// 确保时间字段返回原始毫秒时间戳，并添加格式化的时间字符串
Work.prototype.toJSON = function() {
  const data = this.get();
  
  // 确保时间字段返回原始数值，而不是格式化的字符串
  if (data.work_created_at) {
    data.work_created_at = parseInt(data.work_created_at);
    // 添加格式化的时间字符串字段
    data.work_created_at_str = this.formatTimestamp(data.work_created_at);
  }
  
  if (data.work_updated_at) {
    data.work_updated_at = parseInt(data.work_updated_at);
    // 添加格式化的时间字符串字段
    data.work_updated_at_str = this.formatTimestamp(data.work_updated_at);
  }
  
  return data;
}

// 格式化时间戳为 YYYY-MM-DD HH:mm:ss 格式
Work.prototype.formatTimestamp = function(timestamp) {
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
}

// 注意：分类相关的方法移到服务层处理，避免模型间耦合

export default Work
