import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import User from '../models/User.model.js'
import Work from '../models/Work.model.js'
import Category from '../models/Category.model.js'

// 转换时间字段为时间戳数值的脚本
async function convertTimestampsToNumbers() {
  try {
    console.log('开始转换时间字段为时间戳数值...')
    
    // 1. 修改User模型
    console.log('修改User模型...')
    const UserModel = sequelize.define('user_temp', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      user_email: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      user_password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      user_real_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '真实姓名'
      },
      user_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '手机号码'
      },
      user_avatar: {
        type: DataTypes.STRING(255),
        defaultValue: 'https://via.placeholder.com/32x32/1890ff/ffffff?text=U'
      },
      user_role: {
        type: DataTypes.ENUM('admin', 'sales', 'manager'),
        defaultValue: 'sales',
        comment: '用户角色：admin-总后台管理员, sales-业务员, manager-客户经理'
      },
      user_status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
        comment: '用户状态：active-正常, inactive-冻结'
      },
      user_created_at: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000),
        comment: '创建时间戳（秒）'
      },
      user_updated_at: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000),
        comment: '更新时间戳（秒）'
      }
    }, {
      tableName: 'user',
      timestamps: false,
      hooks: {
        beforeCreate: async (user) => {
          if (user.user_password) {
            const bcrypt = await import('bcryptjs')
            user.user_password = await bcrypt.default.hash(user.user_password, 10)
          }
          user.user_created_at = Math.floor(Date.now() / 1000)
          user.user_updated_at = Math.floor(Date.now() / 1000)
        },
        beforeUpdate: async (user) => {
          if (user.changed('user_password')) {
            const bcrypt = await import('bcryptjs')
            user.user_password = await bcrypt.default.hash(user.user_password, 10)
          }
          user.user_updated_at = Math.floor(Date.now() / 1000)
        }
      }
    })

    // 2. 修改Work模型
    console.log('修改Work模型...')
    const WorkModel = sequelize.define('work_temp', {
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
        comment: '作品图片路径'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      work_status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft',
        allowNull: false
      },
              work_category_list: {
        type: DataTypes.JSON,
        allowNull: true
      },
      work_outer_link_list: {
        type: DataTypes.JSON,
        allowNull: true
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true
      },
      work_created_at: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000),
        comment: '创建时间戳（秒）'
      },
      work_updated_at: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000),
        comment: '更新时间戳（秒）'
      }
    }, {
      tableName: 'work',
      timestamps: false
    })

    // 3. 修改Category模型
    console.log('修改Category模型...')
    const CategoryModel = sequelize.define('category_temp', {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '分类ID'
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '分类名称',
        validate: {
          len: [1, 100]
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '分类描述'
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '排序权重，数字越小排序越靠前'
      },
      icon: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '分类图标'
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '是否启用'
      },
      show_in_nav: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '是否在导航中显示'
      },
      category_created_at: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000),
        comment: '创建时间戳（秒）'
      },
      category_updated_at: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: () => Math.floor(Date.now() / 1000),
        comment: '更新时间戳（秒）'
      }
    }, {
      tableName: 'category',
      timestamps: false,
      indexes: [
        {
          name: 'idx_sort_order',
          fields: ['sort_order']
        },
        {
          name: 'idx_enabled',
          fields: ['enabled']
        }
      ]
    })

    // 4. 同步数据库结构
    console.log('同步数据库结构...')
    await sequelize.sync({ force: true })
    
    console.log('✅ 时间字段转换完成！所有时间字段已改为BIGINT类型的时间戳')
    console.log('注意：此操作会清空现有数据，请确保已备份重要数据')
    
  } catch (error) {
    console.error('❌ 转换失败:', error)
  } finally {
    await sequelize.close()
  }
}

// 运行转换
convertTimestampsToNumbers()
