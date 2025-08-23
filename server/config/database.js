import { Sequelize } from 'sequelize'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据库配置
const config = {
  development: {
    dialect: 'mysql',
    host: process.env.DB_HOST || '42.193.243.30',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'fai@508',
    database: process.env.DB_NAME || 'ai_prompt_admin',
    logging: console.log,
    define: {
      timestamps: false, // 禁用默认时间戳，使用自定义的数值时间戳
      underscored: true,
      freezeTableName: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    dialect: 'mysql',
    host: process.env.DB_HOST || '42.193.243.30',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'fai@508',
    database: process.env.DB_NAME || 'ai_prompt_admin',
    logging: false,
    define: {
      timestamps: false, // 禁用默认时间戳，使用自定义的数值时间戳
      underscored: true,
      freezeTableName: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}

// 获取当前环境
const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env]

// 创建Sequelize实例
const sequelize = new Sequelize(dbConfig)

// 注意：模型将在 syncDatabase 函数中动态导入，避免循环依赖

// 测试数据库连接
export const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')
    return true
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    return false
  }
}

// 同步数据库（开发环境自动创建表）
export const syncDatabase = async (force = false) => {
  try {
    console.log('📦 开始动态导入模型...')
    
    // 动态导入模型，避免循环依赖
    // 注意导入顺序：先导入 WorkCategory，再导入 Work
    console.log('📦 导入 WorkCategory 模型...')
    await import('../models/WorkCategory.model.js')
    console.log('📦 导入 Category 模型...')
    await import('../models/Category.model.js')
    console.log('📦 导入 User 模型...')
    await import('../models/User.model.js')
    console.log('📦 导入 Work 模型...')
    await import('../models/Work.model.js')
    
    console.log('📦 模型导入完成，已注册的模型:', Object.keys(sequelize.models))
    
    // 验证关键模型是否可用
    if (sequelize.models.WorkCategory) {
      console.log('✅ WorkCategory 模型已注册')
    } else {
      console.warn('⚠️ WorkCategory 模型未注册')
    }
    
    if (sequelize.models.Work) {
      console.log('✅ Work 模型已注册')
    } else {
      console.warn('⚠️ Work 模型未注册')
    }
    
    // 等待一小段时间确保所有模型都完全注册
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await sequelize.sync({ force })
    console.log('✅ 数据库同步完成')
    console.log('🔍 同步后的模型:', Object.keys(sequelize.models))
    return true
  } catch (error) {
    console.error('❌ 数据库同步失败:', error)
    return false
  }
}

export default sequelize
