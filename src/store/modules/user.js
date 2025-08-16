import { 
  getUserListApi, 
  getUserDetailApi, 
  createUserApi, 
  updateUserApi, 
  deleteUserApi,
  batchDeleteUsersApi,
  getUserInfoApi,
  updateUserInfoApi,
  changePasswordApi
} from '@/api/userApi'

const state = {
  // 用户管理相关状态
  usersList: [],
  loading: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  },
  
  // 用户信息相关状态
  userInfo: {
    name: '请登录',
    avatar: '',
    email: '',
    id: 0,
  },
  roles: ['admin']
}

const mutations = {
  // 用户管理相关mutations
  SET_USERS_LIST(state, list) {
    state.usersList = list
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  },
  ADD_USER(state, user) {
    state.usersList.unshift(user)
    state.pagination.total += 1
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.usersList.findIndex(u => u.id === updatedUser.id)
    if (index !== -1) {
      state.usersList.splice(index, 1, updatedUser)
    }
  },
  DELETE_USER(state, userId) {
    const index = state.usersList.findIndex(u => u.id === userId)
    if (index !== -1) {
      state.usersList.splice(index, 1)
      state.pagination.total -= 1
    }
  },
  
  // 用户信息相关mutations
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  SET_ROLES(state, roles) {
    state.roles = roles
  }
}

const actions = {
  // ==================== 用户管理相关actions ====================
  
  // 获取用户列表
  async getUsersList({ commit }, params = {}) {
    commit('SET_LOADING', true)
    
    try {
      const response = await getUserListApi(params)
      if (response.data.success) {
        const { list, total, page, pageSize } = response.data.data
        commit('SET_USERS_LIST', list)
        commit('SET_PAGINATION', { 
          current: page, 
          pageSize, 
          total 
        })
      } else {
        throw new Error(response.data.msg || '获取用户列表失败')
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取用户详情
  async getUserDetail({ commit }, userId) {
    try {
      const response = await getUserDetailApi(userId)
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.msg || '获取用户详情失败')
      }
    } catch (error) {
      console.error('获取用户详情失败:', error)
      throw error
    }
  },
  
  // 创建用户
  async createUser({ commit }, userData) {
    commit('SET_LOADING', true)
    
    try {
      const response = await createUserApi(userData)
      if (response.data.success) {
        const newUser = response.data.data
        commit('ADD_USER', newUser)
        commit('SET_PAGINATION', { 
          total: state.pagination.total + 1 
        })
        return newUser
      } else {
        throw new Error(response.data.msg || '创建用户失败')
      }
    } catch (error) {
      console.error('创建用户失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 更新用户
  async updateUser({ commit }, userData) {
    commit('SET_LOADING', true)
    
    try {
      const response = await updateUserApi(userData)
      if (response.data.success) {
        const updatedUser = response.data.data
        commit('UPDATE_USER', updatedUser)
        return updatedUser
      } else {
        throw new Error(response.data.msg || '更新用户失败')
      }
    } catch (error) {
      console.error('更新用户失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 删除用户
  async deleteUser({ commit }, userId) {
    commit('SET_LOADING', true)
    
    try {
      const response = await deleteUserApi(userId)
      if (response.data.success) {
        commit('DELETE_USER', userId)
        commit('SET_PAGINATION', { 
          total: state.pagination.total - 1 
        })
      } else {
        throw new Error(response.data.msg || '删除用户失败')
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 批量删除用户
  async batchDeleteUsers({ commit }, userIds) {
    commit('SET_LOADING', true)
    
    try {
      const response = await batchDeleteUsersApi(userIds)
      if (response.data.success) {
        // 从列表中移除被删除的用户
        userIds.forEach(id => {
          commit('DELETE_USER', id)
        })
        commit('SET_PAGINATION', { 
          total: state.pagination.total - userIds.length 
        })
        return response.data.msg
      } else {
        throw new Error(response.data.msg || '批量删除用户失败')
      }
    } catch (error) {
      console.error('批量删除用户失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // ==================== 用户信息相关actions ====================
  
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
  
  // 更新用户信息
  async updateUserInfo({ commit }, userInfo) {
    try {
      const response = await updateUserInfoApi(userInfo)
      if (response.data.success) {
        commit('SET_USER_INFO', userInfo)
        return response.data
      } else {
        throw new Error(response.data.msg || '更新用户信息失败')
      }
    } catch (error) {
      throw error
    }
  },
  
  // 修改密码
  async changePassword({ commit }, passwordData) {
    try {
      const response = await changePasswordApi(passwordData)
      if (response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.msg || '修改密码失败')
      }
    } catch (error) {
      throw error
    }
  }
}

const getters = {
  // 用户管理相关getters
  usersList: state => state.usersList,
  loading: state => state.loading,
  pagination: state => state.pagination,
  
  // 用户信息相关getters
  userInfo: state => state.userInfo,
  roles: state => state.roles,
  userAvatar: state => state.userInfo.avatar || 'https://via.placeholder.com/32x32/1890ff/ffffff?text=U',
  userName: state => state.userInfo.name || '用户',
  syncUserInfo: (state)=>{
    let default_userInfo = {
      name: '请登录',
      avatar: '',
      email: '',
      id: 0,
    };
    let curr_userInfo = default_userInfo;
    return () => {
      try{
          
        let userInfo = localStorage.getItem('userInfo') || '{}';
        userInfo = JSON.parse(userInfo);
        curr_userInfo = userInfo;
        state.userInfo = curr_userInfo;
      }catch(e){
        console.error('获取用户信息失败:', e)
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
