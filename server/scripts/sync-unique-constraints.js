import sequelize, { testConnection } from '../config/database.js'
import '../models/index.js'

async function syncUniqueConstraints() {
  console.log('🔄 开始同步数据库唯一约束...')
  
  // 测试数据库连接
  const connected = await testConnection()
  if (!connected) {
    console.error('❌ 数据库连接失败，无法进行同步')
    process.exit(1)
  }
  
  try {
    // 获取当前环境
    const env = process.env.NODE_ENV || 'development'
    const isSQLite = env === 'development'
    
    if (isSQLite) {
      console.log('📱 检测到 SQLite 环境，使用 sync 方法同步...')
      
      // 对于 SQLite，直接使用 sync 方法同步模型定义
      await sequelize.sync({ alter: true })
      console.log('✅ SQLite 数据库结构同步完成')
      
    } else {
      console.log('🐬 检测到 MySQL 环境，执行 SQL 语句移除唯一约束...')
      
      // 对于 MySQL，需要手动执行 SQL 语句
      const queries = [
        // 移除 username 字段的唯一约束
        `ALTER TABLE user DROP INDEX IF EXISTS user_username_unique`,
        `ALTER TABLE user DROP INDEX IF EXISTS username`,
        
        // 移除 user_email 字段的唯一约束
        `ALTER TABLE user DROP INDEX IF EXISTS user_user_email_unique`,
        `ALTER TABLE user DROP INDEX IF EXISTS user_email`
      ]
      
      for (const query of queries) {
        try {
          await sequelize.query(query)
          console.log(`✅ 执行成功: ${query}`)
        } catch (error) {
          // 如果索引不存在，忽略错误
          if (error.message.includes('doesn\'t exist') || 
              error.message.includes('Duplicate key name') ||
              error.message.includes('check that column/key exists')) {
            console.log(`ℹ️  跳过（索引不存在）: ${query}`)
          } else {
            console.log(`⚠️  执行失败: ${query}`, error.message)
          }
        }
      }
      
      console.log('✅ MySQL 数据库唯一约束移除完成')
    }
    
    // 验证表结构
    console.log('\n📊 验证表结构...')
    const userTableInfo = await sequelize.query(
      isSQLite 
        ? "PRAGMA table_info(user)"
        : "DESCRIBE user"
    )
    
    console.log('📋 user 表结构:')
    console.log(userTableInfo[0])
    
    // 显示索引信息（MySQL）
    if (!isSQLite) {
      const indexes = await sequelize.query("SHOW INDEX FROM user")
      console.log('\n🔍 user 表索引:')
      console.log(indexes[0])
    }
    
    console.log('\n✅ 数据库唯一约束同步完成！')
    
  } catch (error) {
    console.error('❌ 数据库同步失败:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  syncUniqueConstraints()
}

export default syncUniqueConstraints
