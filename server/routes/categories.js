import express from 'express'
import { authMiddleware } from '../middleware/index.js'
import categoryService from '../services/category.service.js'
import workCategoryService from '../services/workCategory.service.js'

const router = express.Router()

// 获取分类列表
router.get('/', authMiddleware(), async (req, res) => {
  try {
    const { page, limit, search, enabled, orderBy, orderDirection } = req.query
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search: search || null,
      enabled: enabled !== undefined ? enabled === 'true' : null,
      orderBy: orderBy || 'sort_order',
      orderDirection: orderDirection || 'ASC'
    }
    
    const result = await categoryService.getCategoryList(options)
    res.status(result.code).json(result)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取分类列表失败',
      error: error.message
    })
  }
})

// 获取所有启用的分类
router.get('/all', authMiddleware(), async (req, res) => {
  try {
    const { showInNav } = req.query
    const options = {
      enabled: true,
      showInNav: showInNav !== undefined ? showInNav === 'true' : null
    }
    
    const result = await categoryService.getAllCategories(options)
    res.status(result.code).json(result)
  } catch (error) {
    console.error('获取所有分类失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取所有分类失败',
      error: error.message
    })
  }
})

// 根据ID获取分类详情
router.get('/:id', authMiddleware(), async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    const result = await categoryService.getCategoryById(categoryId)
    res.status(result.code).json(result)
  } catch (error) {
    console.error('获取分类详情失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取分类详情失败',
      error: error.message
    })
  }
})

// 创建分类
router.post('/', authMiddleware(), async (req, res) => {
  try {
    const categoryData = req.body
    const result = await categoryService.createCategory(categoryData)
    res.status(result.code).json(result)
  } catch (error) {
    console.error('创建分类失败:', error)
    res.status(500).json({
      code: 500,
      message: '创建分类失败',
      error: error.message
    })
  }
})

// 更新分类
router.put('/:id', authMiddleware(), async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    const updateData = req.body
    const result = await categoryService.updateCategory(categoryId, updateData)
    res.status(result.code).json(result)
  } catch (error) {
    console.error('更新分类失败:', error)
    res.status(500).json({
      code: 500,
      message: '更新分类失败',
      error: error.message
    })
  }
})

// 删除分类
router.delete('/:id', authMiddleware(), async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    const result = await categoryService.deleteCategory(categoryId)
    res.status(result.code).json(result)
  } catch (error) {
    console.error('删除分类失败:', error)
    res.status(500).json({
      code: 500,
      message: '删除分类失败',
      error: error.message
    })
  }
})

// 批量更新分类排序
router.put('/sort/batch', authMiddleware(), async (req, res) => {
  try {
    const { sortData } = req.body
    const result = await categoryService.updateCategorySort(sortData)
    res.status(result.code).json(result)
  } catch (error) {
    console.error('批量更新分类排序失败:', error)
    res.status(500).json({
      code: 500,
      message: '批量更新分类排序失败',
      error: error.message
    })
  }
})

// 获取分类统计信息
router.get('/stats/overview', authMiddleware(), async (req, res) => {
  try {
    const result = await categoryService.getCategoryStats()
    res.status(result.code).json(result)
  } catch (error) {
    console.error('获取分类统计失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取分类统计失败',
      error: error.message
    })
  }
})

// 切换分类状态
router.patch('/:id/status', authMiddleware(), async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    const { enabled } = req.body
    const result = await categoryService.toggleCategoryStatus(categoryId, enabled)
    res.status(result.code).json(result)
  } catch (error) {
    console.error('切换分类状态失败:', error)
    res.status(500).json({
      code: 500,
      message: '切换分类状态失败',
      error: error.message
    })
  }
})

// 切换分类导航显示
router.patch('/:id/nav', authMiddleware(), async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    const { showInNav } = req.body
    const result = await categoryService.toggleCategoryNav(categoryId, showInNav)
    res.status(result.code).json(result)
  } catch (error) {
    console.error('切换分类导航显示失败:', error)
    res.status(500).json({
      code: 500,
      message: '切换分类导航显示失败',
      error: error.message
    })
  }
})

// ==================== 分类作品管理接口 ====================

/**
 * 获取分类下的作品
 */
async function getCategoryWorksHandler(req, res) {
  try {
    const { category_id, page, limit, work_status } = req.query
    const categoryId = parseInt(category_id) || 0
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      work_status: work_status || null
    }
    
    if (!categoryId) {
      res.status(200).json({
        code: 400,
        message: '分类ID不能为空'
      })
      return
    }
    
    const result = await workCategoryService.getCategoryWorks(categoryId, options)
    res.status(200).json(result)
  } catch (error) {
    console.error('获取分类作品失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取分类作品失败',
      error: error.message
    })
  }
}
router.get('/getCategoryWorks', authMiddleware(), getCategoryWorksHandler)
router.post('/getCategoryWorks', authMiddleware(), getCategoryWorksHandler)

/**
 * 获取分类统计信息（包含作品数量）
 */
async function getCategoryStatsHandler(req, res) {
  try {
    const result = await workCategoryService.getCategoryStats()
    res.status(200).json(result)
  } catch (error) {
    console.error('获取分类统计失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取分类统计失败',
      error: error.message
    })
  }
}
router.get('/getCategoryStats', authMiddleware(), getCategoryStatsHandler)
router.post('/getCategoryStats', authMiddleware(), getCategoryStatsHandler)

/**
 * 清理已删除分类的关联记录
 */
async function cleanupDeletedCategoriesHandler(req, res) {
  try {
    const result = await workCategoryService.cleanupDeletedCategories()
    res.status(200).json(result)
  } catch (error) {
    console.error('清理已删除分类关联失败:', error)
    res.status(500).json({
      code: 500,
      message: '清理已删除分类关联失败',
      error: error.message
    })
  }
}
router.get('/cleanupDeletedCategories', authMiddleware(), cleanupDeletedCategoriesHandler)
router.post('/cleanupDeletedCategories', authMiddleware(), cleanupDeletedCategoriesHandler)

export default router

