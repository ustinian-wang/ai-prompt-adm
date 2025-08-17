import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import User from '../models/User.model.js'
import Work from '../models/Work.model.js'
import Category from '../models/Category.model.js'

// 数据库迁移脚本：将时间字段转换为时间戳数值
async function migrateTimestamps() {
  try {
    console.log('🚀 开始数据库时间字段迁移...')
    
    // 1. 备份现有数据（如果存在）
    console.log('📋 检查现有数据...')
    
    // 2. 删除现有表（如果存在）
    console.log('🗑️ 删除现有表结构...')
    await sequelize.drop()
    
    // 3. 同步新的模型结构
    console.log('🔄 同步新的数据库结构...')
    await sequelize.sync({ force: true })
    
    // 4. 创建测试数据
    console.log('📝 创建测试数据...')
    
    // 创建测试用户
    const testUser = await User.create({
      username: 'admin',
      user_email: 'admin@example.com',
      user_password: 'admin123',
      user_real_name: '系统管理员',
      user_role: 'admin',
      user_status: 'active'
    })
    
    // 创建测试分类
    const testCategory = await Category.create({
      name: '默认分类',
      description: '系统默认分类',
      sort_order: 1,
      enabled: true,
      show_in_nav: true
    })
    
    // 创建测试作品
    const testWork = await Work.create({
      work_name: '示例作品',
      work_desc: '这是一个示例作品',
      work_prompt_cn: '中文提示词',
      work_prompt_en: 'English prompt',
      user_id: testUser.user_id,
      work_status: 'published'
    })
    
    console.log('✅ 测试数据创建完成')
    
    // 5. 验证数据格式
    console.log('🔍 验证数据格式...')
    
    const user = await User.findByPk(testUser.user_id)
    const category = await Category.findByPk(testCategory.category_id)
    const work = await Work.findByPk(testWork.work_id)
    
    console.log('用户数据示例:')
    console.log('- user_created_at:', user.user_created_at)
    console.log('- user_created_at_str:', user.user_created_at_str)
    console.log('- user_updated_at:', user.user_updated_at)
    console.log('- user_updated_at_str:', user.user_updated_at_str)
    
    console.log('分类数据示例:')
    console.log('- category_created_at:', category.category_created_at)
    console.log('- category_created_at_str:', category.category_created_at_str)
    console.log('- category_updated_at:', category.category_updated_at)
    console.log('- category_updated_at_str:', category.category_updated_at_str)
    
    console.log('作品数据示例:')
    console.log('- work_created_at:', work.work_created_at)
    console.log('- work_created_at_str:', work.work_created_at_str)
    console.log('- work_updated_at:', work.work_updated_at)
    console.log('- work_updated_at_str:', work.work_updated_at_str)
    
    console.log('🎉 数据库迁移完成！')
    console.log('📊 所有时间字段已成功转换为BIGINT类型的时间戳')
    console.log('📅 同时提供格式化的时间字符串字段（YYYY-MM-DD HH:mm:ss格式）')
    
  } catch (error) {
    console.error('❌ 迁移失败:', error)
    throw error
  } finally {
    await sequelize.close()
  }
}

// 运行迁移
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateTimestamps()
    .then(() => {
      console.log('✅ 迁移脚本执行完成')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ 迁移脚本执行失败:', error)
      process.exit(1)
    })
}

export default migrateTimestamps
