import request from '@/utils/request'

  // 获取用户列表
export function getUserListApi(params) {
    return request({
      url: '/api/user/list',
      method: 'get',
      params
    })
}

  // 根据ID获取用户详情
  export function getUserDetailApi(id) {
    return request({
      url: `/api/user/${id}`,
      method: 'get'
    })
}


  // 根据ID获取用户详情
export function upsertUserApi(id, data) {
    return request({
      url: `/api/user/upsertUser?id=${id}`,
      method: 'post',
      data
    })
}

  // 创建用户
export function createUserApi(data) {
    return request({
      url: '/api/user',
      method: 'post',
      data
    })
}

  // 更新用户
export function updateUserApi(id, data) {
    return request({
      url: `/api/user/${id}`,
      method: 'put',
      data
    })
}

  // 删除用户
export function deleteUserApi(id) {
    return request({
      url: `/api/user/${id}`,
      method: 'delete'
    })
}

  // 切换用户状态（冻结/解冻）
export function toggleUserStatusApi(id, status) {
    return request({
      url: `/api/user/${id}/status`,
      method: 'patch',
      data: { status }
    })
}

  // 批量删除用户
export function batchDeleteUsersApi(userIds) {
    return request({
      url: '/api/user/batch',
      method: 'delete',
      data: { userIds }
    })
}

  // 导出用户数据
export function exportUsersApi(params) {
    return request({
      url: '/api/user/export',
      method: 'get',
      params
    })
  }
// ==================== 用户信息相关API ====================

// 获取用户信息
export function getUserInfoApi() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfoApi(data) {
  return request({
    url: '/api/user/info',
    method: 'put',
    data
  })
}

// 修改密码
export function changePasswordApi(data) {
  return request({
    url: '/api/user/password',
    method: 'put',
    data
  })
}

export default {
  // 用户信息
  getUserInfoApi,
  updateUserInfoApi,
  changePasswordApi
}
