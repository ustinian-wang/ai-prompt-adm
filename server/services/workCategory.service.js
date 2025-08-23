import WorkCategory from '../models/WorkCategory.model.js'
import Work from '../models/Work.model.js'
import Category from '../models/Category.model.js'
import { HttpResult } from '../utils/HttpResult.js'

/**
 * 作品分类服务类
 * 实现二次查询策略，避免连表查询
 */
class WorkCategoryService {
  
  /**
   * 为作品设置分类
   * @param {number} workId 作品ID
   * @param {Array<number>} categoryIds 分类ID数组
   * @returns {Object} 操作结果
   */
  async setWorkCategories(workId, categoryIds) {
    try {
      // 验证作品是否存在
      const work = await Work.findByPk(workId)
      if (!work) {
        return HttpResult.error({ msg: '作品不存在' })
      }
      
      // 验证分类是否都存在
      if (categoryIds && categoryIds.length > 0) {
        const categories = await Category.findAll({
          where: { category_id: categoryIds }
        })
        
        if (categories.length !== categoryIds.length) {
          return HttpResult.error({ msg: '部分分类不存在' })
        }
      }
      
      // 设置作品分类关联
      await WorkCategory.setWorkCategories(workId, categoryIds)
      
      return HttpResult.success({ msg: '作品分类设置成功' })
    } catch (error) {
      console.error('设置作品分类失败:', error)
      return HttpResult.error({ msg: '设置作品分类失败' })
    }
  }
  
  /**
   * 获取作品的所有分类（包含ID数组）
   * @param {number} workId 作品ID
   * @returns {Object} 分类列表和ID数组
   */
  async getWorkCategories(workId) {
    try {
      // 验证作品是否存在
      const work = await Work.findByPk(workId)
      if (!work) {
        return HttpResult.error({ msg: '作品不存在' })
      }
      
      // 获取作品分类关联ID
      const categoryIds = await WorkCategory.getWorkCategoryIds(workId)
      
      if (categoryIds.length === 0) {
        return HttpResult.success({ 
          data: [],
          category_ids: []
        })
      }
      
      // 二次查询：获取分类详情
      const categories = await Category.findAll({
        where: { category_id: categoryIds },
        order: [['sort_order', 'ASC']]
      })
      
      return HttpResult.success({ 
        data: categories,
        category_ids: categoryIds
      })
    } catch (error) {
      console.error('获取作品分类失败:', error)
      return HttpResult.error({ msg: '获取作品分类失败' })
    }
  }
  
  /**
   * 检查作品是否包含某个分类
   * @param {number} workId 作品ID
   * @param {number} categoryId 分类ID
   * @returns {Object} 检查结果
   */
  async hasWorkCategory(workId, categoryId) {
    try {
      // 验证作品是否存在
      const work = await Work.findByPk(workId)
      if (!work) {
        return HttpResult.error({ msg: '作品不存在' })
      }
      
      // 验证分类是否存在
      const category = await Category.findByPk(categoryId)
      if (!category) {
        return HttpResult.error({ msg: '分类不存在' })
      }
      
      // 检查关联关系
      const hasCategory = await WorkCategory.hasWorkCategory(workId, categoryId)
      
      return HttpResult.success({ 
        data: { hasCategory },
        msg: hasCategory ? '作品包含该分类' : '作品不包含该分类'
      })
    } catch (error) {
      console.error('检查作品分类失败:', error)
      return HttpResult.error({ msg: '检查作品分类失败' })
    }
  }
  
