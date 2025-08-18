import sequelize, { testConnection, syncDatabase } from '../config/database.js'
import { User, Work, Category } from '../models/index.js'

async function initDatabase() {
  console.log('🗄️ 开始初始化数据库...')
  
  try {
    // 测试数据库连接
    console.log('🔌 测试数据库连接...')
    const connected = await testConnection()
    if (!connected) {
      console.error('❌ 数据库连接失败')
      process.exit(1)
    }
    
    // 同步数据库（创建表）
    console.log('🔄 同步数据库表结构...')
    await syncDatabase(false)
    
    // 验证表是否创建成功
    console.log('🔍 验证表创建状态...')
    const tables = await sequelize.showAllSchemas()
    console.log('📊 已创建的表:')
    for (const table of tables) {
      console.log(`   - ${table.name}`)
    }
    
    // 检查关键表是否存在
    const userTableExists = await sequelize.getQueryInterface().tableExists('user')
    const workTableExists = await sequelize.getQueryInterface().tableExists('work')
    const categoryTableExists = await sequelize.getQueryInterface().tableExists('category')
    
    console.log('📋 关键表状态:')
    console.log(`   - user表: ${userTableExists ? '✅ 存在' : '❌ 不存在'}`)
    console.log(`   - work表: ${workTableExists ? '✅ 存在' : '❌ 不存在'}`)
    console.log(`   - category表: ${categoryTableExists ? '✅ 存在' : '❌ 不存在'}`)
    
    if (!userTableExists || !workTableExists || !categoryTableExists) {
      console.error('❌ 关键表创建失败，尝试强制重建...')
      await syncDatabase(true)
      console.log('✅ 强制重建完成')
    }
    
    console.log('🎉 数据库初始化完成！')
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase()
}

export default initDatabase
