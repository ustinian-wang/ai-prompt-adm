#!/bin/sh
echo "🚀 启动应用..."
node app.js &
echo "🗄️ 初始化数据库..."
sh scripts/init-db.sh
echo "✅ 启动完成，保持容器运行..."