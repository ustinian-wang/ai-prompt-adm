const state = {
  works: [],
  currentWork: null,
  loading: false
}

const getters = {
  works: state => state.works,
  currentWork: state => state.currentWork,
  loading: state => state.loading
}

const mutations = {
  SET_WORKS(state, works) {
    state.works = works
  },
  SET_CURRENT_WORK(state, work) {
    state.currentWork = work
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  ADD_WORK(state, work) {
    state.works.unshift(work)
  },
  UPDATE_WORK(state, updatedWork) {
    const index = state.works.findIndex(w => w.id === updatedWork.id)
    if (index !== -1) {
      state.works.splice(index, 1, updatedWork)
    }
  },
  DELETE_WORK(state, workId) {
    state.works = state.works.filter(w => w.id !== workId)
  }
}

const actions = {
  setWorks({ commit }, works) {
    commit('SET_WORKS', works)
  },
  setCurrentWork({ commit }, work) {
    commit('SET_CURRENT_WORK', work)
  },
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  },
  addWork({ commit }, work) {
    commit('ADD_WORK', work)
  },
  updateWork({ commit }, work) {
    commit('UPDATE_WORK', work)
  },
  deleteWork({ commit }, workId) {
    commit('DELETE_WORK', workId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
