const state = {
  currentUser: null
}

const getters = {
  currentUser: state => state.currentUser
}

const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  }
}

const actions = {
  setCurrentUser({ commit }, user) {
    commit('SET_CURRENT_USER', user)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
