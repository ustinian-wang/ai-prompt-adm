import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import user from './modules/user'
import works from './modules/works'
import categories from './modules/categories'
import system from './modules/system'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    user,
    works,
    categories,
    system
  },
  state: {
    loading: false,
    sidebarCollapsed: false
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    TOGGLE_SIDEBAR(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    }
  },
  actions: {
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading)
    },
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    }
  }
})
