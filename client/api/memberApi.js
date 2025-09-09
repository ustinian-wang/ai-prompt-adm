import request from "../../src/utils/request"

// 会员注册
export const registerMember = (data) => {
  return request.post(`/api/member/register`, data)
}

// 会员登录
export const loginMember = (data) => {
  return request.post(`/api/member/login`, data)
}

// 获取会员信息
export const getMemberInfo = (mem_id) => {
  return request.get(`/api/member/info?mem_id=${mem_id}`)
}

// 更新会员信息
export const updateMember = (data) => {
  return request.post(`/api/member/update`, data)
}
