#!/bin/bash

# 作品分类关联表初始化脚本
# 用于创建数据库表和插入初始数据

echo "🚀 开始初始化作品分类关联表..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在server目录下运行此脚本"
    exit 1
fi

# 创建数据库表
echo "📋 创建作品分类关联表..."
node scripts/create-work-category-table.js create

if [ $? -eq 0 ]; then
    echo "✅ 数据库表创建成功"
else
    echo "❌ 数据库表创建失败"
    exit 1
fi

# 插入测试数据
echo "📝 插入测试数据..."
node scripts/create-work-category-table.js test

if [ $? -eq 0 ]; then
    echo "✅ 测试数据插入成功"
else
    echo "⚠️  测试数据插入失败，但表已创建"
fi

echo "🎉 作品分类关联表初始化完成！"
echo ""
echo "📚 可用的接口:"
echo "  作品分类管理:"
echo "    GET/POST /works/setWorkCategories     - 为作品设置分类"
echo "    GET/POST /works/getWorkCategories     - 获取作品的所有分类"
echo "    GET/POST /works/hasWorkCategory       - 检查作品是否包含某个分类"
echo "    GET/POST /works/batchSetWorkCategories - 批量设置作品分类"
echo ""
echo "  分类作品管理:"
echo "    GET/POST /categories/getCategoryWorks - 获取分类下的作品"
echo "    GET/POST /categories/getCategoryStats - 获取分类统计信息"
echo ""
echo "🔧 管理命令:"
echo "  node scripts/create-work-category-table.js create  # 创建表"
echo "  node scripts/create-work-category-table.js drop    # 删除表"
echo "  node scripts/create-work-category-table.js test    # 创建表并插入测试数据"
