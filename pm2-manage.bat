@echo off
chcp 65001 >nul

set CONTAINER_NAME=ai-prompt-backend

if "%1"=="" goto show_help
if "%1"=="help" goto show_help

REM 检查容器是否运行
docker ps | findstr "%CONTAINER_NAME%" >nul
if %errorlevel% neq 0 (
    echo ❌ 容器 %CONTAINER_NAME% 未运行
    pause
    exit /b 1
)

if "%1"=="status" goto status
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="reload" goto reload
if "%1"=="delete" goto delete
if "%1"=="logs" goto logs
if "%1"=="monit" goto monit
if "%1"=="info" goto info
goto show_help

:status
echo 📊 查看PM2进程状态...
docker exec %CONTAINER_NAME% pm2 status
goto end

:start
echo 🚀 启动PM2进程...
docker exec %CONTAINER_NAME% pm2 start ecosystem.config.js
goto end

:stop
echo 🛑 停止PM2进程...
docker exec %CONTAINER_NAME% pm2 stop all
goto end

:restart
echo 🔄 重启PM2进程...
docker exec %CONTAINER_NAME% pm2 restart all
goto end

:reload
echo 🔄 重载PM2进程...
docker exec %CONTAINER_NAME% pm2 reload all
goto end

:delete
echo 🗑️  删除PM2进程...
docker exec %CONTAINER_NAME% pm2 delete all
goto end

:logs
echo 📋 查看PM2日志...
docker exec %CONTAINER_NAME% pm2 logs
goto end

:monit
echo 📊 打开PM2监控面板...
docker exec -it %CONTAINER_NAME% pm2 monit
goto end

:info
echo ℹ️  查看进程详细信息...
docker exec %CONTAINER_NAME% pm2 show 0
goto end

:show_help
echo 🔧 PM2进程管理脚本
echo.
echo 用法: %0 [命令]
echo.
echo 命令:
echo   status      查看进程状态
echo   start       启动进程
echo   stop        停止进程
echo   restart     重启进程
echo   reload      重载进程
echo   delete      删除进程
echo   logs        查看日志
echo   monit       监控面板
echo   info        进程信息
echo   help        显示帮助
echo.

:end
pause
