import express from 'express'

const router = express.Router()

// 简化：返回静态数据（演示）
router.get('/', (req, res) => {
  res.status(200).json({ code: 200, data: [] })
})

export default router

