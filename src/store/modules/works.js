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
  },
  ADD_WORK(state, work) {
    state.worksList.unshift(work)
    state.pagination.total += 1
  },
  UPDATE_WORK(state, updatedWork) {
    const index = state.worksList.findIndex(w => w.id === updatedWork.id)
    if (index !== -1) {
      state.worksList.splice(index, 1, updatedWork)
    }
  },
  DELETE_WORK(state, workId) {
    const index = state.worksList.findIndex(w => w.id === workId)
    if (index !== -1) {
      state.worksList.splice(index, 1)
      state.pagination.total -= 1
    }
  }
}

const actions = {
  // 获取作品列表
  async getWorksList({ commit }, params = {}) {
    commit('SET_LOADING', true)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockData = [
      {
        id: 1,
        workName: '3D图标设计',
        workType: 'UI设计',
        description: '现代化的3D图标设计，适用于各种应用场景',
        status: '展示',
        createdAt: '2021-10-14 17:48:13',
        tags: ['UI', '3D', 'icon'],
        image: ''
      },
      {
        id: 2,
        workName: '3D图标设计',
        workType: 'UI设计',
        description: '现代化的3D图标设计，适用于各种应用场景',
        status: '隐藏',
        createdAt: '2021-10-14 17:48:13',
        tags: ['UI', '3D', 'icon'],
        image: ''
      },
      {
        id: 3,
        workName: '3D图标设计',
        workType: 'UI设计',
        description: '现代化的3D图标设计，适用于各种应用场景',
        status: '展示',
        createdAt: '2021-10-14 17:48:13',
        tags: ['UI', '3D', 'icon'],
        image: ''
      },
      {
        id: 4,
        workName: '智能绘画生成器',
        description: '基于AI技术的绘画生成工具，支持多种艺术风格',
        workType: '3D设计',
        status: '展示',
        createdAt: '2021-10-13 15:20:00',
        tags: ['绘画', 'AI', '艺术'],
        image: ''
      },
      {
        id: 5,
        workName: '代码自动生成器',
        description: '智能代码生成工具，支持多种编程语言和框架',
        workType: '图标设计',
        status: '隐藏',
        createdAt: '2021-10-12 09:15:00',
        tags: ['编程', 'AI', '代码生成'],
        image: ''
      }
    ]
    
    // 如果有搜索参数，进行过滤
    let filteredData = mockData
    if (params.workName) {
      filteredData = filteredData.filter(work => 
        work.workName.toLowerCase().includes(params.workName.toLowerCase())
      )
    }
    if (params.workType) {
      filteredData = filteredData.filter(work => 
        work.workType === params.workType
      )
    }
    
    commit('SET_WORKS_LIST', filteredData)
    commit('SET_PAGINATION', {
      current: 1,
      pageSize: 10,
      total: filteredData.length
    })
    commit('SET_LOADING', false)
  },

  // 创建作品
  async createWork({ commit }, workData) {
    commit('SET_LOADING', true)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newWork = {
      id: Date.now(),
      ...workData,
      createdAt: new Date().toLocaleString('zh-CN'),
      status: '展示'
    }
    
    commit('ADD_WORK', newWork)
    commit('SET_LOADING', false)
    return newWork
  },

  // 更新作品
  async updateWork({ commit }, workData) {
    commit('SET_LOADING', true)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    commit('UPDATE_WORK', workData)
    commit('SET_LOADING', false)
    return workData
  },

  // 删除作品
  async deleteWork({ commit }, workId) {
    commit('SET_LOADING', true)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    commit('DELETE_WORK', workId)
    commit('SET_LOADING', false)
    return true
  },

  // 获取作品详情
  async getWorkDetail({ commit }, workId) {
    commit('SET_LOADING', true)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const work = state.worksList.find(w => w.id === workId)
    commit('SET_CURRENT_WORK', work)
    commit('SET_LOADING', false)
    return work
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
