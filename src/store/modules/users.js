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
  }
}

const actions = {
  async getUsersList({ commit }, params) {
    commit('SET_LOADING', true)
    try {
      // 模拟数据
      const mockData = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: '系统管理员',
          status: 'active',
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          username: 'user1',
          email: 'user1@example.com',
          role: '普通用户',
          status: 'active',
          createdAt: '2024-01-02'
        }
      ]
      commit('SET_USERS_LIST', mockData)
      commit('SET_PAGINATION', { total: mockData.length })
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      commit('SET_LOADING', false)
    }
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
