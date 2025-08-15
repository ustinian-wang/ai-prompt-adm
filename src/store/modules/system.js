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
  }
}

const actions = {
  async getRolesList({ commit }) {
    commit('SET_LOADING', true)
    try {
      // 模拟数据
      const mockData = [
        {
          id: 1,
          name: 'admin',
          description: '系统管理员',
          permissions: ['*'],
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          name: 'user',
          description: '普通用户',
          permissions: ['works:read', 'works:write', 'categories:read'],
          createdAt: '2024-01-01'
        }
      ]
      commit('SET_ROLES_LIST', mockData)
    } catch (error) {
      console.error('获取角色列表失败:', error)
    } finally {
      commit('SET_LOADING', false)
    }
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
