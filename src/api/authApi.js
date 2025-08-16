import request from '@/utils/request'

// 用户登录
export function loginApi(data) {
  return request({
    url: '/api/auth/login',
    method: 'get',
    data,
    params: data
  })
}

// 用户注册
export function registerApi(data) {
  return request({
    url: '/api/auth/register',
    method: 'get',
    data,
    params: data
  })
}

// 用户登出
export function logoutApi() {
  return request({
    url: '/api/auth/logout',
    method: 'get'
  })
}

export default {
  loginApi,
  registerApi,
  logoutApi
}
