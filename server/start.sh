#!/bin/sh
echo "🚀 启动应用..."
find / -maxdepth 3 ! -path "*/node_modules" ! -path "*/node_modules/*"
node app.js
echo "🗄️ 初始化数据库..."
sh scripts/init-db.sh
echo "✅ 启动完成，保持容器运行..."