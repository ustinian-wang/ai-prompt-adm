const state = {
  categoriesList: [],
  loading: false
}

const mutations = {
  SET_CATEGORIES_LIST(state, list) {
    state.categoriesList = list
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

const actions = {
  async getCategoriesList({ commit }) {
    commit('SET_LOADING', true)
    try {
      // 模拟数据
      const mockData = [
        { id: 1, name: 'AI写作', description: 'AI写作相关提示词', parentId: 0, sortOrder: 1 },
        { id: 2, name: 'AI绘画', description: 'AI绘画相关提示词', parentId: 0, sortOrder: 2 },
        { id: 3, name: 'AI编程', description: 'AI编程相关提示词', parentId: 0, sortOrder: 3 },
        { id: 4, name: 'AI对话', description: 'AI对话相关提示词', parentId: 0, sortOrder: 4 }
      ]
      commit('SET_CATEGORIES_LIST', mockData)
    } catch (error) {
      console.error('获取分类列表失败:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  categoriesList: state => state.categoriesList,
  loading: state => state.loading
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
