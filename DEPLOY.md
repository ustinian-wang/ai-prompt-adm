# AI提示词管理系统 - Docker部署指南

## 🚀 快速部署

### 前置要求
- Docker 20.10+
- Docker Compose 2.0+
- 至少2GB可用内存

### 一键部署

#### Windows用户
```bash
# 双击运行
deploy.bat
```

#### Linux/Mac用户
```bash
# 添加执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

### 手动部署
```bash
# 1. 创建日志目录
./create-log-dirs.sh  # Linux/Mac
# 或
create-log-dirs.bat   # Windows

# 2. 停止现有服务
docker-compose down

# 3. 构建并启动
docker-compose up --build -d

# 4. 查看服务状态
docker-compose ps
```

## 📋 服务端口配置

| 服务 | 内部端口 | 外部端口 | 说明 |
|------|----------|----------|------|
| 前端 | 80 | 4001 | Vue.js应用，通过Nginx提供服务 |
| 后端 | 4002 | 4002 | Express.js API服务 + PM2进程守护 |
| 数据库 | 3306 | 3306 | MySQL数据库 |

## 🌐 访问地址

- **前端应用**: http://localhost:4001
- **后端API**: http://localhost:4002
- **数据库**: localhost:3306

## 🔧 配置说明

### 环境变量
- `NODE_ENV`: 环境模式 (production/development)
- `PORT`: 后端服务端口 (默认4002)
- `DB_HOST`: 数据库主机
- `DB_USER`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `DB_NAME`: 数据库名称
- `JWT_SECRET`: JWT密钥

### 网络配置
- 前端通过Nginx反向代理访问后端API
- 所有服务在同一Docker网络中
- 支持跨域请求

### 进程守护 (PM2)
- 自动进程重启和故障恢复
- 内存监控和自动重启
- 集群模式支持
- 健康检查和优雅关闭

## 📁 目录结构

```
ai-prompt-adm/
├── Dockerfile.frontend          # 前端Docker配置
├── nginx.frontend.conf          # 前端Nginx配置
├── docker-compose.yml           # 服务编排配置
├── deploy.sh                    # Linux/Mac部署脚本
├── deploy.bat                   # Windows部署脚本
├── create-log-dirs.sh           # 日志目录创建脚本
├── create-log-dirs.bat          # Windows日志目录创建脚本
├── pm2-manage.sh                # PM2管理脚本
├── pm2-manage.bat               # Windows PM2管理脚本
├── server/
│   ├── Dockerfile               # 后端Docker配置
│   ├── ecosystem.config.js      # PM2配置文件
│   ├── uploads/                 # 上传文件目录
│   └── data/                    # 数据文件目录
├── logs/                        # 日志目录
│   ├── backend/                 # 后端应用日志
│   ├── pm2/                     # PM2进程管理日志
│   ├── nginx/                   # Nginx访问日志
│   └── mysql/                   # MySQL数据库日志
└── src/                         # 前端源码
```

## 🛠️ 常用命令

### Docker管理
```bash
# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f [service_name]

# 重启服务
docker-compose restart [service_name]

# 停止所有服务
docker-compose down

# 清理资源
docker system prune -f

# 进入容器
docker exec -it [container_name] /bin/sh
```

### PM2进程管理
```bash
# Linux/Mac
./pm2-manage.sh status      # 查看状态
./pm2-manage.sh restart     # 重启进程
./pm2-manage.sh logs        # 查看日志
./pm2-manage.sh monit       # 监控面板

# Windows
pm2-manage.bat status       # 查看状态
pm2-manage.bat restart      # 重启进程
pm2-manage.bat logs         # 查看日志
pm2-manage.bat monit        # 监控面板
```

### 日志查看
```bash
# 实时查看后端日志
tail -f logs/backend/combined.log

# 查看PM2日志
tail -f logs/pm2/combined.log

# 查看Nginx访问日志
tail -f logs/nginx/access.log

# 查看MySQL日志
tail -f logs/mysql/error.log
```

## 🔍 故障排除

### 端口被占用
```bash
# 查看端口占用
netstat -tuln | grep :4001
netstat -tuln | grep :4002

# 停止占用端口的进程
sudo lsof -ti:4001 | xargs kill -9
sudo lsof -ti:4002 | xargs kill -9
```

### 服务启动失败
```bash
# 查看详细日志
docker-compose logs [service_name]

# 重新构建
docker-compose build --no-cache [service_name]

# 检查PM2状态
docker exec ai-prompt-backend pm2 status
```

### 数据库连接失败
```bash
# 检查数据库状态
docker-compose logs mysql

# 重启数据库
docker-compose restart mysql
```

### PM2进程问题
```bash
# 查看PM2状态
./pm2-manage.sh status

# 重启PM2进程
./pm2-manage.sh restart

# 查看PM2日志
./pm2-manage.sh logs

# 删除并重新启动进程
./pm2-manage.sh delete
./pm2-manage.sh start
```

## 📝 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新部署
./deploy.sh  # Linux/Mac
# 或
deploy.bat   # Windows
```

## 🔐 安全建议

1. 修改默认数据库密码
2. 设置强JWT密钥
3. 配置防火墙规则
4. 定期更新Docker镜像
5. 启用HTTPS（生产环境）
6. 限制PM2进程权限
7. 配置日志轮转

## 📊 监控和维护

### 进程监控
- PM2内置监控面板
- 内存使用监控
- 自动重启机制
- 健康检查接口

### 日志管理
- 结构化日志输出
- 日志文件轮转
- 错误日志分类
- 访问日志记录

### 性能优化
- 集群模式支持
- 内存限制配置
- 优雅关闭处理
- 资源使用监控

## 📞 技术支持

如遇到问题，请检查：
1. Docker服务是否正常运行
2. 端口是否被占用
3. 系统资源是否充足
4. 网络配置是否正确
5. PM2进程状态
6. 日志文件权限
7. 磁盘空间是否充足
