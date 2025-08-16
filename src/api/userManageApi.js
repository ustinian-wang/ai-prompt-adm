import request from '@/utils/request'

// 获取用户列表
export function getUserListApi(params) {
  return request({
    url: '/api/users',
    method: 'get',
    params
  })
}

// 创建用户
export function createUserApi(data) {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUserApi(id, data) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUserApi(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

export default {
  getUserListApi,
  createUserApi,
  updateUserApi,
  deleteUserApi
}
