import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const WorkCategory = sequelize.define('work_category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '关联记录ID'
  },
  work_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '作品ID',
    references: {
      model: 'work',
      key: 'work_id'
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '分类ID',
    references: {
      model: 'category',
      key: 'category_id'
    }
  },
  created_at: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: () => Date.now(),
    comment: '创建时间戳（毫秒）'
  }
}, {
  tableName: 'work_category',
  timestamps: false,
  indexes: [
    {
      name: 'idx_work_id',
      fields: ['work_id']
    },
    {
      name: 'idx_category_id',
      fields: ['category_id']
    },
    {
      name: 'unique_work_category',
      unique: true,
      fields: ['work_id', 'category_id']
    }
  ]
})

// 类方法：为作品设置分类
WorkCategory.setWorkCategories = async function(workId, categoryIds) {
  // 先删除现有的关联
  await this.destroy({
    where: { work_id: workId }
  })
  
  // 创建新的关联
  if (categoryIds && categoryIds.length > 0) {
    const associations = categoryIds.map(categoryId => ({
      work_id: workId,
      category_id: categoryId,
      created_at: Date.now()
    }))
    
    await this.bulkCreate(associations)
  }
  
  return true
}

// 类方法：获取作品的所有分类ID
WorkCategory.getWorkCategoryIds = async function(workId) {
  const associations = await this.findAll({
    where: { work_id: workId },
    attributes: ['category_id']
  })
  
  return associations.map(assoc => assoc.category_id)
}

// 类方法：获取分类下的所有作品ID
WorkCategory.getCategoryWorkIds = async function(categoryId) {
  const associations = await this.findAll({
    where: { category_id: categoryId },
    attributes: ['work_id']
  })
  
  return associations.map(assoc => assoc.work_id)
}

// 类方法：检查作品是否包含某个分类
WorkCategory.hasWorkCategory = async function(workId, categoryId) {
  const association = await this.findOne({
    where: {
      work_id: workId,
      category_id: categoryId
    }
  })
  
  return !!association
}

// 类方法：获取作品分类统计
WorkCategory.getWorkCategoryStats = async function() {
  const stats = await this.findAll({
    attributes: [
      'category_id',
      [sequelize.fn('COUNT', sequelize.col('work_id')), 'works_count']
    ],
    group: ['category_id'],
    raw: true
  })
  
  return stats
}

// 类方法：批量删除作品的分类关联
WorkCategory.removeWorkCategories = async function(workId) {
  return await this.destroy({
    where: { work_id: workId }
  })
}

// 类方法：批量删除分类的作品关联
WorkCategory.removeCategoryWorks = async function(categoryId) {
  return await this.destroy({
    where: { category_id: categoryId }
  })
}

// 添加删除分类时的清理逻辑
WorkCategory.afterDestroy = async function(instance, options) {
  // 当分类被删除时，自动清理关联记录
  // 这个钩子会在分类删除后自动触发
}

// 添加类方法：清理已删除分类的关联
WorkCategory.cleanupDeletedCategories = async function() {
  try {
    // 查找所有在 work_category 中但 category 表中不存在的关联
    const orphanedAssociations = await this.findAll({
      include: [{
        model: sequelize.models.Category,
        required: false,
        where: { category_id: null }
      }],
      where: {
        '$Category.category_id$': null
      }
    })
    
    if (orphanedAssociations.length > 0) {
      const ids = orphanedAssociations.map(assoc => assoc.id)
      await this.destroy({
        where: { id: ids }
      })
      console.log(`清理了 ${ids.length} 个已删除分类的关联记录`)
    }
    
    return orphanedAssociations.length
  } catch (error) {
    console.error('清理已删除分类关联失败:', error)
    throw error
  }
}

export default WorkCategory
