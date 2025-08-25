const state = {
  categories: [],
  loading: false
}

const getters = {
  categories: state => state.categories,
  loading: state => state.loading
}

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  ADD_CATEGORY(state, category) {
    state.categories.push(category)
  },
  UPDATE_CATEGORY(state, updatedCategory) {
    const index = state.categories.findIndex(c => c.id === updatedCategory.id)
    if (index !== -1) {
      state.categories.splice(index, 1, updatedCategory)
    }
  },
  DELETE_CATEGORY(state, categoryId) {
    state.categories = state.categories.filter(c => c.id !== categoryId)
  }
}

const actions = {
  setCategories({ commit }, categories) {
    commit('SET_CATEGORIES', categories)
  },
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  },
  addCategory({ commit }, category) {
    commit('ADD_CATEGORY', category)
  },
  updateCategory({ commit }, category) {
    commit('UPDATE_CATEGORY', category)
  },
  deleteCategory({ commit }, categoryId) {
    commit('DELETE_CATEGORY', categoryId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
