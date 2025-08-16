import express from 'express'
import { authMiddleware, userCheckMiddleware } from '../middleware/index.js'

const router = express.Router()

// 简化：返回静态数据（演示）
router.get('/', authMiddleware(), (req, res) => {
  res.status(200).json({
    code: 200,
    data: [
      { id: 1, name: 'AI写作', description: 'AI写作相关提示词', parent_id: 0, sort_order: 1 },
      { id: 2, name: 'AI绘画', description: 'AI绘画相关提示词', parent_id: 0, sort_order: 2 }
    ]
  })
})

export default router

