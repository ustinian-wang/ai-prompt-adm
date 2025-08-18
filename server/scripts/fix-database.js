import sequelize, { testConnection, syncDatabase } from '../config/database.js'
import { User, Work, Category } from '../models/index.js'
import fs from 'fs'
import path from 'path'

async function fixDatabase() {
  console.log('🔧 开始修复数据库...')
  
  try {
    // 测试数据库连接
    console.log('🔌 测试数据库连接...')
    const connected = await testConnection()
    if (!connected) {
      console.error('❌ 数据库连接失败')
      process.exit(1)
    }
    
    // 检查数据库文件
    const dbPath = path.join(process.cwd(), 'data', 'database.sqlite')
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath)
      console.log(`📊 数据库文件存在，大小: ${(stats.size / 1024).toFixed(2)} KB`)
    } else {
      console.log('📊 数据库文件不存在，将创建新文件')
    }
    
    // 强制重建所有表
    console.log('🔄 强制重建数据库表...')
    await syncDatabase(true)
    
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
      console.error('❌ 关键表创建失败')
      process.exit(1)
    }
    
    // 插入初始数据
    console.log('🌱 插入初始数据...')
    
    // 创建默认分类
    const categories = await Category.bulkCreate([
      {
        name: 'AI写作',
        description: 'AI写作相关提示词',
        sort_order: 1
      },
      {
        name: 'AI绘画',
        description: 'AI绘画相关提示词',
        sort_order: 2
      },
      {
        name: 'AI编程',
        description: 'AI编程相关提示词',
        sort_order: 3
      },
      {
        name: 'AI对话',
        description: 'AI对话相关提示词',
        sort_order: 4
      }
    ])
    
    console.log(`✅ 创建了 ${categories.length} 个分类`)
    
    // 创建默认管理员用户
    const adminUser = await User.create({
      username: 'admin',
      user_email: 'admin@example.com',
      user_password: '123456',
      user_role: 'admin',
      user_status: 'active',
      user_real_name: '系统管理员'
    })
    
    console.log('✅ 创建了管理员用户:', adminUser.username)
    
    // 创建示例作品
    const sampleWork = await Work.create({
      work_name: '示例AI写作提示词',
      work_desc: '这是一个示例作品，展示如何使用AI写作',
      work_prompt_cn: '请帮我写一篇关于人工智能的文章，要求：\n1. 字数不少于800字\n2. 语言通俗易懂\n3. 包含实际应用案例\n4. 结构清晰，逻辑严密',
      user_id: adminUser.user_id,
      work_status: 'published'
    })
    
    console.log('✅ 创建了示例作品:', sampleWork.work_name)
    
    // 最终验证
    console.log('🔍 最终数据验证...')
    const userCount = await User.count()
    const categoryCount = await Category.count()
    const workCount = await Work.count()
    
    console.log('📊 最终数据统计:')
    console.log(`   - 用户: ${userCount} 个`)
    console.log(`   - 分类: ${categoryCount} 个`)
    console.log(`   - 作品: ${workCount} 个`)
    
    console.log('🎉 数据库修复完成！')
    console.log('🔑 默认登录信息:')
    console.log('   用户名: admin')
    console.log('   密码: 123456')
    
  } catch (error) {
    console.error('❌ 数据库修复失败:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  fixDatabase()
}

export default fixDatabase
