import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import authRouter from './routes/auth.router.js'
import usersRouter from './routes/users.router.js'
import userRouter from './routes/user.js'
import rolesRouter from './routes/roles.js'
import worksRouter from './routes/works.router.js'
import categoriesRouter from './routes/categories.js'

dotenv.config()

// 从项目根读取 project.config.json
const projectConfigPath = path.resolve(process.cwd(), 'project.config.json')
let backendPort = process.env.PORT || 8080
let corsConfig = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
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
    
    // 读取CORS配置
    if (conf.cors) {
      corsConfig = { ...corsConfig, ...conf.cors }
    }
    
    // 读取前端端口配置
    if (conf.frontendPort) {
      const frontendUrl = `http://localhost:${conf.frontendPort}`
      if (!corsConfig.origin.includes(frontendUrl)) {
        corsConfig.origin.push(frontendUrl)
      }
    }
  }
  console.log('Backend config:', JSON.stringify({ backendPort, corsConfig }, null, 2))
} catch (e) {
  console.log('project.config.json not found or parse error:', e.message)
}

const app = express()
const PORT = backendPort

// 中间件
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// 配置CORS中间件
app.use(cors(corsConfig))

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
app.use('/api/users', usersRouter)
app.use('/api/user', userRouter)
app.use('/api/roles', rolesRouter)
app.use('/api/works', worksRouter)
app.use('/api/categories', categoriesRouter)

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
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔒 CORS配置:`, corsConfig)
})

export default app
