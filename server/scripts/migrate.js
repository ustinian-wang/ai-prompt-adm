import sequelize, { testConnection, syncDatabase } from '../config/database.js'
import '../models/index.js'

async function migrate() {
  console.log('🚀 开始数据库迁移...')
  
  // 测试数据库连接
  const connected = await testConnection()
  if (!connected) {
    console.error('❌ 数据库连接失败，无法进行迁移')
    process.exit(1)
  }
  
  try {
    // 同步数据库（创建表）
    await syncDatabase(false) // false表示不强制重建表
    
    console.log('✅ 数据库迁移完成！')
    console.log('📊 已创建的表:')
    
    // 显示所有表
    const tables = await sequelize.showAllSchemas()
    for (const table of tables) {
      console.log(`   - ${table.name}`)
    }
    
  } catch (error) {
    console.error('❌ 数据库迁移失败:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate()
}
