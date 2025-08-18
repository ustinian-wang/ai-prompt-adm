import sequelize, { testConnection } from '../config/database.js'
import { User, Work, Category } from '../models/index.js'

async function testDatabase() {
  console.log('🧪 开始测试数据库...')
  
  try {
    // 测试数据库连接
    console.log('🔌 测试数据库连接...')
    const connected = await testConnection()
    if (!connected) {
      console.error('❌ 数据库连接失败')
      process.exit(1)
    }
    
    // 检查表是否存在
    console.log('🔍 检查数据库表...')
    const tables = await sequelize.showAllSchemas()
    console.log('📊 数据库中的表:')
    for (const table of tables) {
      console.log(`   - ${table.name}`)
    }
    
    // 尝试查询用户表
    console.log('👤 测试用户表查询...')
    try {
      const userCount = await User.count()
      console.log(`✅ 用户表查询成功，共有 ${userCount} 个用户`)
    } catch (error) {
      console.error('❌ 用户表查询失败:', error.message)
    }
    
    // 尝试查询分类表
    console.log('📁 测试分类表查询...')
    try {
      const categoryCount = await Category.count()
      console.log(`✅ 分类表查询成功，共有 ${categoryCount} 个分类`)
    } catch (error) {
      console.error('❌ 分类表查询失败:', error.message)
    }
    
    // 尝试查询作品表
    console.log('📝 测试作品表查询...')
    try {
      const workCount = await Work.count()
      console.log(`✅ 作品表查询成功，共有 ${workCount} 个作品`)
    } catch (error) {
      console.error('❌ 作品表查询失败:', error.message)
    }
    
    console.log('🎉 数据库测试完成！')
    
  } catch (error) {
    console.error('❌ 数据库测试失败:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabase()
}

export default testDatabase
