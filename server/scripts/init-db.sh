#!/bin/bash

echo "🗄️ 开始初始化SQLite数据库..."

# 等待应用启动
echo "⏳ 等待应用启动..."

# 检查应用是否运行
echo "🔍 检查应用状态..."
if curl -f http://localhost:4002/health >/dev/null 2>&1; then
    echo "✅ 应用已启动，开始数据库初始化..."
    
    # 执行数据库初始化
    echo "📊 执行数据库初始化..."
    node scripts/init-database.js
    
    if [ $? -eq 0 ]; then
        echo "✅ 数据库初始化完成"
        
        # 检查并导入种子数据
        echo "🌱 检查种子数据..."
        node scripts/seed.js
        
        if [ $? -eq 0 ]; then
            echo "✅ 种子数据检查完成"
        else
            echo "⚠️ 种子数据检查失败，但数据库已创建"
        fi
    else
        echo "❌ 数据库初始化失败"
        exit 1
    fi
    
    echo "🎉 数据库初始化完成！"
    
    # 显示数据库状态
    echo "📊 数据库状态:"
    if [ -f "/app/data/database.sqlite" ]; then
        DB_SIZE=$(du -h "/app/data/database.sqlite" | cut -f1)
        echo "   - 数据库文件: 存在 (大小: $DB_SIZE)"
    else
        echo "   - 数据库文件: 不存在"
    fi
    
else
    echo "❌ 应用未启动，无法初始化数据库"
    exit 1
fi
