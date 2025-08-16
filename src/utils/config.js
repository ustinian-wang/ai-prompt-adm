/**
 * 配置管理工具
 * 统一管理应用配置，支持环境变量和配置文件
 */

// 获取环境配置
const getEnvConfig = () => {
  // Vite环境变量
  if (import.meta.env) {
    return {
      frontendPort: import.meta.env.VITE_FRONTEND_PORT,
      backendUrl: import.meta.env.VITE_BACKEND_URL,
      apiBase: import.meta.env.VITE_API_BASE,
      nodeEnv: import.meta.env.VITE_NODE_ENV,
      debug: import.meta.env.VITE_DEBUG === 'true'
    }
  }
  
  // Node环境变量
  if (process.env) {
    return {
      frontendPort: process.env.VITE_FRONTEND_PORT,
      backendUrl: process.env.VITE_BACKEND_URL,
      apiBase: process.env.VITE_API_BASE,
      nodeEnv: process.env.VITE_NODE_ENV,
      debug: process.env.VITE_DEBUG === 'true'
    }
  }
  
  return {}
}

// 获取项目配置
const getProjectConfig = () => {
  try {
    // 这里可以通过API获取配置，或者从localStorage等地方读取
    const config = localStorage.getItem('app_config')
    return config ? JSON.parse(config) : {}
  } catch (error) {
    console.warn('Failed to parse project config:', error)
    return {}
  }
}

// 默认配置
const defaultConfig = {
  frontendPort: 4001,  // 更新前端端口为4001
  backendUrl: 'http://localhost:4002',  // 更新后端地址为4002端口
  apiBase: '/api',
  nodeEnv: 'development',
  debug: false,
  requestTimeout: 10000
}

// 合并配置
const mergeConfig = () => {
  const envConfig = getEnvConfig()
  const projectConfig = getProjectConfig()
  
  return {
    ...defaultConfig,
    ...projectConfig,
    ...envConfig
  }
}

// 导出配置
export const config = mergeConfig()

// 配置更新方法
export const updateConfig = (newConfig) => {
  try {
    localStorage.setItem('app_config', JSON.stringify(newConfig))
    // 可以在这里添加配置更新后的回调
    console.log('配置已更新:', newConfig)
  } catch (error) {
    console.error('配置更新失败:', error)
  }
}

// 获取API完整URL
export const getApiUrl = (endpoint) => {
  const base = config.apiBase.replace(/\/$/, '')
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}

// 获取后端完整URL
export const getBackendUrl = (endpoint) => {
  const base = config.backendUrl.replace(/\/$/, '')
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}

// 环境判断
export const isDevelopment = () => config.nodeEnv === 'development'
export const isProduction = () => config.nodeEnv === 'production'
export const isDebug = () => config.debug

export default config
