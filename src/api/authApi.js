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

export default {
  loginApi,
  registerApi,
  logoutApi
}
