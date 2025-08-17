import { Category } from '../models/index.js'
import { HttpResult } from '../utils/HttpResult.js'

class CategoryService {
  /**
   * 获取分类列表
   * @param {Object} options 查询选项
   * @returns {Promise<Object>} 分类列表和分页信息
   */
  async getCategoryList(options = {}) {
    try {
      const result = await Category.getList(options)
      return HttpResult.success(result)
    } catch (error) {
      console.error('获取分类列表失败:', error)
      return HttpResult.error('获取分类列表失败', error.message)
    }
  }

  /**
   * 获取所有启用的分类
   * @param {Object} options 查询选项
   * @returns {Promise<Object>} 分类列表
   */
  async getAllCategories(options = {}) {
    try {
      const categories = await Category.getAll(options)
      return HttpResult.success(categories)
    } catch (error) {
      console.error('获取所有分类失败:', error)
      return HttpResult.error('获取所有分类失败', error.message)
    }
  }

  /**
   * 根据ID获取分类详情
   * @param {number} categoryId 分类ID
   * @returns {Promise<Object>} 分类详情
   */
  async getCategoryById(categoryId) {
    try {
      const category = await Category.findByPk(categoryId)
      if (!category) {
        return HttpResult.error('分类不存在', null, 404)
      }
      return HttpResult.success(category)
    } catch (error) {
      console.error('获取分类详情失败:', error)
      return HttpResult.error('获取分类详情失败', error.message)
    }
  }

  /**
   * 创建分类
   * @param {Object} categoryData 分类数据
   * @returns {Promise<Object>} 创建结果
   */
  async createCategory(categoryData) {
    try {
      // 检查分类名称是否已存在
      const existingCategory = await Category.findOne({
        where: { name: categoryData.name }
      })
      
      if (existingCategory) {
        return HttpResult.error('分类名称已存在', null, 400)
      }

      const category = await Category.createCategory(categoryData)
      return HttpResult.success(category, '分类创建成功')
    } catch (error) {
      console.error('创建分类失败:', error)
      return HttpResult.error('创建分类失败', error.message)
    }
  }

  /**
   * 更新分类
   * @param {number} categoryId 分类ID
   * @param {Object} updateData 更新数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateCategory(categoryId, updateData) {
    try {
      // 检查分类是否存在
      const existingCategory = await Category.findByPk(categoryId)
      if (!existingCategory) {
        return HttpResult.error('分类不存在', null, 404)
      }

      // 如果更新名称，检查是否与其他分类重复
      if (updateData.name && updateData.name !== existingCategory.name) {
        const duplicateCategory = await Category.findOne({
          where: { 
            name: updateData.name,
            category_id: { [Category.sequelize.Op.ne]: categoryId }
          }
        })
        
        if (duplicateCategory) {
          return HttpResult.error('分类名称已存在', null, 400)
        }
      }

      const updatedCategory = await Category.updateCategory(categoryId, updateData)
      return HttpResult.success(updatedCategory, '分类更新成功')
    } catch (error) {
      console.error('更新分类失败:', error)
      return HttpResult.error('更新分类失败', error.message)
    }
  }

  /**
   * 删除分类
   * @param {number} categoryId 分类ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteCategory(categoryId) {
    try {
      const result = await Category.deleteCategory(categoryId)
      return HttpResult.success(result, '分类删除成功')
    } catch (error) {
      console.error('删除分类失败:', error)
      return HttpResult.error('删除分类失败', error.message)
    }
  }

  /**
   * 批量更新分类排序
   * @param {Array} sortData 排序数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateCategorySort(sortData) {
    try {
      const result = await Category.updateSortOrder(sortData)
      return HttpResult.success(result, '分类排序更新成功')
    } catch (error) {
      console.error('更新分类排序失败:', error)
      return HttpResult.error('更新分类排序失败', error.message)
    }
  }

  /**
   * 获取分类统计信息
   * @returns {Promise<Object>} 统计信息
   */
  async getCategoryStats() {
    try {
      const stats = await Category.getStats()
      return HttpResult.success(stats)
    } catch (error) {
      console.error('获取分类统计失败:', error)
      return HttpResult.error('获取分类统计失败', error.message)
    }
  }

  /**
   * 启用/禁用分类
   * @param {number} categoryId 分类ID
   * @param {boolean} enabled 是否启用
   * @returns {Promise<Object>} 操作结果
   */
  async toggleCategoryStatus(categoryId, enabled) {
    try {
      const result = await this.updateCategory(categoryId, { enabled })
      const message = enabled ? '分类已启用' : '分类已禁用'
      return HttpResult.success(result.data, message)
    } catch (error) {
      console.error('切换分类状态失败:', error)
      return HttpResult.error('切换分类状态失败', error.message)
    }
  }

  /**
   * 显示/隐藏分类在导航中
   * @param {number} categoryId 分类ID
   * @param {boolean} showInNav 是否在导航中显示
   * @returns {Promise<Object>} 操作结果
   */
  async toggleCategoryNav(categoryId, showInNav) {
    try {
      const result = await this.updateCategory(categoryId, { show_in_nav: showInNav })
      const message = showInNav ? '分类已在导航中显示' : '分类已在导航中隐藏'
      return HttpResult.success(result.data, message)
    } catch (error) {
      console.error('切换分类导航显示失败:', error)
      return HttpResult.error('切换分类导航显示失败', error.message)
    }
  }
}

export default new CategoryService()
