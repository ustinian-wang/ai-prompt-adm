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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  work_status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
    allowNull: false
  },
  work_tag_list: {
    type: DataTypes.JSON,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('work_tag_list');
      if (typeof rawValue === 'string') {
        try {
          return JSON.parse(rawValue);
        } catch (e) {
          return rawValue;
        }
      }
      return rawValue;
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('work_tag_list', value);
      } else {
        this.setDataValue('work_tag_list', value);
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
  }
}, {
  tableName: 'work',
  timestamps: true,
  createdAt: 'work_created_at',
  updatedAt: 'work_updated_at'
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

export default Work
