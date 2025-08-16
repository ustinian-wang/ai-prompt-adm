@echo off
chcp 65001 >nul

echo 📁 创建日志和持久化目录...

REM 创建主日志目录
if not exist "logs" mkdir logs

REM 创建后端相关目录
if not exist "logs\backend" mkdir logs\backend
if not exist "logs\pm2" mkdir logs\pm2
if not exist "logs\nginx" mkdir logs\nginx
if not exist "logs\mysql" mkdir logs\mysql

REM 创建数据目录
if not exist "server\data" mkdir server\data
if not exist "server\uploads" mkdir server\uploads

echo ✅ 目录创建完成！
echo 📋 目录结构：
echo   logs/
echo   ├── backend/     # 后端应用日志
echo   ├── pm2/         # PM2进程管理日志
echo   ├── nginx/       # Nginx访问日志
echo   └── mysql/       # MySQL数据库日志
echo   server/
echo   ├── data/        # 数据文件
echo   └── uploads/     # 上传文件

pause
