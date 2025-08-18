import { DataTypes, Op } from 'sequelize'
import sequelize from '../config/database.js'

const Category = sequelize.define('category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '分类ID'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '分类名称',
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '分类描述'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '排序权重，数字越小排序越靠前'
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '分类图标'
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '是否启用'
  },
  show_in_nav: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '是否在导航中显示'
  },
  category_created_at: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: () => Date.now(),
    comment: '创建时间戳（毫秒）'
  },
  category_updated_at: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: () => Date.now(),
    comment: '更新时间戳（毫秒）'
  }
}, {
  tableName: 'category',
  timestamps: false,
  indexes: [
    {
      name: 'idx_sort_order',
      fields: ['sort_order']
    },
    {
      name: 'idx_enabled',
      fields: ['enabled']
    }
  ]
})

// 分类模型，只支持一级分类

// 实例方法：获取分类基本信息
Category.prototype.getBasicInfo = function() {
  return {
    category_id: this.category_id,
    name: this.name,
    description: this.description,
    sort_order: this.sort_order,
    icon: this.icon,
    enabled: this.enabled,
    show_in_nav: this.show_in_nav
  }
}

// 类方法：获取所有分类
Category.getAll = async function(options = {}) {
  const { enabled = true, showInNav = null } = options
  
  const where = { enabled }
  if (showInNav !== null) {
    where.show_in_nav = showInNav
  }
  
  return await Category.findAll({
    where,
    order: [['sort_order', 'ASC']]
  })
}

// 类方法：获取分类列表（带分页）
Category.getList = async function(options = {}) {
  const {
    page = 1,
    limit = 20,
    enabled = null,
    search = null,
    orderBy = 'sort_order',
    orderDirection = 'ASC'
  } = options
  
  const where = {}
  if (enabled !== null) {
    where.enabled = enabled
  }
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ]
  }
  
  const offset = (page - 1) * limit
  
  const result = await Category.findAndCountAll({
    where,
    order: [[orderBy, orderDirection]],
    limit,
    offset
  })
  
  return {
    list: result.rows,
    total: result.count,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit)
  }
}

// 类方法：创建分类
Category.createCategory = async function(categoryData) {
  return await Category.create(categoryData)
}

// 类方法：更新分类
Category.updateCategory = async function(categoryId, updateData) {
  const category = await Category.findByPk(categoryId)
  if (!category) {
    throw new Error('分类不存在')
  }
  
  return await category.update(updateData)
}

// 类方法：删除分类
Category.deleteCategory = async function(categoryId) {
  const category = await Category.findByPk(categoryId)
  if (!category) {
    throw new Error('分类不存在')
  }
  
  // 检查是否有关联的作品
  // 这里需要根据实际的作品模型来检查
  // const worksCount = await Work.count({
  //   where: { category_id: categoryId }
  // })
  // 
  // if (worksCount > 0) {
  //   throw new Error('该分类下还有作品，无法删除')
  // }
  
  await category.destroy()
  return true
}

// 类方法：批量更新排序
Category.updateSortOrder = async function(sortData) {
  const updates = sortData.map(({ category_id, sort_order }) => ({
    category_id,
    sort_order
  }))
  
  for (const update of updates) {
    await Category.update(
      { sort_order: update.sort_order },
      { where: { category_id: update.category_id } }
    )
  }
  
  return true
}

// 类方法：获取分类统计信息
Category.getStats = async function() {
  const stats = await Category.findAll({
    attributes: [
      'category_id',
      'name',
      [sequelize.fn('COUNT', sequelize.col('works.work_id')), 'works_count']
    ],
    include: [
      {
        model: sequelize.models.Work || sequelize.models.work,
        as: 'works',
        attributes: [],
        required: false
      }
    ],
    group: ['category.category_id', 'category.name'],
    order: [['sort_order', 'ASC']]
  })
  
  return stats
}

// 分类模型已完成，支持基本的CRUD操作

// 确保时间字段返回原始毫秒时间戳，并添加格式化的时间字符串
Category.prototype.toJSON = function() {
  const data = this.get();
  
  // 确保时间字段返回原始数值，而不是格式化的字符串
  if (data.category_created_at) {
    data.category_created_at = parseInt(data.category_created_at);
    // 添加格式化的时间字符串字段
    data.category_created_at_str = this.formatTimestamp(data.category_created_at);
  }
  
  if (data.category_updated_at) {
    data.category_updated_at = parseInt(data.category_updated_at);
    // 添加格式化的时间字符串字段
    data.category_updated_at_str = this.formatTimestamp(data.category_updated_at);
  }
  
  return data;
}

// 格式化时间戳为 YYYY-MM-DD HH:mm:ss 格式
Category.prototype.formatTimestamp = function(timestamp) {
  if (!timestamp) return null;
  
  const date = new Date(timestamp);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) return null;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default Category
