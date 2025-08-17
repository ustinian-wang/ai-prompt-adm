import sequelize, { testConnection } from '../config/database.js'
import '../models/index.js'

console.log('🕐 开始修正数据库时间字段...')

async function fixTimeFields() {
  try {
    const connected = await testConnection()
    if (!connected) {
      console.error('❌ 数据库连接失败')
      process.exit(1)
    }
    
    const env = process.env.NODE_ENV || 'development'
    const isSQLite = env === 'development'
    
    if (isSQLite) {
      console.log('📱 检测到 SQLite 环境，开始修正时间字段...')
      
      // 1. 删除重复的表（保留带下划线前缀的表）
      console.log('\n1. 清理重复表...')
      const tablesToDrop = ['users', 'works']
      
      for (const tableName of tablesToDrop) {
        try {
          await sequelize.query(`DROP TABLE IF EXISTS ${tableName}`)
          console.log(`   ✅ 删除表: ${tableName}`)
        } catch (error) {
          console.log(`   ⚠️  删除表 ${tableName} 失败:`, error.message)
        }
      }
      
      // 2. 修正 user 表的时间字段
      console.log('\n2. 修正 user 表时间字段...')
      try {
        // 重命名时间字段为临时名称
        await sequelize.query(`ALTER TABLE user RENAME COLUMN user_created_at TO temp_created_at`)
        await sequelize.query(`ALTER TABLE user RENAME COLUMN user_updated_at TO temp_updated_at`)
        
        // 添加新的时间戳字段
        await sequelize.query(`ALTER TABLE user ADD COLUMN user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)
        await sequelize.query(`ALTER TABLE user ADD COLUMN user_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)
        
        // 复制数据（如果有的话）
        await sequelize.query(`
          UPDATE user 
          SET user_created_at = COALESCE(temp_created_at, CURRENT_TIMESTAMP),
              user_updated_at = COALESCE(temp_updated_at, CURRENT_TIMESTAMP)
        `)
        
        // 删除临时字段
        await sequelize.query(`ALTER TABLE user DROP COLUMN temp_created_at`)
        await sequelize.query(`ALTER TABLE user DROP COLUMN temp_updated_at`)
        
        console.log('   ✅ user 表时间字段修正完成')
      } catch (error) {
        console.log('   ⚠️  user 表时间字段修正失败:', error.message)
      }
      
      // 3. 修正 work 表的时间字段
      console.log('\n3. 修正 work 表时间字段...')
      try {
        // 重命名时间字段为临时名称
        await sequelize.query(`ALTER TABLE work RENAME COLUMN work_created_at TO temp_created_at`)
        await sequelize.query(`ALTER TABLE work RENAME COLUMN work_updated_at TO temp_updated_at`)
        
        // 添加新的时间戳字段
        await sequelize.query(`ALTER TABLE work ADD COLUMN work_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)
        await sequelize.query(`ALTER TABLE work ADD COLUMN work_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)
        
        // 复制数据（如果有的话）
        await sequelize.query(`
          UPDATE work 
          SET work_created_at = COALESCE(temp_created_at, CURRENT_TIMESTAMP),
              work_updated_at = COALESCE(temp_updated_at, CURRENT_TIMESTAMP)
        `)
        
        // 删除临时字段
        await sequelize.query(`ALTER TABLE work DROP COLUMN temp_created_at`)
        await sequelize.query(`ALTER TABLE work DROP COLUMN temp_updated_at`)
        
        console.log('   ✅ work 表时间字段修正完成')
      } catch (error) {
        console.log('   ⚠️  work 表时间字段修正失败:', error.message)
      }
      
      // 4. 创建 categories 表（如果不存在）
      console.log('\n4. 检查 categories 表...')
      try {
        const categoriesExist = await sequelize.query(`
          SELECT name FROM sqlite_master WHERE type='table' AND name='categories'
        `)
        
        if (categoriesExist[0].length === 0) {
          await sequelize.query(`
            CREATE TABLE categories (
              category_id INTEGER PRIMARY KEY AUTOINCREMENT,
              category_name VARCHAR(100) NOT NULL,
              category_description TEXT,
              parent_id INTEGER,
              category_sort INTEGER DEFAULT 0,
              category_status TEXT DEFAULT 'active',
              category_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              category_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (parent_id) REFERENCES categories(category_id)
            )
          `)
          console.log('   ✅ categories 表创建完成')
        } else {
          console.log('   ℹ️  categories 表已存在')
        }
      } catch (error) {
        console.log('   ⚠️  categories 表处理失败:', error.message)
      }
      
    } else {
      console.log('🐬 检测到 MySQL 环境，执行 MySQL 特定的时间字段修正...')
      
      const queries = [
        // 删除重复表
        'DROP TABLE IF EXISTS users',
        'DROP TABLE IF EXISTS works',
        
        // 修正 user 表时间字段
        'ALTER TABLE user MODIFY COLUMN user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        'ALTER TABLE user MODIFY COLUMN user_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        
        // 修正 work 表时间字段
        'ALTER TABLE work MODIFY COLUMN work_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        'ALTER TABLE work MODIFY COLUMN work_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
      ]
      
      for (const query of queries) {
        try {
          await sequelize.query(query)
          console.log(`✅ 执行成功: ${query}`)
        } catch (error) {
          console.log(`⚠️  执行失败: ${query}`, error.message)
        }
      }
    }
    
    // 验证修正结果
    console.log('\n📊 验证修正结果...')
    const tables = await sequelize.showAllSchemas()
    console.log('现有表:', tables.map(t => t.name))
    
    for (const table of tables) {
      if (['user', 'work', 'categories'].includes(table.name)) {
        console.log(`\n📋 表 ${table.name} 结构:`)
        const tableInfo = await sequelize.query(
          isSQLite 
            ? `PRAGMA table_info(${table.name})`
            : `DESCRIBE ${table.name}`
        )
        
        const timeFields = tableInfo[0].filter(col => 
          col.name.toLowerCase().includes('_at')
        )
        
        if (timeFields.length > 0) {
          console.log('   时间字段:')
          timeFields.forEach(field => {
            console.log(`     - ${field.name}: ${field.type}`)
          })
        }
      }
    }
    
    console.log('\n✅ 数据库时间字段修正完成！')
    
  } catch (error) {
    console.error('❌ 修正失败:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  fixTimeFields()
}

export default fixTimeFields
