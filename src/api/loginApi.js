import request from '@/utils/request'

// 用户登录
export function loginApi(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 用户注册
export function registerApi(data) {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data
  })
}

// 用户登出
export function logoutApi() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfoApi() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfoApi(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

// 修改密码
export function changePasswordApi(data) {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}

// 获取用户列表
export function getUserListApi(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

// 创建用户
export function createUserApi(data) {
  return request({
    url: '/users',
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

// 获取角色列表
export function getRoleListApi(params) {
  return request({
    url: '/roles',
    method: 'get',
    params
  })
}

// 创建角色
export function createRoleApi(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

// 更新角色
export function updateRoleApi(id, data) {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRoleApi(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}
