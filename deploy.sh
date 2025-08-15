#!/bin/bash

# 部署脚本 - 部署到GitHub Pages

echo "🚀 开始部署到GitHub Pages..."

# 构建项目
echo "📦 构建项目..."
yarn build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，退出部署"
    exit 1
fi

echo "✅ 构建成功"

# 检查是否在git仓库中
if [ ! -d ".git" ]; then
    echo "❌ 当前目录不是git仓库，请先初始化git"
    exit 1
fi

# 获取当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 当前分支: $CURRENT_BRANCH"

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  检测到未提交的更改，请先提交或暂存更改"
    git status --short
    exit 1
fi

# 推送到远程仓库
echo "📤 推送到远程仓库..."
git add .
git commit -m "🚀 自动部署: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    echo "✅ 推送成功！"
    echo "🌐 GitHub Actions将自动构建并部署到GitHub Pages"
    echo "📋 请检查Actions标签页查看部署状态"
else
    echo "❌ 推送失败"
    exit 1
fi

echo "🎉 部署脚本执行完成！"
