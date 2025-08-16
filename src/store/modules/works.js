import { getWorkListApi, deleteWorkApi, createWorkApi, updateWorkApi, getWorkDetailApi } from '@/api/worksApi'

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
    
    try {
      const res = await createWorkApi(workData)
      if (res.data.success) {
        const newWork = {
          id: Date.now(),
          ...workData,
          work_create_at: new Date().toLocaleString('zh-CN'),
          work_status: '展示'
        }
        commit('ADD_WORK', newWork)
        return newWork
      } else {
        Vue.prototype.$message.error(res.data.msg)
        return null
      }
    } catch (error) {
      Vue.prototype.$message.error('创建作品失败')
      return null
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 更新作品
  async updateWork({ commit }, workData) {
    commit('SET_LOADING', true)
    
    try {
      const res = await updateWorkApi(workData.work_id, workData)
      if (res.data.success) {
        commit('UPDATE_WORK', workData)
        return workData
      } else {
        Vue.prototype.$message.error(res.data.msg)
        return null
      }
    } catch (error) {
      Vue.prototype.$message.error('更新作品失败')
      return null
    } finally {
      commit('SET_LOADING', false)
    }
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
    
    try {
      const res = await getWorkDetailApi(workId)
      if (res.data.success) {
        const work = res.data.data
        commit('SET_CURRENT_WORK', work)
        return work
      } else {
        Vue.prototype.$message.error(res.data.msg)
        return null
      }
    } catch (error) {
      Vue.prototype.$message.error('获取作品详情失败')
      return null
    } finally {
      commit('SET_LOADING', false)
    }
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
