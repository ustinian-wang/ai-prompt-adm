// 权限验证中间件
export { 
  authMiddleware, 
  optionalAuthMiddleware, 
  roleCheckMiddleware, 
  adminCheckMiddleware, 
  userCheckMiddleware 
} from './auth.js'

// 可以在这里添加其他中间件
// export { rateLimitMiddleware } from './rateLimit.js'
// export { corsMiddleware } from './cors.js'
// export { loggingMiddleware } from './logging.js'
