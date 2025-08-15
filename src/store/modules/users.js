const state = {
  usersList: [],
  loading: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  }
}

const mutations = {
  SET_USERS_LIST(state, list) {
    state.usersList = list
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  },
  ADD_USER(state, user) {
    state.usersList.unshift(user)
    state.pagination.total += 1
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.usersList.findIndex(u => u.id === updatedUser.id)
    if (index !== -1) {
      state.usersList.splice(index, 1, updatedUser)
    }
  },
  DELETE_USER(state, userId) {
    const index = state.usersList.findIndex(u => u.id === userId)
    if (index !== -1) {
      state.usersList.splice(index, 1)
      state.pagination.total -= 1
    }
  }
}

const actions = {
  // 获取用户列表
  async getUsersList({ commit }, params = {}) {
    commit('SET_LOADING', true)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockData = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: '超级管理员',
        status: 'active',
        createdAt: '2024-01-01 00:00:00',
        lastLogin: '2024-01-15 10:30:00',
        avatar: 'https://via.placeholder.com/40x40'
      },
      {
        id: 2,
        username: 'zhangsan',
        email: 'zhangsan@example.com',
        role: '内容管理员',
        status: 'active',
        createdAt: '2024-01-02 00:00:00',
        lastLogin: '2024-01-14 15:20:00',
        avatar: 'https://via.placeholder.com/40x40'
      },
      {
        id: 3,
        username: 'lisi',
        email: 'lisi@example.com',
        role: '普通用户',
        status: 'active',
        createdAt: '2024-01-03 00:00:00',
        lastLogin: '2024-01-13 09:15:00',
        avatar: 'https://via.placeholder.com/40x40'
      },
      {
        id: 4,
        username: 'wangwu',
        email: 'wangwu@example.com',
        role: '普通用户',
        status: 'inactive',
        createdAt: '2024-01-04 00:00:00',
        lastLogin: '2024-01-10 14:45:00',
        avatar: 'https://via.placeholder.com/40x40'
      },
      {
        id: 5,
        username: 'zhaoliu',
        email: 'zhaoliu@example.com',
        role: '内容管理员',
        status: 'active',
        createdAt: '2024-01-05 00:00:00',
        lastLogin: '2024-01-12 11:30:00',
        avatar: 'https://via.placeholder.com/40x40'
      }
    ]
    
    commit('SET_USERS_LIST', mockData)
    commit('SET_PAGINATION', { total: mockData.length })
    commit('SET_LOADING', false)
  },
  
  // 创建用户
  async createUser({ commit }, userData) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newUser = {
      id: Date.now(),
      ...userData,
      status: 'active',
      createdAt: new Date().toLocaleString(),
      lastLogin: '-',
      avatar: 'https://via.placeholder.com/40x40'
    }
    
    commit('ADD_USER', newUser)
    commit('SET_LOADING', false)
    return newUser
  },
  
  // 更新用户
  async updateUser({ commit }, userData) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 600))
    
    commit('UPDATE_USER', userData)
    commit('SET_LOADING', false)
    return userData
  },
  
  // 删除用户
  async deleteUser({ commit }, userId) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    commit('DELETE_USER', userId)
    commit('SET_LOADING', false)
  }
}

const getters = {
  usersList: state => state.usersList,
  loading: state => state.loading,
  pagination: state => state.pagination
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
