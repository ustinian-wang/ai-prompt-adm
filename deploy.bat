@echo off
chcp 65001 >nul
echo 🚀 开始部署到GitHub Pages...

echo 📦 构建项目...
call yarn build

if %errorlevel% neq 0 (
    echo ❌ 构建失败，退出部署
    pause
    exit /b 1
)

echo ✅ 构建成功

REM 检查是否在git仓库中
if not exist ".git" (
    echo ❌ 当前目录不是git仓库，请先初始化git
    pause
    exit /b 1
)

REM 获取当前分支
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo 📍 当前分支: %CURRENT_BRANCH%

REM 检查是否有未提交的更改
git status --porcelain > temp_status.txt
set /p STATUS_CHECK=<temp_status.txt
del temp_status.txt

if not "%STATUS_CHECK%"=="" (
    echo ⚠️  检测到未提交的更改，请先提交或暂存更改
    git status --short
    pause
    exit /b 1
)

echo 📤 推送到远程仓库...
git add .
git commit -m "🚀 自动部署: %date% %time%"
git push origin %CURRENT_BRANCH%

if %errorlevel% equ 0 (
    echo ✅ 推送成功！
    echo 🌐 GitHub Actions将自动构建并部署到GitHub Pages
    echo 📋 请检查Actions标签页查看部署状态
) else (
    echo ❌ 推送失败
    pause
    exit /b 1
)

echo 🎉 部署脚本执行完成！
pause
