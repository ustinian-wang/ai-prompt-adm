#!/bin/bash

# 构建和部署脚本
echo "=== 开始构建和部署 ==="

# 检查依赖
echo "检查依赖..."
if ! command -v yarn &> /dev/null; then
    echo "错误: 未找到 yarn，请先安装"
    exit 1
fi

# 安装依赖
echo "安装依赖..."
yarn install --frozen-lockfile

# 构建项目
echo "构建项目..."
yarn build

# 验证构建产物
echo "验证构建产物..."
if [ ! -f "dist/index.html" ]; then
    echo "错误: 主应用 index.html 未找到"
    exit 1
fi

if [ ! -f "dist/client.html" ]; then
    echo "错误: client 应用 client.html 未找到"
    exit 1
fi

echo "=== 构建产物验证成功 ==="
echo "主应用: dist/index.html"
echo "客户端应用: dist/client.html"
echo "静态资源: dist/assets/"

# 显示构建产物大小
echo "=== 构建产物大小 ==="
du -sh dist/
du -sh dist/assets/

echo "=== 构建完成 ==="
echo "现在可以运行 Docker 构建:"
echo "docker build -f Dockerfile.res -t ai-prompt-admin ."



