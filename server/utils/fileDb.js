import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 使用标准化的目录结构
const dataDir = path.join(__dirname, '..', 'data', 'database')
const usersFile = path.join(dataDir, 'users.json')
const worksFile = path.join(dataDir, 'works.json')
const categoriesFile = path.join(dataDir, 'categories.json')

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

// 初始化默认分类
function initDefaultCategories() {
  ensureDataDir()
  let categories = readJSON(categoriesFile)
  if (!categories || !Array.isArray(categories)) {
    categories = []
  }
  
  if (categories.length === 0) {
    const defaultCategories = [
      { id: 1, name: '技术文档', description: '技术相关的文档和教程', sort_order: 1 },
      { id: 2, name: '设计素材', description: 'UI/UX设计相关的素材', sort_order: 2 },
      { id: 3, name: '营销文案', description: '营销和推广相关的文案', sort_order: 3 }
    ]
    writeJSON(categoriesFile, defaultCategories)
  }
}

// 初始化默认作品
function initDefaultWorks() {
  ensureDataDir()
  let works = readJSON(worksFile)
  if (!works || !Array.isArray(works)) {
    works = []
  }
  
  if (works.length === 0) {
    const defaultWorks = [
      {
        id: 1,
        title: '示例作品',
        description: '这是一个示例作品',
        category_id: 1,
        content: '示例内容',
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    writeJSON(worksFile, defaultWorks)
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

// 作品数据操作
function getWorks() {
  ensureDataDir()
  return readJSON(worksFile) || []
}

function saveWorks(works) {
  writeJSON(worksFile, works)
}

function addWork(work) {
  const works = getWorks()
  const id = works.length ? Math.max(...works.map(w => w.id || 0)) + 1 : 1
  const now = new Date().toISOString()
  const record = { id, created_at: now, updated_at: now, ...work }
  works.push(record)
  saveWorks(works)
  return record
}

// 分类数据操作
function getCategories() {
  ensureDataDir()
  return readJSON(categoriesFile) || []
}

function saveCategories(categories) {
  writeJSON(categoriesFile, categories)
}

function addCategory(category) {
  const categories = getCategories()
  const id = categories.length ? Math.max(...categories.map(c => c.id || 0)) + 1 : 1
  const now = new Date().toISOString()
  const record = { id, created_at: now, updated_at: now, ...category }
  categories.push(record)
  saveCategories(categories)
  return record
}

export {
  usersFile,
  worksFile,
  categoriesFile,
  getUsers,
  saveUsers,
  addUser,
  findUserByUsername,
  initDefaultUsers,
  initDefaultCategories,
  initDefaultWorks,
  getWorks,
  saveWorks,
  addWork,
  getCategories,
  saveCategories,
  addCategory
}

