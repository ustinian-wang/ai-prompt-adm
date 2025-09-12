import { loginApi, registerApi } from '../../src/api/authApi'
import { loginMember as memberLogin, registerMember } from '../api/memberApi'

const state = {
  token: localStorage.getItem('client_token') || '',
  userInfo: JSON.parse(localStorage.getItem('client_userInfo') || '{}')
}

const getters = {
  token: state => state.token,
  userInfo: state => state.userInfo,
  isLoggedIn: state => !!state.token
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('client_token', token)
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    localStorage.setItem('client_userInfo', JSON.stringify(userInfo))
  },
  CLEAR_AUTH(state) {
    state.token = ''
    state.userInfo = {}
    localStorage.removeItem('client_token')
    localStorage.removeItem('client_userInfo')
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await loginApi(credentials)
      if (response.data.success) {
        commit('SET_TOKEN', response.data.token)
        commit('SET_USER_INFO', response.data.userInfo)
        return { success: true, data: response.data }
      } else {
        return { success: false, msg: response.data.msg }
      }
    } catch (error) {
      return { success: false, msg: error.message || '登录失败' }
    }
  },

  // 会员登录（使用 /api/member/login）
  async loginMember({ commit }, payload) {
    try {
      const res = await memberLogin(payload)
      const data = res?.data || {}
      if (data.success) {
        const raw = data.data || {}
        const normalized = {
          username: raw.mem_nickname || raw.mem_username || '会员',
          avatar: raw.mem_avatar || '',
          mem_id: raw.mem_id,
          raw
        }
        commit('SET_TOKEN', data.token || '')
        commit('SET_USER_INFO', normalized)
        return { success: true, data: normalized }
      }
      return { success: false, msg: data.msg || '登录失败' }
    } catch (e) {
      return { success: false, msg: e?.message || '登录失败' }
    }
  },

  async register({ commit }, userData) {
    try {
      const response = await registerApi(userData)
      if (response.data.success) {
        // 注册成功后自动登录
        return await this.dispatch('login', {
          username: userData.username,
          password: userData.password
        })
      } else {
        return { success: false, msg: response.data.msg }
      }
    } catch (error) {
      return { success: false, msg: error.message || '注册失败' }
    }
  },

  logout({ commit }) {
    commit('CLEAR_AUTH')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
