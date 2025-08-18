#!/bin/bash

echo "🚀 启动后端服务..."

# 1. 停止并删除旧容器
docker stop ai-prompt-web 2>/dev/null || true
docker rm ai-prompt-web 2>/dev/null || true

# 2. 删除旧镜像
docker rmi ai-prompt-web:latest 2>/dev/null || true

# 3. 重新构建
echo "🔨 构建Docker镜像..."
docker build -f Dockerfile.web -t ai-prompt-web:latest server

# 4. 创建Linux标准系统目录（如果不存在）
echo "📁 创建系统目录..."
sudo mkdir -p /var/lib/ai-prompt-web
sudo mkdir -p /var/log/ai-prompt-web
sudo mkdir -p /etc/ai-prompt-web

# 5. 创建子目录结构
echo "📁 创建子目录结构..."
sudo mkdir -p /var/lib/ai-prompt-web/database
sudo mkdir -p /var/lib/ai-prompt-web/cache
sudo mkdir -p /var/lib/ai-prompt-web/uploads/images
sudo mkdir -p /var/lib/ai-prompt-web/uploads/thumbnails
sudo mkdir -p /var/lib/ai-prompt-web/uploads/documents
sudo mkdir -p /var/lib/ai-prompt-web/uploads/temp

# 6. 设置目录权限
echo "🔐 设置目录权限..."
sudo chown -R $USER:$USER /var/lib/ai-prompt-web
sudo chown -R $USER:$USER /var/log/ai-prompt-web
sudo chown -R $USER:$USER /etc/ai-prompt-web

sudo chmod 755 /var/lib/ai-prompt-web
sudo chmod 755 /var/log/ai-prompt-web
sudo chmod 755 /etc/ai-prompt-web

# 7. 检查现有数据库
DB_FILE="/var/lib/ai-prompt-web/database/database.sqlite"
if [ -f "$DB_FILE" ]; then
    echo "📊 检测到现有数据库文件: $DB_FILE"
    DB_SIZE=$(du -h "$DB_FILE" | cut -f1)
    echo "   数据库大小: $DB_SIZE"
    echo "   将保留现有数据，只进行必要的更新"
else
    echo "🆕 未检测到现有数据库，将创建新的数据库"
fi

# 8. 运行新容器，添加卷映射
echo "🐳 启动容器..."
docker run -d \
  --name ai-prompt-web \
  -p 4002:4002 \
  -v /var/lib/ai-prompt-web:/app/data \
  -v /var/log/ai-prompt-web:/app/data/logs \
  -v /etc/ai-prompt-web:/app/etc \
  ai-prompt-web:latest

# 9. 等待容器启动
echo "⏳ 等待容器启动..."
sleep 15

# 10. 初始化SQLite数据库
echo "🗄️ 初始化SQLite数据库..."
if docker ps | grep -q ai-prompt-web; then
    # 执行数据库初始化（智能模式）
    echo "📊 执行数据库初始化..."
    docker exec ai-prompt-web sh scripts/init-db.sh
    
    if [ $? -eq 0 ]; then
        echo "✅ 数据库初始化完成！"
    else
        echo "⚠️ 数据库初始化过程中出现警告，但容器仍在运行"
    fi
else
    echo "❌ 容器未运行，无法初始化数据库"
fi

# 11. 检查容器状态
if docker ps | grep -q ai-prompt-web; then
    echo "✅ 后端服务启动成功！"
    echo "🌐 服务地址: http://localhost:4002"
    echo ""
    echo "📁 目录结构:"
    echo "   /var/lib/ai-prompt-web/     - 数据文件"
    echo "   /var/log/ai-prompt-web/     - 日志文件"
    echo "   /etc/ai-prompt-web/         - 配置文件"
    echo ""
    echo "🗄️ 数据库文件: $DB_FILE"
    
    # 显示数据库状态
    if [ -f "$DB_FILE" ]; then
        DB_SIZE=$(du -h "$DB_FILE" | cut -f1)
        echo "   数据库大小: $DB_SIZE"
    fi
    
    echo "🔐 权限已设置为当前用户: $USER"
    echo "🐳 容器名称: ai-prompt-web"
    echo ""
    echo "💡 脚本可以重复执行，不会丢失现有数据"
    echo "🔑 如果是首次部署，默认管理员账号: admin / 123456"
else
    echo "❌ 容器启动失败，请检查日志:"
    docker logs ai-prompt-web
fi
