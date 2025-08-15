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
  },
  ADD_CATEGORY(state, category) {
    state.categoriesList.unshift(category)
  },
  UPDATE_CATEGORY(state, updatedCategory) {
    const index = state.categoriesList.findIndex(c => c.id === updatedCategory.id)
    if (index !== -1) {
      state.categoriesList.splice(index, 1, updatedCategory)
    }
  },
  DELETE_CATEGORY(state, categoryId) {
    const index = state.categoriesList.findIndex(c => c.id === categoryId)
    if (index !== -1) {
      state.categoriesList.splice(index, 1)
    }
  }
}

const actions = {
  // 获取分类列表
  async getCategoriesList({ commit }) {
    commit('SET_LOADING', true)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const mockData = [
      {
        id: 1,
        name: 'AI写作',
        description: 'AI辅助写作相关工具和提示词',
        sortOrder: 1,
        parentId: 0,
        createdAt: '2024-01-01 00:00:00',
        count: 15
      },
      {
        id: 2,
        name: 'AI绘画',
        description: 'AI绘画生成相关工具和提示词',
        sortOrder: 2,
        parentId: 0,
        createdAt: '2024-01-01 00:00:00',
        count: 23
      },
      {
        id: 3,
        name: 'AI编程',
        description: 'AI辅助编程相关工具和提示词',
        sortOrder: 3,
        parentId: 0,
        createdAt: '2024-01-01 00:00:00',
        count: 8
      },
      {
        id: 4,
        name: 'AI分析',
        description: 'AI数据分析相关工具和提示词',
        sortOrder: 4,
        parentId: 0,
        createdAt: '2024-01-01 00:00:00',
        count: 12
      },
      {
        id: 5,
        name: 'AI应用',
        description: '其他AI应用相关工具和提示词',
        sortOrder: 5,
        parentId: 0,
        createdAt: '2024-01-01 00:00:00',
        count: 19
      }
    ]
    
    commit('SET_CATEGORIES_LIST', mockData)
    commit('SET_LOADING', false)
  },
  
  // 创建分类
  async createCategory({ commit }, categoryData) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const newCategory = {
      id: Date.now(),
      ...categoryData,
      createdAt: new Date().toLocaleString(),
      count: 0
    }
    
    commit('ADD_CATEGORY', newCategory)
    commit('SET_LOADING', false)
    return newCategory
  },
  
  // 更新分类
  async updateCategory({ commit }, categoryData) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    commit('UPDATE_CATEGORY', categoryData)
    commit('SET_LOADING', false)
    return categoryData
  },
  
  // 删除分类
  async deleteCategory({ commit }, categoryId) {
    commit('SET_LOADING', true)
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    commit('DELETE_CATEGORY', categoryId)
    commit('SET_LOADING', false)
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
