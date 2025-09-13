import request from "../../src/utils/request"

// 采集作品到分组
export const collectWorkToGroup = (data) => {
  return request.post(`/api/member/work_group/collect`, data)
}

// 从分组中移除作品
export const removeWorkFromGroup = (data) => {
  return request.post(`/api/member/work_group/remove`, data)
}

// 获取分组下的作品列表
export const getGroupWorks = (groupId, params) => {
  return request.get(`/api/member/work_group/group/${groupId}/works`, { params })
}

// 获取作品所在的分组列表
export const getWorkGroups = (workId) => {
  return request.get(`/api/member/work_group/work/${workId}/groups`)
}

// 检查作品是否在指定分组中
export const checkWorkInGroup = (workId, groupId) => {
  return request.get(`/api/member/work_group/check/${workId}/${groupId}`)
}

// 获取会员采集的所有作品
export const getMemberCollectedWorks = (params) => {
  return request.get(`/api/member/work_group/member/works`, { params })
}

// 批量采集作品到分组
export const batchCollectWorks = (data) => {
  return request.post(`/api/member/work_group/batch-collect`, data)
}

// 批量从分组中移除作品
export const batchRemoveWorks = (data) => {
  return request.post(`/api/member/work_group/batch-remove`, data)
}
