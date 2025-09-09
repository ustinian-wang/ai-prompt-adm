#!/bin/bash

echo "🚀 开始初始化会员表..."

# 进入脚本目录
cd "$(dirname "$0")"

# 执行初始化脚本
node init-member-tables.js

echo "✅ 会员表初始化完成！"
