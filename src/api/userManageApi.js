import request from '@/utils/request'

// 获取用户列表
export function getUserListApi(params) {
  return request({
    url: '/api/users/getUserList',
    method: 'get',
    params
  })
}

// 获取用户详情
export function getUserDetailApi(id) {
  return request({
    url: '/api/users/getUserDetail',
    method: 'get',
    params: { id }
  })
}

// 创建用户
export function createUserApi(data) {
  return request({
    url: '/api/users/createUser',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUserApi(data) {
  return request({
    url: '/api/users/updateUser',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUserApi(id) {
  return request({
    url: '/api/users/deleteUser',
    method: 'post',
    params: { id }
  })
}

// 批量删除用户
export function batchDeleteUsersApi(ids) {
  return request({
    url: '/api/users/batchDeleteUsers',
    method: 'post',
    data: { ids }
  })
}

export default {
  getUserListApi,
  getUserDetailApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  batchDeleteUsersApi
}
