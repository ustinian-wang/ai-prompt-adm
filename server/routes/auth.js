const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { findUserByUsername, addUser, initDefaultUsers } = require('../utils/fileDb')

const router = express.Router()

// 初始化默认用户
initDefaultUsers()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(200).json({ code: 400, message: '用户名或密码不能为空' })
  }
  try {
    const user = findUserByUsername(username)
    if (!user) {
      return res.status(200).json({ code: 401, message: '用户不存在' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(200).json({ code: 401, message: '密码错误' })
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )
    return res.status(200).json({
      code: 200,
      message: '登录成功',
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
  } catch (e) {
    return res.status(200).json({ code: 500, message: e.message || '服务器错误' })
  }
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body || {}
  if (!username || !email || !password) {
    return res.status(200).json({ code: 400, message: '缺少必填项' })
  }
  try {
    const hash = await bcrypt.hash(password, 10)
    const user = addUser({ username, email, password: hash, avatar: '' })
    return res.status(200).json({ code: 200, message: '注册成功', data: { id: user.id } })
  } catch (e) {
    return res.status(200).json({ code: 400, message: e.message })
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.status(200).json({ code: 200, message: '已退出登录' })
})

// GET /api/auth/profile (可选)
router.get('/profile', (req, res) => {
  // 简化：直接返回admin信息（生产环境应通过JWT验证）
  const user = findUserByUsername('admin')
  return res.status(200).json({
    code: 200,
    data: {
      userInfo: { name: user.username, email: user.email, avatar: user.avatar },
      roles: [user.role]
    }
  })
})

module.exports = router

