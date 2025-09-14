import axios from 'axios'
import { message } from 'ant-design-vue'
import store from '@/store'
import router from '@/router'
import config from './config'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 10000
})

// 获取token的辅助函数（优先从cookie获取）
const getToken = () => {
  // 1. 优先从store获取
  try {
    const storeToken = store?.state?.auth?.token || ''
    if (storeToken) return storeToken
  } catch (e) {
    // store不可用时继续
  }
  
  // 2. 尝试从cookie获取（如果可用）
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const memberTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('member_token=')
    );
    if (memberTokenCookie) {
      return memberTokenCookie.split('=')[1];
    }
    
    // 也检查client_token cookie
    const clientTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('client_token=')
    );
    if (clientTokenCookie) {
      return clientTokenCookie.split('=')[1];
    }
  }
  
  // 3. fallback到localStorage
  return localStorage.getItem('client_token') || localStorage.getItem('_token_') || ''
};

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加token到请求头
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 显示loading
    store.dispatch('setLoading', true)
    
    // 调试信息
    if (config.debug) {
      console.log('API请求:', config.method?.toUpperCase(), config.url, config.data || config.params)
    }
    
    return config
  },
  error => {
    store.dispatch('setLoading', false)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    store.dispatch('setLoading', false)
    
    const res = response.data
    
    // 调试信息
    if (config.debug) {
      console.log('API响应:', response.status, response.config.url, res)
    }
    
    // 如果返回的状态码不是200，说明接口有问题，应该提示错误
    if (response.status !== 200) {
      message.error(res.msg || '请求失败')
      
      // 401: 未登录或token过期
      if (res.code === 401) {
        store.dispatch('auth/logout')
        router.push('/login')
      }
      
      return Promise.reject(new Error(res.msg || '请求失败'))
    } else {
      return response;
    }
  },
  error => {
    store.dispatch('setLoading', false)
    
    let errorMessage = '网络错误'
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          errorMessage = data.message || '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
                  store.dispatch('auth/logout')
        router.push('/login')
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求地址不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = data.message || '请求失败'
      }
    } else if (error.request) {
      errorMessage = '网络连接失败'
    } else {
      errorMessage = error.message
    }
    
    message.error(errorMessage)
    return Promise.reject(error)
  }
)

export default request
