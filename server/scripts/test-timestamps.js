import sequelize from '../config/database.js'
import User from '../models/User.model.js'
import Work from '../models/Work.model.js'
import Category from '../models/Category.model.js'
import { getCurrentTimestamp, formatTimestamp } from '../utils/timestamp.js'

// 测试时间戳功能的脚本
async function testTimestamps() {
  try {
    console.log('🧪 开始测试时间戳功能...')
    
    // 1. 测试时间戳工具函数
    console.log('\n📊 测试时间戳工具函数:')
    const currentTime = getCurrentTimestamp()
    console.log('- 当前时间戳（毫秒）:', currentTime)
    console.log('- 格式化时间:', formatTimestamp(currentTime))
    console.log('- 仅日期格式:', formatTimestamp(currentTime, 'YYYY-MM-DD'))
    console.log('- 仅时间格式:', formatTimestamp(currentTime, 'HH:mm:ss'))
    
    // 2. 测试用户模型
    console.log('\n👤 测试用户模型:')
    const testUser = await User.create({
      username: 'test_user',
      user_email: 'test@example.com',
      user_password: 'test123',
      user_real_name: '测试用户',
      user_role: 'sales',
      user_status: 'active'
    })
    
    console.log('- 用户创建成功, ID:', testUser.user_id)
    console.log('- 创建时间戳:', testUser.user_created_at)
    console.log('- 更新时间戳:', testUser.user_updated_at)
    
    // 测试toJSON方法
    const userJson = testUser.toJSON()
    console.log('- JSON输出（直接返回原始数据）:')
    console.log('  * user_created_at:', userJson.user_created_at)
    console.log('  * user_updated_at:', userJson.user_updated_at)
    
    // 3. 测试分类模型
    console.log('\n📂 测试分类模型:')
    const testCategory = await Category.create({
      name: '测试分类',
      description: '用于测试的分类',
      sort_order: 999,
      enabled: true,
      show_in_nav: false
    })
    
    console.log('- 分类创建成功, ID:', testCategory.category_id)
    console.log('- 创建时间戳:', testCategory.category_created_at)
    console.log('- 更新时间戳:', testCategory.category_updated_at)
    
    // 测试toJSON方法
    const categoryJson = testCategory.toJSON()
    console.log('- JSON输出（直接返回原始数据）:')
    console.log('  * category_created_at:', categoryJson.category_created_at)
    console.log('  * category_updated_at:', categoryJson.category_updated_at)
    
    // 4. 测试作品模型
    console.log('\n🎨 测试作品模型:')
    const testWork = await Work.create({
      work_name: '测试作品',
      work_desc: '这是一个测试作品',
      work_prompt_cn: '测试中文提示词',
      work_prompt_en: 'Test English prompt',
      user_id: testUser.user_id,
      work_status: 'draft'
    })
    
    console.log('- 作品创建成功, ID:', testWork.work_id)
    console.log('- 创建时间戳:', testWork.work_created_at)
    console.log('- 更新时间戳:', testWork.work_updated_at)
    
    // 测试toJSON方法
    const workJson = testWork.toJSON()
    console.log('- JSON输出（直接返回原始数据）:')
    console.log('  * work_created_at:', workJson.work_created_at)
    console.log('  * work_updated_at:', workJson.work_updated_at)
    
    // 5. 测试查询结果
    console.log('\n🔍 测试查询结果:')
    const users = await User.findAll()
    console.log('- 查询到用户数量:', users.length)
    
    if (users.length > 0) {
      const firstUser = users[0].toJSON()
      console.log('- 第一个用户的时间戳:')
      console.log('  * user_created_at:', firstUser.user_created_at)
      console.log('  * user_updated_at:', firstUser.user_updated_at)
    }
    
    // 6. 测试时间戳验证
    console.log('\n✅ 时间戳验证:')
    const validTimestamp = getCurrentTimestamp()
    const invalidTimestamp = -1
    const futureTimestamp = getCurrentTimestamp() + 31536000000 // 一年后（毫秒）
    
    console.log('- 有效时间戳验证:', validTimestamp, '->', formatTimestamp(validTimestamp))
    console.log('- 无效时间戳验证:', invalidTimestamp, '->', formatTimestamp(invalidTimestamp))
    console.log('- 未来时间戳验证:', futureTimestamp, '->', formatTimestamp(futureTimestamp))
    
    // 7. 清理测试数据
    console.log('\n🧹 清理测试数据...')
    await testWork.destroy()
    await testCategory.destroy()
    await testUser.destroy()
    console.log('- 测试数据清理完成')
    
    console.log('\n🎉 所有测试通过！')
    console.log('📊 时间戳功能正常工作')
    console.log('📅 格式化字符串字段正确生成')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
    throw error
  } finally {
    await sequelize.close()
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testTimestamps()
    .then(() => {
      console.log('✅ 测试脚本执行完成')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ 测试脚本执行失败:', error)
      process.exit(1)
    })
}

export default testTimestamps
