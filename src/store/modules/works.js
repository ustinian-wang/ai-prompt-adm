import { getWorkListApi, deleteWorkApi } from '@/api/worksApi'

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
    
    let work_list = [];
    let res = await getWorkListApi(params);
   
    if(res.data.success){
      work_list = res.data.data;
    }else{
      Vue.prototype.$message.error(res.data.msg);
    }

    commit('SET_WORKS_LIST', work_list)
    commit('SET_PAGINATION', {
      current: 1,
      pageSize: 10,
      total: work_list.length
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
      work_create_at: new Date().toLocaleString('zh-CN'),
      work_status: '展示'
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
    
    try{
      let res = await deleteWorkApi(workId);
      if(res.data.success){
        commit('DELETE_WORK', workId)
        return true
      }else{
        Vue.prototype.$message.error(res.data.msg);
        return false
      }
    }finally{
      commit('SET_LOADING', false)
    }
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
