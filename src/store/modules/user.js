import { loginApi, logoutApi, getUserInfoApi } from '@/api/loginApi'

const state = {
  token: localStorage.getItem('token'),
  userInfo: {
    name: '管理员',
    avatar: 'https://via.placeholder.com/32x32/1890ff/ffffff?text=U',
    email: 'admin@example.com',
    id: 0,
  },
  roles: ['admin']
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  SET_ROLES(state, roles) {
    state.roles = roles
  },
  CLEAR_USER(state) {
    state.token = ''
    state.userInfo = {}
    state.roles = []
    localStorage.removeItem('token')
  }
}

const actions = {
  // 登录
  async login({ commit }, loginForm) {
    try {
      const res = await loginApi(loginForm);
      if(res.data.success){
        commit('SET_TOKEN', res.data.token)
      }else{
        Vue.prototype.$message.error(res.data.msg)
      }
      return res.data
    } catch (error) {
      throw error
    }
  },

  // 获取用户信息
  async getUserInfo({ commit }) {
    try {
      const { data } = await getUserInfoApi()
      commit('SET_USER_INFO', data.userInfo)
      commit('SET_ROLES', data.roles)
      return data
    } catch (error) {
      throw error
    }
  },

  // 登出
  async logout({ commit }) {
    try {
      await logoutApi()
      commit('CLEAR_USER')
    } catch (error) {
      console.error('Logout error:', error)
      commit('CLEAR_USER')
    }
  }
}

const getters = {
  isLoggedIn: state => {
    return !!state.token;
  },
  userAvatar: state => state.userInfo.avatar || 'https://via.placeholder.com/32x32/1890ff/ffffff?text=U',
  userName: state => state.userInfo.name || '用户'
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
