import express from 'express'
import { getUsers } from '../utils/fileDb.js'

const router = express.Router()

// GET /api/users
router.get('/', (req, res) => {
  const users = getUsers().map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    status: u.status,
    avatar: u.avatar,
    created_at: u.created_at,
    updated_at: u.updated_at
  }))
  res.status(200).json({ code: 200, data: users })
})

export default router

