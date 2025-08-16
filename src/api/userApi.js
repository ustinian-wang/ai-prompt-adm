import request from '@/utils/request'

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
  getUserInfoApi,
  updateUserInfoApi,
  changePasswordApi
}
