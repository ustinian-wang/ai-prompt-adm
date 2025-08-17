#!/usr/bin/env node

/**
 * 将数据库中的时间戳从秒级更新为毫秒级
 * 这个脚本会更新所有现有记录的时间戳字段
 */

import sequelize from '../config/database.js'
import User from '../models/User.model.js'
import Work from '../models/Work.model.js'
import Category from '../models/Category.model.js'

async function updateTimestampsToMilliseconds() {
  try {
    console.log('🔄 开始将时间戳从秒级更新为毫秒级...')
    
    // 1. 更新用户表
    console.log('\n👤 更新用户表时间戳...')
    try {
      const userCount = await User.update(
        {
          user_created_at: sequelize.literal('user_created_at * 1000'),
          user_updated_at: sequelize.literal('user_updated_at * 1000')
        },
        {
          where: {
            user_created_at: {
              [sequelize.Op.lt]: 1000000000000 // 小于13位数字（毫秒时间戳）
            }
          }
        }
      )
      console.log(`✅ 更新了 ${userCount[0]} 条用户记录的时间戳`)
    } catch (error) {
      console.log('⚠️ 用户表更新跳过（可能已经是毫秒级）:', error.message)
    }
    
    // 2. 更新作品表
    console.log('\n🎨 更新作品表时间戳...')
    try {
      const workCount = await Work.update(
        {
          work_created_at: sequelize.literal('work_created_at * 1000'),
          work_updated_at: sequelize.literal('work_updated_at * 1000')
        },
        {
          where: {
            work_created_at: {
              [sequelize.Op.lt]: 1000000000000 // 小于13位数字（毫秒时间戳）
            }
          }
        }
      )
      console.log(`✅ 更新了 ${workCount[0]} 条作品记录的时间戳`)
    } catch (error) {
      console.log('⚠️ 作品表更新跳过（可能已经是毫秒级）:', error.message)
    }
    
    // 3. 更新分类表
    console.log('\n📂 更新分类表时间戳...')
    try {
      const categoryCount = await Category.update(
        {
          category_created_at: sequelize.literal('category_created_at * 1000'),
          category_updated_at: sequelize.literal('category_updated_at * 1000')
        },
        {
          where: {
            category_created_at: {
              [sequelize.Op.lt]: 1000000000000 // 小于13位数字（毫秒时间戳）
            }
          }
        }
      )
      console.log(`✅ 更新了 ${categoryCount[0]} 条分类记录的时间戳`)
    } catch (error) {
      console.log('⚠️ 分类表更新跳过（可能已经是毫秒级）:', error.message)
    }
    
    // 4. 验证更新结果
    console.log('\n🔍 验证更新结果...')
    
    // 检查用户表
    try {
      const users = await User.findAll({ limit: 5 })
      if (users.length > 0) {
        const user = users[0]
        console.log(`用户表示例 - ID: ${user.user_id}`)
        console.log(`  创建时间: ${user.user_created_at} (${new Date(user.user_created_at).toLocaleString()})`)
        console.log(`  更新时间: ${user.user_updated_at} (${new Date(user.user_updated_at).toLocaleString()})`)
      }
    } catch (error) {
      console.log('⚠️ 无法检查用户表数据')
    }
    
    // 检查作品表
    try {
      const works = await Work.findAll({ limit: 5 })
      if (works.length > 0) {
        const work = works[0]
        console.log(`作品表示例 - ID: ${work.work_id}`)
        console.log(`  创建时间: ${work.work_created_at} (${new Date(work.work_created_at).toLocaleString()})`)
        console.log(`  更新时间: ${work.work_updated_at} (${new Date(work.work_updated_at).toLocaleString()})`)
      }
    } catch (error) {
      console.log('⚠️ 无法检查作品表数据')
    }
    
    // 检查分类表
    try {
      const categories = await Category.findAll({ limit: 5 })
      if (categories.length > 0) {
        const category = categories[0]
        console.log(`分类表示例 - ID: ${category.category_id}`)
        console.log(`  创建时间: ${category.category_created_at} (${new Date(category.category_created_at).toLocaleString()})`)
        console.log(`  更新时间: ${category.category_updated_at} (${new Date(category.category_updated_at).toLocaleString()})`)
      }
    } catch (error) {
      console.log('⚠️ 无法检查分类表数据')
    }
    
    console.log('\n🎉 时间戳更新完成！')
    console.log('📊 所有时间字段现在使用毫秒级时间戳存储')
    console.log('⚠️ 注意：新创建和更新的记录将自动使用毫秒级时间戳')
    
  } catch (error) {
    console.error('❌ 更新失败:', error)
    throw error
  } finally {
    await sequelize.close()
  }
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  updateTimestampsToMilliseconds()
    .then(() => {
      console.log('✅ 脚本执行完成')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error)
      process.exit(1)
    })
}

export default updateTimestampsToMilliseconds
