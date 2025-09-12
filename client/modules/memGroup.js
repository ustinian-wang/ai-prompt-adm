const state = {
  groups: [],
  pagination: { page: 1, limit: 20, total: 0 },
  currentGroup: null,
  loading: false
}

const getters = {
  groups: state => state.groups,
  currentGroup: state => state.currentGroup,
  loading: state => state.loading,
  pagination: state => state.pagination
}

const mutations = {
  SET_GROUPS(state, list) {
    state.groups = list || []
  },
  SET_PAGINATION(state, p) {
    state.pagination = { ...state.pagination, ...p }
  },
  SET_CURRENT_GROUP(state, group) {
    state.currentGroup = group
  },
  SET_LOADING(state, loading) {
    state.loading = !!loading
  },
  ADD_GROUP(state, group) {
    state.groups.unshift(group)
    state.pagination.total = (state.pagination.total || 0) + 1
  },
  UPDATE_GROUP(state, group) {
    const idx = state.groups.findIndex(x => x.mg_id === group.mg_id)
    if (idx !== -1) state.groups.splice(idx, 1, { ...state.groups[idx], ...group })
  },
  REMOVE_GROUP(state, mg_id) {
    state.groups = state.groups.filter(x => x.mg_id !== mg_id)
    state.pagination.total = Math.max(0, (state.pagination.total || 0) - 1)
  }
}

const actions = {
  async fetchGroups({ commit }, params) {
    commit('SET_LOADING', true)
    try {
      const { default: request } = await import('../../src/utils/request')
      const res = await request.get('/api/member/mem_group/list', { params })
      const data = res?.data?.data || res?.data
      commit('SET_GROUPS', data?.list || [])
      commit('SET_PAGINATION', { page: data?.page || 1, limit: data?.limit || 20, total: data?.total || 0 })
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async fetchGroupDetail({ commit }, params) {
    const { default: request } = await import('../../src/utils/request')
    const res = await request.get('/api/member/mem_group/detail', { params })
    const data = res?.data?.data || res?.data
    commit('SET_CURRENT_GROUP', data)
    return data
  },
  async createGroup({ commit }, payload) {
    const { default: request } = await import('../../src/utils/request')
    const res = await request.post('/api/member/mem_group/create', payload)
    const data = res?.data?.data || res?.data
    commit('ADD_GROUP', data)
    return data
  },
  async updateGroup({ commit }, payload) {
    const { default: request } = await import('../../src/utils/request')
    const res = await request.post('/api/member/mem_group/update', payload)
    const data = res?.data?.data || res?.data
    commit('UPDATE_GROUP', data)
    return data
  },
  async deleteGroup({ commit }, payload) {
    const { default: request } = await import('../../src/utils/request')
    const res = await request.post('/api/member/mem_group/delete', payload)
    if ((res?.data?.code || 200) === 200) {
      commit('REMOVE_GROUP', payload.mg_id)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}


