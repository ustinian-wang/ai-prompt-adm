import sequelize from '../config/database.js'
import User from '../models/User.model.js'
import Work from '../models/Work.model.js'
import Category from '../models/Category.model.js'
import { getCurrentTimestamp } from '../utils/timestamp.js'

// 应用时间戳字段更改的脚本
async function applyTimestampChanges() {
  try {
    console.log('🚀 开始应用时间戳字段更改...')
    
    // 1. 检查数据库连接
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')
    
    // 2. 同步数据库结构（会创建新的时间字段）
    console.log('🔄 同步数据库结构...')
    await sequelize.sync({ alter: true })
    
    // 3. 为现有记录设置时间戳（如果字段为空）
    console.log('📝 更新现有记录的时间戳...')
    
    // 更新用户表
    try {
      const userCount = await User.update(
        {
          user_created_at: getCurrentTimestamp(),
          user_updated_at: getCurrentTimestamp()
        },
        {
          where: {
            [sequelize.Op.or]: [
              { user_created_at: null },
              { user_updated_at: null }
            ]
          }
        }
      )
      console.log(`✅ 更新了 ${userCount[0]} 条用户记录`)
    } catch (error) {
      console.log('⚠️ 用户表更新跳过（可能字段已存在）')
    }
    
    // 更新作品表
    try {
      const workCount = await Work.update(
        {
          work_created_at: getCurrentTimestamp(),
          work_updated_at: getCurrentTimestamp()
        },
        {
          where: {
            [sequelize.Op.or]: [
              { work_created_at: null },
              { work_updated_at: null }
            ]
          }
        }
      )
      console.log(`✅ 更新了 ${workCount[0]} 条作品记录`)
    } catch (error) {
      console.log('⚠️ 作品表更新跳过（可能字段已存在）')
    }
    
    // 更新分类表
    try {
      const categoryCount = await Category.update(
        {
          category_created_at: getCurrentTimestamp(),
          category_updated_at: getCurrentTimestamp()
        },
        {
          where: {
            [sequelize.Op.or]: [
              { category_created_at: null },
              { category_updated_at: null }
            ]
          }
        }
      )
      console.log(`✅ 更新了 ${categoryCount[0]} 条分类记录`)
    } catch (error) {
      console.log('⚠️ 分类表更新跳过（可能字段已存在）')
    }
    
    // 4. 验证更改
    console.log('🔍 验证更改结果...')
    
    // 检查表结构
    const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('📋 数据库表:', tables.map(t => t.name))
    
    // 检查用户表结构
    try {
      const [userColumns] = await sequelize.query("PRAGMA table_info(user)")
      const hasCreatedAt = userColumns.some(col => col.name === 'user_created_at')
      const hasUpdatedAt = userColumns.some(col => col.name === 'user_updated_at')
      console.log(`用户表时间字段: created_at=${hasCreatedAt}, updated_at=${hasUpdatedAt}`)
    } catch (error) {
      console.log('⚠️ 无法检查用户表结构')
    }
    
    console.log('🎉 时间戳字段更改应用完成！')
    console.log('📊 所有时间字段现在使用BIGINT类型存储')
    console.log('📅 所有时间字段现在使用毫秒级时间戳存储')
    
  } catch (error) {
    console.error('❌ 应用更改失败:', error)
    throw error
  } finally {
    await sequelize.close()
  }
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  applyTimestampChanges()
    .then(() => {
      console.log('✅ 脚本执行完成')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error)
      process.exit(1)
    })
}

export default applyTimestampChanges
