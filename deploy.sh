#!/bin/bash

echo "🚀 开始部署AI提示词管理系统..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 创建必要的目录
echo "📁 创建日志和持久化目录..."
chmod +x create-log-dirs.sh
./create-log-dirs.sh

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker system prune -f

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up --build -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 15

# 检查服务状态
echo "📊 检查服务状态..."
docker-compose ps

# 检查端口是否正常监听
echo "🔍 检查端口状态..."
if netstat -tuln | grep -q ":4001 "; then
    echo "✅ 前端服务已启动在端口4001"
else
    echo "❌ 前端服务启动失败"
fi

if netstat -tuln | grep -q ":4002 "; then
    echo "✅ 后端服务已启动在端口4002"
else
    echo "❌ 后端服务启动失败"
fi

# 检查PM2进程状态
echo "🔍 检查PM2进程状态..."
docker exec ai-prompt-backend pm2 status

# 显示日志文件位置
echo "📋 日志文件位置："
echo "  后端日志: ./logs/backend/"
echo "  PM2日志: ./logs/pm2/"
echo "  Nginx日志: ./logs/nginx/"
echo "  MySQL日志: ./logs/mysql/"
echo "  上传文件: ./server/uploads/"
echo "  数据文件: ./server/data/"

echo "🎉 部署完成！"
echo "📱 前端访问地址: http://localhost:4001"
echo "🔧 后端API地址: http://localhost:4002"
echo "🗄️  数据库端口: 3306"
echo "📊 PM2监控: docker exec ai-prompt-backend pm2 monit"
