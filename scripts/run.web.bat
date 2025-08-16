@echo off
echo 🚀 启动后端服务...

REM 1. 停止并删除旧容器
docker stop ai-prompt-web
docker rm ai-prompt-web

REM 2. 删除旧镜像
docker rmi ai-prompt-web:latest

REM 3. 重新构建
docker build -f Dockerfile.web -t ai-prompt-web:latest .

REM 4. 创建宿主机数据目录（如果不存在）
if not exist ".\server-data" mkdir ".\server-data"
if not exist ".\server-data\data" mkdir ".\server-data\data"
if not exist ".\server-data\uploads" mkdir ".\server-data\uploads"

REM 5. 运行新容器，添加卷映射
docker run -d ^
  --name ai-prompt-web ^
  -p 4002:4002 ^
  -v %cd%\server-data\data:/app/data ^
  -v %cd%\server-data\uploads:/app/uploads ^
  ai-prompt-web:latest

echo ✅ 后端服务已启动，端口: 4002
echo 📁 数据目录映射: .\server-data\data -> /app/data
echo 📁 上传目录映射: .\server-data\uploads -> /app/uploads

pause
