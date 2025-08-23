#!/usr/bin/env node

/**
 * 测试虚拟字段是否正常工作的脚本
 * 验证 user_updated_at_str 等格式化时间字段是否正确生成
 */

console.log('🚀 开始执行测试脚本...')

async function testVirtualFields() {
  try {
    console.log('📦 正在导入模块...')
    
    // 动态导入模块
    const sequelize = (await import('../config/database.js')).default
    const User = (await import('../models/User.model.js')).default
    const Work = (await import('../models/Work.model.js')).default
    const Category = (await import('../models/Category.model.js')).default
    
    console.log('📦 模块导入完成')
    console.log('🧪 开始测试虚拟字段...')
    
    // 1. 测试数据库连接
    console.log('🔌 正在连接数据库...')
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')
    
    // 2. 测试用户模型虚拟字段
    console.log('\n👤 测试用户模型虚拟字段...')
    try {
      const users = await User.findAll({
        limit: 3,
        attributes: { exclude: ['user_password'] }
      })
      
      if (users.length > 0) {
        const user = users[0]
        const userJson = user.toJSON()
        
        console.log('用户原始数据:')
        console.log('  user_created_at:', userJson.user_created_at)
        console.log('  user_updated_at:', userJson.user_updated_at)
        console.log('  user_created_at_str:', userJson.user_created_at_str)
        console.log('  user_updated_at_str:', userJson.user_updated_at_str)
        
        if (userJson.user_created_at_str && userJson.user_updated_at_str) {
          console.log('✅ 用户模型虚拟字段生成成功')
        } else {
          console.log('❌ 用户模型虚拟字段生成失败')
        }
      } else {
        console.log('⚠️ 没有找到用户数据')
      }
    } catch (error) {
      console.log('❌ 测试用户模型失败:', error.message)
    }
    
    // 3. 测试作品模型虚拟字段
    console.log('\n🎨 测试作品模型虚拟字段...')
    try {
      const works = await Work.findAll({
        limit: 3
      })
      
      if (works.length > 0) {
        const work = works[0]
        const workJson = work.toJSON()
        
        console.log('作品原始数据:')
        console.log('  work_created_at:', workJson.work_created_at)
        console.log('  work_updated_at:', workJson.work_updated_at)
        console.log('  work_created_at_str:', workJson.work_created_at_str)
        console.log('  work_updated_at_str:', workJson.work_updated_at_str)
        
        if (workJson.work_created_at_str && workJson.work_updated_at_str) {
          console.log('✅ 作品模型虚拟字段生成成功')
        } else {
          console.log('❌ 作品模型虚拟字段生成失败')
        }
      } else {
        console.log('⚠️ 没有找到作品数据')
      }
    } catch (error) {
      console.log('❌ 测试作品模型失败:', error.message)
    }
    
    // 4. 测试分类模型虚拟字段
    console.log('\n📂 测试分类模型虚拟字段...')
    try {
      const categories = await Category.findAll({
        limit: 3
      })
      
      if (categories.length > 0) {
        const category = categories[0]
        const categoryJson = category.toJSON()
        
        console.log('分类原始数据:')
        console.log('  category_created_at:', categoryJson.category_created_at)
        console.log('  category_updated_at:', categoryJson.category_updated_at)
        console.log('  category_created_at_str:', categoryJson.category_created_at_str)
        console.log('  category_updated_at_str:', categoryJson.category_updated_at_str)
        
        if (categoryJson.category_created_at_str && categoryJson.category_updated_at_str) {
          console.log('✅ 分类模型虚拟字段生成成功')
        } else {
          console.log('❌ 分类模型虚拟字段生成失败')
        }
      } else {
        console.log('⚠️ 没有找到分类数据')
      }
    } catch (error) {
      console.log('❌ 测试分类模型失败:', error.message)
    }
    
    // 5. 测试用户服务方法
    console.log('\n🔧 测试用户服务方法...')
    try {
      const UserService = await import('../services/User.service.js')
      const userList = await UserService.svr_getUserList({
        page: 1,
        pageSize: 3
      })
      
      if (userList.list && userList.list.length > 0) {
        const user = userList.list[0]
        console.log('用户服务返回数据:')
        console.log('  user_created_at:', user.user_created_at)
        console.log('  user_updated_at:', user.user_updated_at)
        console.log('  user_created_at_str:', user.user_created_at_str)
        console.log('  user_updated_at_str:', user.user_updated_at_str)
        
        if (user.user_created_at_str && user.user_updated_at_str) {
          console.log('✅ 用户服务虚拟字段生成成功')
        } else {
          console.log('❌ 用户服务虚拟字段生成失败')
        }
      } else {
        console.log('⚠️ 用户服务没有返回数据')
      }
    } catch (error) {
      console.log('❌ 测试用户服务失败:', error.message)
    }
    
    console.log('\n🎉 虚拟字段测试完成！')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
    throw error
  } finally {
    // The original code had sequelize.close(), but sequelize is no longer imported.
    // Assuming the intent was to remove this line as it's no longer available.
    // If sequelize was meant to be a global or passed in, this would need adjustment.
    // For now, removing it as it's not defined.
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testVirtualFields()
    .then(() => {
      console.log('✅ 所有测试完成')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ 测试失败:', error)
      process.exit(1)
    })
}
