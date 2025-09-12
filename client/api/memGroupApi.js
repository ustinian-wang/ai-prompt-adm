import request from "../../src/utils/request"

// 分组列表
export const listMemGroups = (params) => {
  return request.get(`/api/member/mem_group/list`, { params })
}

// 分组详情
export const getMemGroupDetail = (params) => {
  return request.get(`/api/member/mem_group/detail`, { params })
}

// 创建分组
export const createMemGroup = (data) => {
  return request.post(`/api/member/mem_group/create`, data)
}

// 更新分组
export const updateMemGroup = (data) => {
  return request.post(`/api/member/mem_group/update`, data)
}

// 删除分组
export const deleteMemGroup = (data) => {
  return request.post(`/api/member/mem_group/delete`, data)
}


