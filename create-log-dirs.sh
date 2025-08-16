#!/bin/bash

# 创建日志目录结构脚本

echo "📁 创建日志和持久化目录..."

# 创建主日志目录
mkdir -p logs

# 创建后端相关目录
mkdir -p logs/backend
mkdir -p logs/pm2
mkdir -p logs/nginx
mkdir -p logs/mysql

# 创建数据目录
mkdir -p server/data
mkdir -p server/uploads

# 设置权限
chmod 755 logs
chmod 755 server/data
chmod 755 server/uploads

echo "✅ 目录创建完成！"
echo "📋 目录结构："
echo "  logs/"
echo "  ├── backend/     # 后端应用日志"
echo "  ├── pm2/         # PM2进程管理日志"
echo "  ├── nginx/       # Nginx访问日志"
echo "  └── mysql/       # MySQL数据库日志"
echo "  server/"
echo "  ├── data/        # 数据文件"
echo "  └── uploads/     # 上传文件"
