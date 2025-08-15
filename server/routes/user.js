const express = require('express')
const { findUserByUsername } = require('../utils/fileDb')

const router = express.Router()

// GET /api/user/info
router.get('/info', (req, res) => {
  // 简化：直接返回admin信息（生产环境应解析JWT）
  const user = findUserByUsername('admin')
  res.status(200).json({
    code: 200,
    data: {
      userInfo: {
        name: user.username,
        email: user.email,
        avatar: user.avatar
      },
      roles: [user.role]
    }
  })
})

module.exports = router

