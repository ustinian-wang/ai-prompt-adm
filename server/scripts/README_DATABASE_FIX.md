# 数据库修复说明

## 问题描述

应用启动时出现以下错误：
```
SQLITE_ERROR: no such table: user
```

这表明数据库表没有被正确创建。

## 解决方案

### 方法1：使用修复脚本（推荐）

运行数据库修复脚本：

```bash
cd server
node scripts/fix-database.js
```

这个脚本会：
1. 强制重建所有数据库表
2. 插入初始数据（分类、管理员用户、示例作品）
3. 验证表创建状态

### 方法2：手动初始化

1. 测试数据库连接：
```bash
node scripts/test-db.js
```

2. 初始化数据库：
```bash
node scripts/init-database.js
```

3. 插入种子数据：
```bash
node scripts/seed.js
```

## 默认登录信息

修复完成后，可以使用以下信息登录：
- 用户名：admin
- 密码：123456

## 常见问题

### Q: 为什么表没有被创建？
A: 可能的原因：
- 模型没有正确导入到Sequelize
- 数据库同步函数执行失败
- 数据库文件权限问题

### Q: 如何检查数据库状态？
A: 运行测试脚本：
```bash
node scripts/test-db.js
```

### Q: 如何重置数据库？
A: 删除数据库文件并重新运行修复脚本：
```bash
rm server/data/database.sqlite
node scripts/fix-database.js
```

## 文件说明

- `fix-database.js` - 完整的数据库修复脚本
- `test-db.js` - 数据库连接和表状态测试脚本
- `init-database.js` - 数据库初始化脚本
- `seed.js` - 种子数据插入脚本

## 注意事项

1. 修复脚本会强制重建所有表，现有数据会丢失
2. 确保应用没有在运行状态
3. 确保有足够的磁盘空间
4. 建议在修复前备份重要数据
