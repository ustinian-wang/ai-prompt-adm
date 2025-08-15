# CORS配置说明

## 问题描述
前端发送请求时出现两次请求：一次OPTIONS（预检请求），一次GET（实际请求）。

## 原因分析
这是因为浏览器发送了**预检请求**（Preflight Request），当请求满足以下条件时会触发：
- 使用了非简单请求方法（PUT、DELETE、PATCH等）
- 设置了自定义请求头（如Authorization、Content-Type等）
- 请求体不是简单格式

## 解决方案

### 1. 后端CORS配置
已在 `server/app.js` 中配置了完整的CORS支持：

```javascript
const corsConfig = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  maxAge: 86400 // 预检请求缓存24小时
}
```

### 2. 预检请求处理
添加了专门的OPTIONS请求处理中间件：

```javascript
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
```

### 3. 配置文件支持
在 `project.config.json` 中可以自定义CORS配置：

```json
{
  "cors": {
    "origin": ["http://localhost:3000", "http://127.0.0.1:3000"],
    "credentials": true,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    "allowedHeaders": [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    "maxAge": 86400
  }
}
```

## 使用方法

### 启动后端服务
```bash
# Windows
start-backend.bat

# 或者手动启动
cd server
npm install
npm start
```

### 启动前端服务
```bash
npm run dev
```

## 验证配置

### 1. 检查后端日志
启动后端后，应该看到类似输出：
```
🚀 服务器运行在 http://localhost:8080
🌍 环境: development
🔒 CORS配置: { origin: [...], methods: [...], ... }
```

### 2. 测试健康检查接口
```bash
curl http://localhost:8080/health
```

### 3. 检查网络请求
在浏览器开发者工具中：
- 第一次请求：OPTIONS（预检请求）
- 第二次请求：GET（实际请求）
- 两次请求都应该返回200状态码

## 注意事项

1. **预检请求缓存**：设置了24小时缓存，减少重复预检
2. **动态端口支持**：自动读取前端端口配置
3. **安全配置**：使用helmet中间件增强安全性
4. **限流保护**：API接口有请求频率限制

## 故障排除

### 如果仍有CORS错误：
1. 检查后端是否正常启动
2. 确认端口配置正确
3. 检查浏览器控制台错误信息
4. 验证CORS配置是否生效

### 常见错误：
- `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- `Request header field Authorization is not allowed by Access-Control-Allow-Headers`

这些错误通常表示CORS配置不正确或后端服务未启动。
