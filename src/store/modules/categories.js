import {
  getCategoriesList,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategorySort,
  getCategoryStats,
  toggleCategoryStatus,
  toggleCategoryNav
} from '@/api/categoriesApi'

const state = {
  categoriesList: [],
  allCategories: [],
  currentCategory: null,
  loading: false,
  pagination: {
    current: 1,
    pageSize: 20,
    total: 0
  }
}

const mutations = {
  SET_CATEGORIES_LIST(state, list) {
    state.categoriesList = list
  },
  SET_ALL_CATEGORIES(state, list) {
    state.allCategories = list
  },
  SET_CURRENT_CATEGORY(state, category) {
    state.currentCategory = category
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  },
  ADD_CATEGORY(state, category) {
    state.categoriesList.unshift(category)
    state.pagination.total += 1
  },
  UPDATE_CATEGORY(state, updatedCategory) {
    const index = state.categoriesList.findIndex(c => c.category_id === updatedCategory.category_id)
    if (index !== -1) {
      state.categoriesList.splice(index, 1, updatedCategory)
    }
  },
  DELETE_CATEGORY(state, categoryId) {
    const index = state.categoriesList.findIndex(c => c.category_id === categoryId)
    if (index !== -1) {
      state.categoriesList.splice(index, 1)
      state.pagination.total -= 1
    }
  }
}

const actions = {
  // 获取分类列表（带分页）
  async getCategoriesList({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await getCategoriesList(params)
      if (response.code === 200) {
        commit('SET_CATEGORIES_LIST', response.data.list)
        commit('SET_PAGINATION', {
          current: response.data.page,
          pageSize: response.data.limit,
          total: response.data.total
        })
      }
      return response
    } catch (error) {
      console.error('获取分类列表失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取所有启用的分类
  async getAllCategories({ commit }, params = {}) {
    try {
      const response = await getAllCategories(params)
      if (response.code === 200) {
        commit('SET_ALL_CATEGORIES', response.data)
      }
      return response
    } catch (error) {
      console.error('获取所有分类失败:', error)
      throw error
    }
  },

  // 根据ID获取分类详情
  async getCategoryById({ commit }, categoryId) {
    try {
      const response = await getCategoryById(categoryId)
      if (response.code === 200) {
        commit('SET_CURRENT_CATEGORY', response.data)
      }
      return response
    } catch (error) {
      console.error('获取分类详情失败:', error)
      throw error
    }
  },

  // 创建分类
  async createCategory({ commit }, categoryData) {
    commit('SET_LOADING', true)
    try {
      const response = await createCategory(categoryData)
      if (response.code === 200) {
        commit('ADD_CATEGORY', response.data)
      }
      return response
    } catch (error) {
      console.error('创建分类失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 更新分类
  async updateCategory({ commit }, { categoryId, updateData }) {
    commit('SET_LOADING', true)
    try {
      const response = await updateCategory(categoryId, updateData)
      if (response.code === 200) {
        commit('UPDATE_CATEGORY', response.data)
      }
      return response
    } catch (error) {
      console.error('更新分类失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 删除分类
  async deleteCategory({ commit }, categoryId) {
    commit('SET_LOADING', true)
    try {
      const response = await deleteCategory(categoryId)
      if (response.code === 200) {
        commit('DELETE_CATEGORY', categoryId)
      }
      return response
    } catch (error) {
      console.error('删除分类失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 批量更新分类排序
  async updateCategorySort({ commit, dispatch }, sortData) {
    try {
      const response = await updateCategorySort(sortData)
      if (response.code === 200) {
        // 重新获取列表以更新排序
        await dispatch('getCategoriesList')
      }
      return response
    } catch (error) {
      console.error('批量更新分类排序失败:', error)
      throw error
    }
  },

  // 获取分类统计信息
  async getCategoryStats({ commit }) {
    try {
      const response = await getCategoryStats()
      return response
    } catch (error) {
      console.error('获取分类统计失败:', error)
      throw error
    }
  },

  // 切换分类状态
  async toggleCategoryStatus({ commit }, { categoryId, enabled }) {
    try {
      const response = await toggleCategoryStatus(categoryId, enabled)
      if (response.code === 200) {
        commit('UPDATE_CATEGORY', response.data)
      }
      return response
    } catch (error) {
      console.error('切换分类状态失败:', error)
      throw error
    }
  },

  // 切换分类导航显示
  async toggleCategoryNav({ commit }, { categoryId, showInNav }) {
    try {
      const response = await toggleCategoryNav(categoryId, showInNav)
      if (response.code === 200) {
        commit('UPDATE_CATEGORY', response.data)
      }
      return response
    } catch (error) {
      console.error('切换分类导航显示失败:', error)
      throw error
    }
  }
}

const getters = {
  categoriesList: state => state.categoriesList,
  allCategories: state => state.allCategories,
  currentCategory: state => state.currentCategory,
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
