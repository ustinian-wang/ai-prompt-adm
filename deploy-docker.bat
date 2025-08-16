@echo off
echo === Docker部署脚本 ===

REM 停止并删除现有容器
echo 1. 停止现有容器...
docker-compose down

REM 清理Docker镜像
echo 2. 清理现有镜像...
docker rmi ai-prompt-adm_res 2>nul || echo 镜像不存在，跳过清理

REM 清理Docker缓存
echo 3. 清理Docker缓存...
docker system prune -f

REM 重新构建前端镜像
echo 4. 重新构建前端镜像...
docker-compose build --no-cache res

REM 启动服务
echo 5. 启动服务...
docker-compose up -d

REM 等待服务启动
echo 6. 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo 7. 检查服务状态...
docker-compose ps

REM 检查前端容器日志
echo 8. 检查前端容器日志...
docker logs ai-prompt-res --tail 50

REM 检查nginx配置
echo 9. 检查nginx配置...
docker exec ai-prompt-res nginx -t

REM 检查静态文件
echo 10. 检查静态文件...
docker exec ai-prompt-res ls -la /usr/share/nginx/html/

echo === 部署完成 ===
echo 前端访问地址: http://localhost:4001
echo 健康检查: http://localhost:4001/health

pause
