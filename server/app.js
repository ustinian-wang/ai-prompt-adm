import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import authRouter from './routes/auth.router.js'
import userRouter from './routes/user.router.js'
import rolesRouter from './routes/roles.js'
import worksRouter from './routes/works.router.js'
import categoriesRouter from './routes/categories.js'
import uploadRouter from './routes/upload.router.js'
import ossFileRouter from './routes/ossFile.router.js'
import databaseRouter from './routes/database.router.js'
import memberRouter from './routes/member.router.js'
import memGroupRouter from './routes/memGroup.router.js'
import workGroupRouter from './routes/workGroup.router.js'
import cookieParser from 'cookie-parser';

// 导入数据库配置和模型
import sequelize, { testConnection, syncDatabase } from './config/database.js'
import { User, Work, Category, WorkCategory, WorkGroup, MemGroup } from './models/index.js'

dotenv.config()

// 初始化必要的目录结构
const initDirectories = () => {
  const dirs = [
    'data/database',
    'data/cache', 
    'data/logs',
    'uploads/images',
    'uploads/thumbnails',
    'uploads/documents',
    'uploads/temp'
  ]
  
  dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir)
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true })
      console.log(`📁 创建目录: ${dir}`)
    }
  })
}

// 启动时初始化目录
initDirectories()

// 从项目根读取 project.config.json
const projectConfigPath = path.resolve(process.cwd(), 'project.config.json')
let backendPort = process.env.PORT || 4002  // 默认端口改为4002
let corsConfig = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  maxAge: 86400 // 预检请求缓存24小时
}

try {
  if (fs.existsSync(projectConfigPath)) {
    const raw = fs.readFileSync(projectConfigPath, 'utf-8')
    const conf = JSON.parse(raw)
    if (conf.backendPort) backendPort = conf.backendPort
  }
  // console.log('Backend config:', JSON.stringify({ backendPort, corsConfig }, null, 2))
} catch (e) {
  console.log('project.config.json not found or parse error:', e.message)
}

const app = express()
const PORT = backendPort

// 中间件
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

app.use(cookieParser());

// CORS配置，动态允许所有来源和常用自定义头部
app.use(cors({
  origin: function(origin, callback) {
    // 允许所有来源（如需限制可加白名单判断）
    callback(null, true);
  },
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Token',
    'X-Request-Id',
    'Accept',
    'Origin',
    'Referer',
    'User-Agent',
    // 你可以继续添加需要的自定义头部
  ]
}));

// 预检请求处理中间件
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.header('Access-Control-Allow-Methods', corsConfig.methods.join(', '))
    res.header('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '))
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Max-Age', corsConfig.maxAge)
    res.status(200).end()
    return
  }
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 限流中间件
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15分钟
//   max: 100, // 限制每个IP 15分钟内最多100个请求
//   message: '请求过于频繁，请稍后再试'
// })
// app.use('/api/', limiter)

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    code: 200,
    message: 'Backend service is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// 路由
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/roles', rolesRouter)
app.use('/api/works', worksRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/ossFile', ossFileRouter)
app.use('/api/database', databaseRouter)
app.use('/api/member', memberRouter)
app.use('/api/member/mem_group', memGroupRouter)
app.use('/api/member/work_group', workGroupRouter)

// 透出文件访问域名配置日志（便于排查）
if (process.env.ASSET_BASE_URL) {
  console.log('ASSET_BASE_URL =', process.env.ASSET_BASE_URL)
}

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在'
  })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)

  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误'
  })
})

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    console.log('🔌 测试数据库连接...')
    const connected = await testConnection()
    if (!connected) {
      console.error('❌ 数据库连接失败，服务器无法启动')
      process.exit(1)
    }
    
    // 同步数据库（创建表）
    console.log('🔄 同步数据库...')
    await syncDatabase(false)
    
    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🔒 CORS配置:`, corsConfig)
      console.log(`💾 数据库: MySQL`)
    })
    
  } catch (error) {
    console.error('❌ 服务器启动失败:', error)
    process.exit(1)
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n🛑 正在关闭服务器...')
  try {
    await sequelize.close()
    console.log('✅ 数据库连接已关闭')
    process.exit(0)
  } catch (error) {
    console.error('❌ 关闭数据库连接失败:', error)
    process.exit(1)
  }
})

startServer()

export default app
