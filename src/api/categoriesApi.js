// 分类相关API
import request from '@/utils/request'

// 获取分类列表（带分页）
export function getCategoriesList(params) {
  return request({
    url: '/api/categories',
    method: 'get',
    params
  })
}

// 获取所有启用的分类
export function getAllCategories(params) {
  return request({
    url: '/api/categories/all',
    method: 'get',
    params
  })
}

// 根据ID获取分类详情
export function getCategoryById(id) {
  return request({
    url: `/api/categories/${id}`,
    method: 'get'
  })
}

// 创建分类
export function createCategory(data) {
  return request({
    url: '/api/categories',
    method: 'post',
    data
  })
}

// 更新分类
export function updateCategory(id, data) {
  return request({
    url: `/api/categories/${id}`,
    method: 'put',
    data
  })
}

// 删除分类
export function deleteCategory(id) {
  return request({
    url: `/api/categories/${id}`,
    method: 'delete'
  })
}

// 批量更新分类排序
export function updateCategorySort(sortData) {
  return request({
    url: '/api/categories/sort/batch',
    method: 'put',
    data: { sortData }
  })
}

// 获取分类统计信息
export function getCategoryStats() {
  return request({
    url: '/api/categories/stats/overview',
    method: 'get'
  })
}

// 切换分类状态
export function toggleCategoryStatus(id, enabled) {
  return request({
    url: `/api/categories/${id}/status`,
    method: 'patch',
    data: { enabled }
  })
}

// 切换分类导航显示
export function toggleCategoryNav(id, showInNav) {
  return request({
    url: `/api/categories/${id}/nav`,
    method: 'patch',
    data: { showInNav }
  })
}
