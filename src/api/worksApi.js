import request from '@/utils/request'

/**
 * 作品相关API接口
 */

/**
 * 获取作品列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getWorkListApi(params = {}) {
  return request({
    url: '/api/works/getWorkList',
    method: 'get',
    params
  })
}

// 面向客户端（无需登录）的公开作品列表
export function getWorksPublicListApi(params = {}) {
  return request({
    url: '/api/member/works/getWorksPublicList',
    method: 'get',
    params
  })
}

/**
 * 获取作品详情
 * @param {number|string} workId - 作品ID
 * @returns {Promise}
 */
export function getWorkDetailApi(workId) {
  return request({
    url: `/api/works/getWorkDetail`,
    method: 'get',
    params: {
      id: workId  
    }
  })
}

/**
 * 创建作品
 * @param {Object} data - 作品数据
 * @returns {Promise}
 */
export function createWorkApi(data) {
  return request({
    url: '/api/works',
    method: 'post',
    data
  })
}

/**
 * 更新作品
 * @param {number|string} workId - 作品ID
 * @param {Object} data - 更新数据
 * @returns {Promise}
 */
export function updateWorkApi(workId, data) {

  return request({
    url: `/api/works/${workId}`,
    method: 'put',
    data
  })
}

/**
 * 删除作品
 * @param {number|string} workId - 作品ID
 * @returns {Promise}
 */
export function deleteWorkApi(workId) {
  // 参数验证
  if (!workId || isNaN(workId) || Number(workId) <= 0) {
    return Promise.reject({
      code: 400,
      message: '作品不存在',
      data: null
    })
  }

  return request({
    url: `/api/works/${workId}`,
    method: 'delete'
  })
}

/**
 * 批量删除作品
 * @param {Array} workIds - 作品ID数组
 * @returns {Promise}
 */
export function batchDeleteWorksApi(workIds) {
  // 参数验证
  if (!Array.isArray(workIds) || workIds.length === 0) {
    return Promise.reject({
      code: 400,
      message: '请选择要删除的作品',
      data: null
    })
  }

  // 验证每个ID是否有效
  const invalidIds = workIds.filter(id => !id || isNaN(id) || Number(id) <= 0)
  if (invalidIds.length > 0) {
    return Promise.reject({
      code: 400,
      message: '存在无效的作品ID',
      data: null
    })
  }

  return request({
    url: '/api/works/batch',
    method: 'delete',
    data: { workIds }
  })
}

/**
 * 更新作品状态
 * @param {number|string} workId - 作品ID
 * @param {string} status - 新状态
 * @returns {Promise}
 */
export function updateWorkStatusApi(workId, status) {
  // 参数验证
  if (!workId || isNaN(workId) || Number(workId) <= 0) {
    return Promise.reject({
      code: 400,
      message: '作品不存在',
      data: null
    })
  }

  if (!status || typeof status !== 'string') {
    return Promise.reject({
      code: 400,
      message: '状态参数无效',
      data: null
    })
  }

  return request({
    url: `/api/works/${workId}/status`,
    method: 'patch',
    data: { status }
  })
}

/**
 * 搜索作品
 * @param {Object} params - 搜索参数
 * @returns {Promise}
 */
export function searchWorksApi(params = {}) {
  return request({
    url: '/api/works/search',
    method: 'get',
    params
  })
}

/**
 * 导出作品
 * @param {Object} params - 导出参数
 * @returns {Promise}
 */
export function exportWorksApi(params = {}) {
  return request({
    url: '/api/works/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function upsertWorkApi(data) {
  return request({
    url: '/api/works/upsertWork',
    method: 'post',
    data
  })
}

export default {
  getWorkListApi,
  getWorksPublicListApi,
  getWorkDetailApi,
  createWorkApi,
  updateWorkApi,
  deleteWorkApi,
  batchDeleteWorksApi,
  updateWorkStatusApi,
  searchWorksApi,
  exportWorksApi,
  upsertWorkApi
}