  /**
   * 获取分类下的作品
   * @param {number} categoryId 分类ID
   * @param {Object} options 查询选项
   * @returns {Object} 作品列表
   */
  async getCategoryWorks(categoryId, options = {}) {
    try {
      const { page = 1, limit = 10, work_status = null } = options
      
      // 验证分类是否存在
      const category = await Category.findByPk(categoryId)
      if (!category) {
        return HttpResult.error({ msg: '分类不存在' })
      }
      
      // 获取分类下的作品ID
      const workIds = await WorkCategory.getCategoryWorkIds(categoryId)
      
      if (workIds.length === 0) {
        return HttpResult.success({ 
          data: { works: [], pagination: { page, limit, total: 0, pages: 0 } }
        })
      }
      
      // 二次查询：获取作品详情
      const where = { work_id: workIds }
      if (work_status) {
        where.work_status = work_status
      }
      
      const offset = (page - 1) * limit
      const { count, rows } = await Work.findAndCountAll({
        where,
        order: [['work_created_at', 'DESC']],
        limit,
        offset
      })
      
      return HttpResult.success({
        data: {
          works: rows,
          pagination: {
            page,
            limit,
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      })
    } catch (error) {
      console.error('获取分类作品失败:', error)
      return HttpResult.error({ msg: '获取分类作品失败' })
    }
  }
  
  /**
   * 获取分类统计信息
   * @returns {Object} 分类统计
   */
  async getCategoryStats() {
    try {
      // 获取所有分类
      const categories = await Category.findAll({
        where: { enabled: true },
        order: [['sort_order', 'ASC']]
      })
      
      // 获取分类作品数量统计
      const stats = await WorkCategory.getWorkCategoryStats()
      
      // 合并数据
      const result = categories.map(category => {
        const stat = stats.find(s => s.category_id === category.category_id)
        return {
          ...category.toJSON(),
          works_count: stat ? parseInt(stat.works_count) : 0
        }
      })
      
      return HttpResult.success({ data: result })
    } catch (error) {
      console.error('获取分类统计失败:', error)
      return HttpResult.error({ msg: '获取分类统计失败' })
    }
  }
  
  /**
   * 批量设置作品分类
   * @param {Array<Object>} workCategories 作品分类数组
   * @returns {Object} 操作结果
   */
  async batchSetWorkCategories(workCategories) {
    try {
      const results = []
      
      for (const item of workCategories) {
        const { work_id, category_ids } = item
        const result = await this.setWorkCategories(work_id, category_ids)
        results.push({
          work_id,
          success: result.code === 200,
          message: result.msg
        })
      }
      
      return HttpResult.success({ 
        data: results,
        msg: '批量设置完成'
      })
    } catch (error) {
      console.error('批量设置作品分类失败:', error)
      return HttpResult.error({ msg: '批量设置作品分类失败' })
    }
  }
  
  /**
   * 删除作品的所有分类关联
   * @param {number} workId 作品ID
   * @returns {Object} 操作结果
   */
  async removeWorkCategories(workId) {
    try {
      await WorkCategory.removeWorkCategories(workId)
      return HttpResult.success({ msg: '作品分类关联删除成功' })
    } catch (error) {
      console.error('删除作品分类关联失败:', error)
      return HttpResult.error({ msg: '删除作品分类关联失败' })
    }
  }
  
  /**
   * 删除分类的所有作品关联
   * @param {number} categoryId 分类ID
   * @returns {Object} 操作结果
   */
  async removeCategoryWorks(categoryId) {
    try {
      await WorkCategory.removeCategoryWorks(categoryId)
      return HttpResult.success({ msg: '分类作品关联删除成功' })
    } catch (error) {
      console.error('删除分类作品关联失败:', error)
      return HttpResult.error({ msg: '删除分类作品关联失败' })
    }
  }

  /**
   * 清理已删除分类的关联记录
   * @returns {Object} 清理结果
   */
  async cleanupDeletedCategories() {
    try {
      const count = await WorkCategory.cleanupDeletedCategories()
      return HttpResult.success({ 
        msg: `清理完成，共清理 ${count} 个关联记录`,
        cleaned_count: count
      })
    } catch (error) {
      console.error('清理已删除分类关联失败:', error)
      return HttpResult.error({ msg: '清理已删除分类关联失败' })
    }
  }
}

export default new WorkCategoryService()
