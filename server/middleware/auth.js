import jwt from 'jsonwebtoken'
import { HttpResult } from '../utils/HttpResult.js'
import { svr_getUserById } from '../services/users.service.js'
import { authConfig } from '../config/auth.config.js'
/**
 * 获取请求头中的token
 * @param {*} req 
 * @returns 
 */
export function getReqToken(req, token_key = '_token_') {
  let token = null;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.cookies?.[token_key]) {
    token = req.cookies[token_key];
  }
  return token;
}
/**
 * 权限验证中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 * @param {Array} requiredRoles - 需要的角色权限（可选）
 */
export function authMiddleware(requiredRoles = []) {
  return async (req, res, next) => {
    try {
      
      // 提取token
      const token = getReqToken(req);
      
      if (!token) {
        return res.status(401).json(
          HttpResult.error({ 
            code: 401, 
            msg: '认证令牌为空' 
          })
        )
      }

      try {
        // 验证JWT token
        const decoded = jwt.verify(token, authConfig.JWT_SECRET)
        
        // 检查token是否过期
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          return res.status(401).json(
            HttpResult.error({ 
              code: 401, 
              msg: '认证令牌已过期' 
            })
          )
        }

        // 获取用户信息
        const user = svr_getUserById(decoded.userId || decoded.id)
        
        if (!user) {
          return res.status(401).json(
            HttpResult.error({ 
              code: 401, 
              msg: '用户不存在' 
            })
          )
        }

        // 检查用户状态
        // if (user.status !== 'active') {
        //   return res.status(403).json(
        //     HttpResult.error({ 
        //       code: 403, 
        //       msg: '用户账户已被禁用' 
        //     })
        //   )
        // }

        // 检查角色权限
        if (requiredRoles.length > 0) {
          if (!requiredRoles.includes(user.role)) {
            return res.status(403).json(
              HttpResult.error({ 
                code: 403, 
                msg: '权限不足，需要以下角色之一: ' + requiredRoles.join(', ') 
              })
            )
          }
        }

        // 将用户信息添加到请求对象中
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar
        }

        // 继续下一个中间件
        next()
        
      } catch (jwtError) {
        console.error('JWT验证失败:', jwtError)
        
        if (jwtError.name === 'JsonWebTokenError') {
          return res.status(401).json(
            HttpResult.error({ 
              code: 401, 
              msg: '无效的认证令牌',
              token: token
            })
          )
        } else if (jwtError.name === 'TokenExpiredError') {
          return res.status(401).json(
            HttpResult.error({ 
              code: 401, 
              msg: '认证令牌已过期',
              token: token
            })
          )
        } else {
          return res.status(401).json(
            HttpResult.error({ 
              code: 401, 
              msg: '认证令牌验证失败',
              token: token
            })
          )
        }
      }
      
    } catch (error) {
      console.error('权限验证中间件错误:', error)
      return res.status(500).json(
        HttpResult.error({ 
          code: 500, 
          msg: '服务器内部错误' 
        })
      )
    }
  }
}

/**
 * 可选认证中间件 - 如果有token就验证，没有就跳过
 * 用于一些可选登录的接口
 */
export function optionalAuthMiddleware() {
  return async (req, res, next) => {
    try {
      const token = getReqToken(req);
      
      if (!token) {
        // 没有token，跳过验证
        req.user = null
        return next()
      }

      try {
        const decoded = jwt.verify(token, authConfig.JWT_SECRET)
        
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          req.user = null
          return next()
        }

        const user = svr_getUserById(decoded.userId || decoded.id)
        
        if (user && user.status === 'active') {
          req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            avatar: user.avatar
          }
        } else {
          req.user = null
        }

        next()
        
      } catch (jwtError) {
        // JWT验证失败，但不阻止请求继续
        req.user = null
        next()
      }
      
    } catch (error) {
      console.error('可选认证中间件错误:', error)
      req.user = null
      next()
    }
  }
}

/**
 * 角色权限检查中间件
 * @param {Array} roles - 允许的角色列表
 */
export function roleCheckMiddleware(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        HttpResult.error({ 
          code: 401, 
          msg: '请先登录' 
        })
      )
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        HttpResult.error({ 
          code: 403, 
          msg: '权限不足，需要以下角色之一: ' + roles.join(', ') 
        })
      )
    }

    next()
  }
}

/**
 * 管理员权限检查中间件
 */
export function adminCheckMiddleware() {
  return roleCheckMiddleware(['admin', 'super_admin'])
}

/**
 * 用户权限检查中间件
 */
export function userCheckMiddleware() {
  return roleCheckMiddleware(['admin', 'super_admin', 'user'])
}
