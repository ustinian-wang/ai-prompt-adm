const express = require('express')

const router = express.Router()

// 简化：返回固定角色列表
router.get('/', (req, res) => {
  res.status(200).json({
    code: 200,
    data: [
      { id: 1, name: 'admin', description: '系统管理员' },
      { id: 2, name: 'user', description: '普通用户' }
    ]
  })
})

module.exports = router

