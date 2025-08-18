import sequelize, { testConnection } from '../config/database.js'
import { User, Category, Work } from '../models/index.js'

async function seed() {
  console.log('🌱 开始检查并插入初始数据...')
  
  // 测试数据库连接
  const connected = await testConnection()
  if (!connected) {
    console.error('❌ 数据库连接失败，无法插入数据')
    process.exit(1)
  }
  
  try {
    // 检查是否已有数据
    const existingCategories = await Category.count()
    const existingUsers = await User.count()
    const existingWorks = await Work.count()
    
    console.log(`📊 当前数据统计:`)
    console.log(`   - 分类: ${existingCategories} 个`)
    console.log(`   - 用户: ${existingUsers} 个`)
    console.log(`   - 作品: ${existingWorks} 个`)
    
    // 如果已有数据，跳过插入
    if (existingCategories > 0 && existingUsers > 0) {
      console.log('✅ 数据库已有初始数据，跳过种子数据插入')
      return
    }
    
    console.log('🆕 检测到新数据库，开始插入初始数据...')
    
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
    ], { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['description', 'sort_order']
    })
    
    console.log(`✅ 创建了 ${categories.length} 个分类`)
    
    // 插入默认管理员用户
    console.log('👤 创建默认管理员用户...')
    const [adminUser, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        user_email: 'admin@example.com',
        user_password: '123456',
        user_role: 'admin',
        user_status: 'active',
        user_real_name: '系统管理员'
      }
    })
    
    if (created) {
      console.log('✅ 创建了新的管理员用户:', adminUser.username)
    } else {
      console.log('ℹ️  管理员用户已存在:', adminUser.username)
    }
    
    // 插入示例作品（只在没有作品时）
    if (existingWorks === 0) {
      console.log('📝 创建示例作品...')
      const sampleWork = await Work.create({
        work_name: '示例AI写作提示词',
        work_desc: '这是一个示例作品，展示如何使用AI写作',
        work_prompt_cn: '请帮我写一篇关于人工智能的文章，要求：\n1. 字数不少于800字\n2. 语言通俗易懂\n3. 包含实际应用案例\n4. 结构清晰，逻辑严密',
        user_id: adminUser.user_id,
        work_status: 'published'
      })
      
      console.log('✅ 创建了示例作品:', sampleWork.work_name)
    } else {
      console.log('ℹ️  示例作品已存在，跳过创建')
    }
    
    console.log('🎉 数据种子检查完成！')
    console.log('📊 最终数据统计:')
    const finalCategories = await Category.count()
    const finalUsers = await User.count()
    const finalWorks = await Work.count()
    console.log(`   - 分类: ${finalCategories} 个`)
    console.log(`   - 用户: ${finalUsers} 个`)
    console.log(`   - 作品: ${finalWorks} 个`)
    
    // 显示默认账号信息
    if (created) {
      console.log('')
      console.log('🔑 默认管理员账号信息:')
      console.log('   用户名: admin')
      console.log('   密码: 123456')
      console.log('   邮箱: admin@example.com')
      console.log('   角色: admin')
      console.log('')
      console.log('⚠️  请及时修改默认密码！')
    }
    
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
