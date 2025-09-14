import { loginApi, registerApi } from '../../src/api/authApi'
import { loginMember as memberLogin, registerMember } from '../api/memberApi'

// 获取token的辅助函数（优先从cookie获取，fallback到localStorage）
const getToken = () => {
  // 尝试从cookie获取（如果可用）
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const memberTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('member_token=')
    );
    if (memberTokenCookie) {
      return memberTokenCookie.split('=')[1];
    }
  }
  // fallback到localStorage
  return localStorage.getItem('client_token') || '';
};

const state = {
  token: getToken(),
  userInfo: JSON.parse(localStorage.getItem('client_userInfo') || '{}')
}

const getters = {
  token: state => state.token,
  userInfo: state => state.userInfo,
  isLoggedIn: state => !!state.token
}

// 设置cookie的辅助函数
const setCookie = (name, value, days = 30) => {
  if (typeof document !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
};

// 清除cookie的辅助函数
const clearCookie = (name) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
  }
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    // 同时存储到localStorage和cookie
    localStorage.setItem('client_token', token)
    setCookie('client_token', token, 30) // 30天过期
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    localStorage.setItem('client_userInfo', JSON.stringify(userInfo))
  },
  CLEAR_AUTH(state) {
    state.token = ''
    state.userInfo = {}
    // 清除localStorage
    localStorage.removeItem('client_token')
    localStorage.removeItem('client_userInfo')
    // 清除cookie
    clearCookie('client_token')
    clearCookie('member_token')
  }
}

const actions = {
  // 初始化认证状态（同步cookie和localStorage）
  initAuth({ commit, state }) {
    const cookieToken = getToken()
    if (cookieToken && cookieToken !== state.token) {
      // 如果cookie中有token但state中没有，更新state
      commit('SET_TOKEN', cookieToken)
    }
  },

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

  async logout({ commit }) {
    try {
      // 调用后端登出接口清除服务端cookie
      const { default: request } = await import('../../src/utils/request')
      await request.post('/api/member/logout')
    } catch (error) {
      console.warn('后端登出失败:', error)
      // 即使后端登出失败，也要清除前端状态
    } finally {
      // 清除前端状态
      commit('CLEAR_AUTH')
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
