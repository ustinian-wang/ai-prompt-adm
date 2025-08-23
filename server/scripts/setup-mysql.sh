#!/bin/bash

echo "🚀 MySQL数据库设置脚本"
echo "=========================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装，请先安装npm"
    exit 1
fi

echo "✅ 环境检查通过"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 测试MySQL连接
echo "🔌 测试MySQL数据库连接..."
node scripts/test-mysql-connection.js

if [ $? -eq 0 ]; then
    echo "✅ MySQL连接测试成功！"
    
    # 询问是否初始化数据库
    read -p "是否要初始化数据库表结构？(y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 初始化数据库..."
        node scripts/init-database.js
        
        if [ $? -eq 0 ]; then
            echo "✅ 数据库初始化完成！"
            echo "🎉 现在可以启动应用了："
            echo "   npm run dev"
        else
            echo "❌ 数据库初始化失败"
            exit 1
        fi
    fi
else
    echo "❌ MySQL连接测试失败，请检查配置"
    echo "💡 提示："
    echo "   1. 确认MySQL服务器是否运行"
    echo "   2. 检查IP地址和端口"
    echo "   3. 确认用户名和密码"
    echo "   4. 检查防火墙设置"
    exit 1
fi
