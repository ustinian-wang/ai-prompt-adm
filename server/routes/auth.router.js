import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { svr_createUser, svr_getUserByUsername, svr_initDefaultUser, svr_getUserById } from '../services/users.service.js'
import { getReqParam, HttpResult } from '../utils/HttpResult.js'

const router = express.Router()

// 初始化默认用户
svr_initDefaultUser()

// POST /api/auth/login
async function loginHandler(req, res) {
  let username = getReqParam(req, 'username');
  let password = getReqParam(req, 'password');
  
  if (!username || !password) {
    return res.status(200).json(
      HttpResult.error({ 
        code: 400, 
        msg: '用户名或密码不能为空' 
      })
    )
  }
  
  try {
    const user = svr_getUserByUsername(username)
    if (!user) {
      return res.status(200).json(
        HttpResult.error({ 
          code: 401, 
          msg: '用户不存在' 
        })
      )
    }
    
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(200).json(
        HttpResult.error({ 
          code: 401, 
          msg: '密码错误' 
        })
      )
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )
    
    return res.status(200).json(
      HttpResult.success({
        msg: '登录成功',
        data: {
          token,
          userInfo: {
            name: user.username,
            email: user.email,
            avatar: user.avatar
          },
          roles: [user.role]
        }
      })
    )
  } catch (e) {
    return res.status(200).json(
      HttpResult.error({ 
        code: 500, 
        msg: e.message || '服务器错误' 
      })
    )
  }
}
router.get('/login', loginHandler);
router.post('/login', loginHandler);

async function registerHandler(req, res) {  
  let username = getReqParam(req, 'username');
  let email = getReqParam(req, 'email');
  let password = getReqParam(req, 'password');
  
  try {

    if(!username || !password){
      return res.status(200).json(
        HttpResult.error({ 
          code: 400, 
          msg: '用户名、密码不能为空' 
        })
      )
    }

    let old_user = svr_getUserByUsername(username);
    if(old_user){
      return res.status(200).json(
        HttpResult.error({ 
          code: 400, 
          msg: '用户名已存在' 
        })
      )
    }

    const hash = await bcrypt.hash(password, 10);
    const user = svr_createUser({ username, email, password: hash, avatar: '' })
    
    return res.status(200).json(
      HttpResult.success({
        msg: '注册成功',
        data: { id: user.id }
      })
    )
  } catch (e) {
    return res.status(200).json(
      HttpResult.error({ 
        code: 400, 
        msg: e.message 
      })
    )
  }
}

// POST /api/auth/register
router.get('/register', registerHandler);
router.post('/register', registerHandler);

// POST /api/auth/logout
async function logoutHandler(req, res) {  
  return res.status(200).json(
    HttpResult.success({
      msg: '已退出登录'
    })
  )
}
router.get('/logout', logoutHandler);
router.post('/logout', logoutHandler);

// GET /api/auth/profile (可选)
async function profileHandler(req, res) {
  // 简化：直接返回admin信息（生产环境应通过JWT验证）
  const user = svr_getUserById(req.user.id)

  return res.status(200).json(
    HttpResult.success({
      data: {
        userInfo: { name: user.username, email: user.email, avatar: user.avatar },
        roles: [user.role]
      }
    })
  )
}
router.get('/profile', profileHandler);
router.post('/profile', profileHandler);

export default router

