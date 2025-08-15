import request from '@/utils/request'

/**
 * 作品相关API接口
 */

/**
 * 获取作品列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @returns {Promise<>}
 */
export function getWorkListApi(params = {}) {
  return request({
    url: '/api/works/getWorkList',
    method: 'get',
    params
  })
}

/**
 * 获取作品详情
 * @param {number} workId - 作品ID
 * @returns {Promise}
 */
export function getWorkDetailApi(workId) {
  return request({
    url: `/api/works/getWorkDetail?id=${workId}`,
    method: 'get'
  })
}

/**
 * 创建作品
 * @param {Object} data - 作品数据
 * @returns {Promise}
 */
export function createWorkApi(data) {
  return request({
    url: '/api/works/createWork',
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
  // 参数验证
  if (!workId || isNaN(workId) || Number(workId) <= 0) {
    return Promise.reject({
      code: 400,
      message: '作品不存在',
      data: null
    })
  }

  return request({
    url: `/api/works/updateWork?id=${workId}`,
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
    url: `/api/works/deleteWork?id=${workId}`,
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
    url: '/api/works/batchDeleteWorks',
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
    url: `/api/works/updateWorkStatus?id=${workId}&status=${status}`,
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
    url: '/api/works/searchWorks',
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
    url: '/api/works/exportWorks',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
/**
 * @description 创建或更新作品
 * @param {object} data 
 * @returns 
 */
export function upsertWorkApi(data) {
  return request({
    url: `/api/works/upsertWork`,
    method: 'post',
    data: data
  })
}

export default {
  getWorkListApi,
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
