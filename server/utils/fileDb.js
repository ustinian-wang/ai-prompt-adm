import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = path.join(__dirname, '..', 'data')
const usersFile = path.join(dataDir, 'users.json')

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function readJSON(filePath) {
  ensureDataDir()
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  try {
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function writeJSON(filePath, data) {
  ensureDataDir()
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

function initDefaultUsers() {
  ensureDataDir()
  let users = readJSON(usersFile)
  if (!users || !Array.isArray(users)) {
    users = []
  }
  const hasAdmin = users.some(u => u.username === 'admin')
  if (!hasAdmin) {
    const hashed = bcrypt.hashSync('123456', 10)
    users.push({
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: hashed,
      role: 'admin',
      status: 'active',
      avatar: 'https://via.placeholder.com/32x32/1890ff/ffffff?text=A',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    writeJSON(usersFile, users)
  }
}

function getUsers() {
  initDefaultUsers()
  return readJSON(usersFile) || []
}

function saveUsers(users) {
  writeJSON(usersFile, users)
}

function addUser(user) {
  const users = getUsers()
  const exists = users.some(u => u.username === user.username)
  if (exists) throw new Error('用户名已存在')
  const id = users.length ? Math.max(...users.map(u => u.id || 0)) + 1 : 1
  const now = new Date().toISOString()
  const record = { id, role: 'user', status: 'active', created_at: now, updated_at: now, ...user }
  users.push(record)
  saveUsers(users)
  return record
}

function findUserByUsername(username) {
  const users = getUsers()
  return users.find(u => u.username === username)
}

export {
  usersFile,
  getUsers,
  saveUsers,
  addUser,
  findUserByUsername,
  initDefaultUsers
}

