const state = {
  worksList: [],
  currentWork: null,
  loading: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  }
}

const mutations = {
  SET_WORKS_LIST(state, list) {
    state.worksList = list
  },
  SET_CURRENT_WORK(state, work) {
    state.currentWork = work
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  }
}

const actions = {
  async getWorksList({ commit }, params) {
    commit('SET_LOADING', true)
    try {
      // 这里调用API获取作品列表
      // const { data } = await getWorksList(params)
      // commit('SET_WORKS_LIST', data.list)
      // commit('SET_PAGINATION', data.pagination)
      
      // 模拟数据
      const mockData = [
        {
          id: 1,
          title: 'AI写作助手',
          description: '帮助用户快速生成高质量文章',
          category: 'AI写作',
          status: 'published',
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          title: 'AI绘画提示词',
          description: '专业的AI绘画提示词集合',
          category: 'AI绘画',
          status: 'published',
          createdAt: '2024-01-02'
        }
      ]
      commit('SET_WORKS_LIST', mockData)
      commit('SET_PAGINATION', { total: mockData.length })
    } catch (error) {
      console.error('获取作品列表失败:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  worksList: state => state.worksList,
  currentWork: state => state.currentWork,
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
