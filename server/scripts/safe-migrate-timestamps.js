import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

// 安全的数据迁移脚本：将时间字段转换为时间戳数值
async function safeMigrateTimestamps() {
  try {
    console.log('🚀 开始安全的数据迁移...')
    
    // 1. 检查数据库连接
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')
    
    // 2. 获取数据库信息
    const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'")
    const tables = results.map(row => row.name)
    console.log('📋 现有表:', tables)
    
    // 3. 为每个表添加时间戳字段（如果不存在）
    for (const tableName of tables) {
      if (tableName === 'sqlite_sequence') continue
      
      console.log(`🔄 处理表: ${tableName}`)
      
      try {
        // 检查表结构
        const [columns] = await sequelize.query(`PRAGMA table_info(${tableName})`)
        const columnNames = columns.map(col => col.name)
        
        // 根据表名确定需要添加的时间字段
        let createdField, updatedField
        if (tableName === 'user') {
          createdField = 'user_created_at'
          updatedField = 'user_updated_at'
        } else if (tableName === 'work') {
          createdField = 'work_created_at'
          updatedField = 'work_updated_at'
        } else if (tableName === 'category') {
          createdField = 'category_created_at'
          updatedField = 'category_updated_at'
        }
        
        // 添加创建时间字段
        if (createdField && !columnNames.includes(createdField)) {
          console.log(`  ➕ 添加字段: ${createdField}`)
          await sequelize.query(`ALTER TABLE ${tableName} ADD COLUMN ${createdField} BIGINT DEFAULT ${Math.floor(Date.now() / 1000)}`)
        }
        
        // 添加更新时间字段
        if (updatedField && !columnNames.includes(updatedField)) {
          console.log(`  ➕ 添加字段: ${updatedField}`)
          await sequelize.query(`ALTER TABLE ${tableName} ADD COLUMN ${updatedField} BIGINT DEFAULT ${Math.floor(Date.now() / 1000)}`)
        }
        
        // 更新现有记录的时间戳
        if (createdField && updatedField) {
          const currentTime = Math.floor(Date.now() / 1000)
          await sequelize.query(`UPDATE ${tableName} SET ${createdField} = ${currentTime}, ${updatedField} = ${currentTime} WHERE ${createdField} IS NULL OR ${updatedField} IS NULL`)
          console.log(`  ✅ 更新现有记录时间戳`)
        }
        
      } catch (error) {
        console.warn(`⚠️ 处理表 ${tableName} 时出现警告:`, error.message)
      }
    }
    
    console.log('🎉 安全迁移完成！')
    console.log('📊 所有表已添加时间戳字段')
    console.log('📅 现有数据已设置默认时间戳')
    
  } catch (error) {
    console.error('❌ 迁移失败:', error)
    throw error
  } finally {
    await sequelize.close()
  }
}

// 运行迁移
if (import.meta.url === `file://${process.argv[1]}`) {
  safeMigrateTimestamps()
    .then(() => {
      console.log('✅ 安全迁移脚本执行完成')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ 安全迁移脚本执行失败:', error)
      process.exit(1)
    })
}

export default safeMigrateTimestamps
