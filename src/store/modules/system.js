const state = {
  rolesList: [],
  loading: false
}

const mutations = {
  SET_ROLES_LIST(state, list) {
    state.rolesList = list
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  ADD_ROLE(state, role) {
    state.rolesList.unshift(role)
  },
  UPDATE_ROLE(state, updatedRole) {
    const index = state.rolesList.findIndex(r => r.id === updatedRole.id)
    if (index !== -1) {
      state.rolesList.splice(index, 1, updatedRole)
    }
  },
  DELETE_ROLE(state, roleId) {
    const index = state.rolesList.findIndex(r => r.id === roleId)
    if (index !== -1) {
      state.rolesList.splice(index, 1)
    }
  }
}

const actions = {
  // 获取角色列表
  async getRolesList({ commit }) {
    commit('SET_LOADING', true)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const mockData = [
      {
        id: 1,
        name: '超级管理员',
        description: '拥有系统所有权限，可以管理所有功能模块',
        permissions: ['*'],
        createdAt: '2024-01-01 00:00:00',
        userCount: 1
      },
      {
        id: 2,
        name: '内容管理员',
        description: '负责管理作品、分类等内容的审核和管理',
        permissions: ['works:read', 'works:write', 'works:delete', 'categories:read', 'categories:write'],
        createdAt: '2024-01-01 00:00:00',
        userCount: 3
      },
      {
        id: 3,
        name: '用户管理员',
        description: '负责用户账号的管理和权限分配',
        permissions: ['users:read', 'users:write', 'users:delete', 'roles:read'],
        createdAt: '2024-01-01 00:00:00',
        userCount: 2
      },
      {
        id: 4,
        name: '普通用户',
        description: '可以查看和创建作品，使用AI提示词功能',
        permissions: ['works:read', 'works:write', 'categories:read'],
        createdAt: '2024-01-01 00:00:00',
        userCount: 25
      },
      {
        id: 5,
        name: '访客',
        description: '只能查看公开的作品和分类',
        permissions: ['works:read', 'categories:read'],
        createdAt: '2024-01-01 00:00:00',
        userCount: 0
      }
    ]
    
    commit('SET_ROLES_LIST', mockData)
    commit('SET_LOADING', false)
  },
  
  // 创建角色
  async createRole({ commit }, roleData) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const newRole = {
      id: Date.now(),
      ...roleData,
      createdAt: new Date().toLocaleString(),
      userCount: 0
    }
    
    commit('ADD_ROLE', newRole)
    commit('SET_LOADING', false)
    return newRole
  },
  
  // 更新角色
  async updateRole({ commit }, roleData) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    commit('UPDATE_ROLE', roleData)
    commit('SET_LOADING', false)
    return roleData
  },
  
  // 删除角色
  async deleteRole({ commit }, roleId) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    commit('DELETE_ROLE', roleId)
    commit('SET_LOADING', false)
  }
}

const getters = {
  rolesList: state => state.rolesList,
  loading: state => state.loading
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
