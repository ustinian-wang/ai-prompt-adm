import request from '@/utils/request'

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

export default {
  getRoleListApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi
}
