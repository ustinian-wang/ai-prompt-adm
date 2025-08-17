import sequelize, { testConnection } from '../config/database.js'
import { User, Category, Work } from '../models/index.js'

async function seed() {
  console.log('🌱 开始插入初始数据...')
  
  // 测试数据库连接
  const connected = await testConnection()
  if (!connected) {
    console.error('❌ 数据库连接失败，无法插入数据')
    process.exit(1)
  }
  
  try {
    // 插入默认分类
    console.log('📁 创建默认分类...')
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
    ], { ignoreDuplicates: true })
    
    console.log(`✅ 创建了 ${categories.length} 个分类`)
    
    // 插入默认管理员用户
    console.log('👤 创建默认管理员用户...')
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin',
      status: 'active'
    })
    
    console.log('✅ 创建了管理员用户:', adminUser.username)
    
    // 插入示例作品
    console.log('📝 创建示例作品...')
    const sampleWork = await Work.create({
      title: '示例AI写作提示词',
      description: '这是一个示例作品，展示如何使用AI写作',
      content: '请帮我写一篇关于人工智能的文章...',
      category_id: categories[0].id,
      user_id: adminUser.id,
      status: 'published'
    })
    
    console.log('✅ 创建了示例作品:', sampleWork.title)
    
    console.log('🎉 数据种子插入完成！')
    console.log('📊 数据统计:')
    console.log(`   - 分类: ${categories.length} 个`)
    console.log(`   - 用户: 1 个`)
    console.log(`   - 作品: 1 个`)
    
  } catch (error) {
    console.error('❌ 数据种子插入失败:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
}
