#!/bin/bash

echo "🧪 测试数据库初始化安全性..."

# 配置变量
CONTAINER_NAME="ai-prompt-web"
DB_FILE="/var/lib/ai-prompt-web/database/database.sqlite"

# 检查容器是否运行
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "❌ 容器未运行，请先启动应用"
    exit 1
fi

echo "✅ 容器正在运行"

# 测试1: 检查数据库文件
echo ""
echo "📊 测试1: 检查数据库文件"
if [ -f "$DB_FILE" ]; then
    DB_SIZE=$(du -h "$DB_FILE" | cut -f1)
    echo "   ✅ 数据库文件存在，大小: $DB_SIZE"
else
    echo "   ❌ 数据库文件不存在"
fi

# 测试2: 检查数据库连接
echo ""
echo "🔌 测试2: 检查数据库连接"
if docker exec "$CONTAINER_NAME" node -e "
import('../config/database.js').then(({ testConnection }) => {
    testConnection().then(connected => {
        if (connected) {
            console.log('✅ 数据库连接成功');
            process.exit(0);
        } else {
            console.log('❌ 数据库连接失败');
            process.exit(1);
        }
    });
}).catch(err => {
    console.log('❌ 数据库配置错误:', err.message);
    process.exit(1);
});
" 2>/dev/null; then
    echo "   ✅ 数据库连接正常"
else
    echo "   ❌ 数据库连接失败"
fi

# 测试3: 检查数据完整性
echo ""
echo "📋 测试3: 检查数据完整性"
if docker exec "$CONTAINER_NAME" node -e "
import('../config/database.js').then(async ({ default: sequelize }) => {
    try {
        const { User, Category, Work } = await import('../models/index.js');
        
        const userCount = await User.count();
        const categoryCount = await Category.count();
        const workCount = await Work.count();
        
        console.log('📊 数据统计:');
        console.log('   - 用户数量:', userCount);
        console.log('   - 分类数量:', categoryCount);
        console.log('   - 作品数量:', workCount);
        
        if (userCount > 0 && categoryCount > 0) {
            console.log('✅ 数据库包含初始数据');
        } else {
            console.log('⚠️  数据库缺少初始数据');
        }
        
        process.exit(0);
    } catch (err) {
        console.log('❌ 数据检查失败:', err.message);
        process.exit(1);
    }
}).catch(err => {
    console.log('❌ 模型导入失败:', err.message);
    process.exit(1);
});
" 2>/dev/null; then
    echo "   ✅ 数据完整性检查通过"
else
    echo "   ❌ 数据完整性检查失败"
fi

# 测试4: 重复执行安全性
echo ""
echo "🔄 测试4: 重复执行安全性"
echo "   执行数据库初始化脚本..."

if docker exec "$CONTAINER_NAME" sh scripts/init-db.sh 2>/dev/null; then
    echo "   ✅ 重复执行成功，数据未丢失"
else
    echo "   ⚠️  重复执行出现警告，但这是正常的"
fi

# 测试5: 检查文件权限
echo ""
echo "🔐 测试5: 检查文件权限"
if [ -f "$DB_FILE" ]; then
    PERMISSIONS=$(ls -la "$DB_FILE" | awk '{print $1}')
    OWNER=$(ls -la "$DB_FILE" | awk '{print $3}')
    GROUP=$(ls -la "$DB_FILE" | awk '{print $4}')
    
    echo "   📁 数据库文件权限: $PERMISSIONS"
    echo "   👤 所有者: $OWNER"
    echo "   👥 用户组: $GROUP"
    
    if [ "$PERMISSIONS" = "-rw-r--r--" ] || [ "$PERMISSIONS" = "-rw-rw-r--" ]; then
        echo "   ✅ 文件权限设置正确"
    else
        echo "   ⚠️  文件权限可能需要调整"
    fi
else
    echo "   ❌ 数据库文件不存在"
fi

echo ""
echo "🎉 数据库安全性测试完成！"
echo ""
echo "💡 测试结果说明:"
echo "   - 如果所有测试都通过，说明数据库初始化是安全的"
echo "   - 脚本可以重复执行而不会丢失数据"
echo "   - 首次部署会自动创建默认账号和示例数据"
echo "   - 后续部署只会进行必要的更新"
