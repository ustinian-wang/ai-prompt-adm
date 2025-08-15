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
        title: 'AI写作助手',
        description: '一个智能的AI写作辅助工具，可以帮助用户生成高质量的文章内容',
        category: 'AI写作',
        status: 'published',
        createdAt: '2024-01-15 10:30:00',
        author: '张三',
        tags: ['写作', 'AI', '内容生成']
      },
      {
        id: 2,
        title: '智能绘画生成器',
        description: '基于AI技术的绘画生成工具，支持多种艺术风格',
        category: 'AI绘画',
        status: 'published',
        createdAt: '2024-01-14 15:20:00',
        author: '李四',
        tags: ['绘画', 'AI', '艺术']
      },
      {
        id: 3,
        title: '代码自动生成器',
        description: '智能代码生成工具，支持多种编程语言和框架',
        category: 'AI编程',
        status: 'draft',
        createdAt: '2024-01-13 09:15:00',
        author: '王五',
        tags: ['编程', 'AI', '代码生成']
      },
      {
        id: 4,
        title: '智能客服机器人',
        description: '基于自然语言处理的智能客服系统',
        category: 'AI应用',
        status: 'published',
        createdAt: '2024-01-12 14:45:00',
        author: '赵六',
        tags: ['客服', 'AI', '自然语言处理']
      },
      {
        id: 5,
        title: '数据分析助手',
        description: '智能数据分析工具，支持多种数据格式和可视化',
        category: 'AI分析',
        status: 'archived',
        createdAt: '2024-01-11 11:30:00',
        author: '钱七',
        tags: ['数据分析', 'AI', '可视化']
      }
    ]
    
    commit('SET_WORKS_LIST', mockData)
    commit('SET_PAGINATION', { total: mockData.length })
    commit('SET_LOADING', false)
  },
  
  // 创建作品
  async createWork({ commit }, workData) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newWork = {
      id: Date.now(),
      ...workData,
      status: 'draft',
      createdAt: new Date().toLocaleString(),
      author: '当前用户'
    }
    
    commit('ADD_WORK', newWork)
    commit('SET_LOADING', false)
    return newWork
  },
  
  // 更新作品
  async updateWork({ commit }, workData) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 600))
    
    commit('UPDATE_WORK', workData)
    commit('SET_LOADING', false)
    return workData
  },
  
  // 删除作品
  async deleteWork({ commit }, workId) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    commit('DELETE_WORK', workId)
    commit('SET_LOADING', false)
  },
  
  // 获取作品详情
  async getWorkDetail({ commit }, workId) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mockWork = {
      id: workId,
      title: '示例作品',
      description: '这是一个示例作品的详细描述',
      category: 'AI写作',
      status: 'published',
      createdAt: '2024-01-15 10:30:00',
      author: '张三',
      tags: ['示例', 'AI', '测试'],
      content: '这里是作品的详细内容...',
      prompt: '这里是AI提示词配置...'
    }
    
    commit('SET_CURRENT_WORK', mockWork)
    commit('SET_LOADING', false)
    return mockWork
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
