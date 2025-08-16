import request from '@/utils/request'

// ==================== 用户管理相关API ====================

// 获取用户列表
export function getUserListApi(params) {
  return request({
    url: '/api/user/getUserList',
    method: 'get',
    params
  })
}

// 获取用户详情
export function getUserDetailApi(id) {
  return request({
    url: '/api/user/getUserDetail',
    method: 'get',
    params: { id }
  })
}

// 创建用户
export function createUserApi(data) {
  return request({
    url: '/api/user/createUser',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUserApi(data) {
  return request({
    url: '/api/user/updateUser',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUserApi(id) {
  return request({
    url: '/api/user/deleteUser',
    method: 'post',
    params: { id }
  })
}

// 批量删除用户
export function batchDeleteUsersApi(ids) {
  return request({
    url: '/api/user/batchDeleteUsers',
    method: 'post',
    data: { ids }
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
  // 用户管理
  getUserListApi,
  getUserDetailApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  batchDeleteUsersApi,
  // 用户信息
  getUserInfoApi,
  updateUserInfoApi,
  changePasswordApi
}
