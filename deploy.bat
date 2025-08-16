@echo off
chcp 65001 >nul
echo 🚀 开始部署AI提示词管理系统...

REM 检查Docker是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker未安装，请先安装Docker
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose未安装，请先安装Docker Compose
    pause
    exit /b 1
)

REM 创建必要的目录
echo 📁 创建日志和持久化目录...
call create-log-dirs.bat

REM 停止现有容器
echo 🛑 停止现有容器...
docker-compose down

REM 清理旧镜像
echo 🧹 清理旧镜像...
docker system prune -f

REM 构建并启动服务
echo 🔨 构建并启动服务...
docker-compose up --build -d

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 15 /nobreak >nul

REM 检查服务状态
echo 📊 检查服务状态...
docker-compose ps

REM 检查PM2进程状态
echo 🔍 检查PM2进程状态...
docker exec ai-prompt-backend pm2 status

REM 显示日志文件位置
echo 📋 日志文件位置：
echo   后端日志: ./logs/backend/
echo   PM2日志: ./logs/pm2/
echo   Nginx日志: ./logs/nginx/
echo   MySQL日志: ./logs/mysql/
echo   上传文件: ./server/uploads/
echo   数据文件: ./server/data/

echo 🎉 部署完成！
echo 📱 前端访问地址: http://localhost:4001
echo 🔧 后端API地址: http://localhost:4002
echo 🗄️  数据库端口: 3306
echo 📊 PM2监控: docker exec ai-prompt-backend pm2 monit

pause
