import { loginApi, logoutApi } from '@/api/authApi'
import { getToken, removeToken, setToken } from '@/utils/token'

const state = {
  token: getToken(),
  isLoggedIn: !!getToken()
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    state.isLoggedIn = !!token
    console.log('SET_TOKEN mutation - 设置token:', token);
    if (token) {
      setToken(token);
    } else {
      removeToken();
    }
  },
  
  CLEAR_AUTH(state) {
    state.token = ''
    state.isLoggedIn = false
    removeToken();
  }
}

const actions = {
  // 登录
  async login({ commit }, loginForm) {
    try {
      const res = await loginApi(loginForm);
      console.log('[login] loginApi', res)
      if(res.data.success){
        commit('SET_TOKEN', res.data.data.token);
        localStorage.setItem('userInfo', JSON.stringify(res.data.data.userInfo));
      }else{
        Vue.prototype.$message.error(res.data.msg)
      }
      return res.data
    } catch (error) {
      throw error
    }
  },

  // 登出
  async logout({ commit }) {
    try {
      await logoutApi()
      commit('CLEAR_AUTH')
      localStorage.removeItem('userInfo');
    } catch (error) {
      console.error('Logout error:', error)
      commit('CLEAR_AUTH')
    }
  }
}

const getters = {
  isLoggedIn: state => state.isLoggedIn,
  token: state => state.token
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
