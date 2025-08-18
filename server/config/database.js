import { Sequelize } from 'sequelize'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据库配置
const config = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../data/database.sqlite'),
    logging: console.log,
    define: {
      timestamps: false, // 禁用默认时间戳，使用自定义的数值时间戳
      underscored: true,
      freezeTableName: true
    },
    // SQLite JSON类型支持
    dialectOptions: {
      // 启用JSON1扩展
      json: true
    }
  },
  production: {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_USER || '',
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
    // 确保所有模型都被导入
    await import('../models/index.js')
    
    await sequelize.sync({ force })
    console.log('✅ 数据库同步完成')
    return true
  } catch (error) {
    console.error('❌ 数据库同步失败:', error)
    return false
  }
}

export default sequelize
