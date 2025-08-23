# MySQL数据库迁移指南

## 概述
本项目已从SQLite迁移到MySQL数据库，使用远程MySQL服务器 `42.193.243.30`。

## 数据库连接信息
- **主机**: 42.193.243.30
- **端口**: 3306
- **用户名**: root
- **密码**: fai@508
- **数据库名**: ai_prompt_admin

## 迁移步骤

### 1. 测试数据库连接
```bash
cd server
node scripts/test-mysql-connection.js
```

### 2. 创建数据库和表结构
如果数据库不存在，可以使用以下SQL脚本创建：
```bash
# 连接到MySQL服务器
mysql -h 42.193.243.30 -u root -p

# 输入密码: fai@508

# 执行创建脚本
source scripts/create-mysql-db.sql
```

### 3. 初始化数据库
```bash
cd server
node scripts/init-database.js
```

### 4. 启动应用
```bash
npm run dev
```

## 环境变量配置
可以通过环境变量覆盖默认配置：

```bash
export DB_HOST=42.193.243.30
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=fai@508
export DB_NAME=ai_prompt_admin
export NODE_ENV=development
```

## 注意事项

### 1. 字符集
- 数据库使用 `utf8mb4` 字符集
- 排序规则为 `utf8mb4_unicode_ci`
- 支持完整的Unicode字符，包括emoji

### 2. 连接池配置
- 最大连接数: 5
- 最小连接数: 0
- 获取连接超时: 30秒
- 连接空闲超时: 10秒

### 3. 时间戳
- 使用毫秒级时间戳存储
- 字段类型为 `bigint`
- 兼容JavaScript的 `Date.now()` 方法

## 故障排除

### 连接被拒绝
- 检查IP地址是否正确
- 确认MySQL服务是否运行
- 检查防火墙设置

### 认证失败
- 确认用户名和密码
- 检查用户权限

### 数据库不存在
- 先创建数据库
- 执行 `create-mysql-db.sql` 脚本

## 数据备份
建议定期备份MySQL数据库：
```bash
mysqldump -h 42.193.243.30 -u root -p ai_prompt_admin > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 回滚到SQLite
如果需要回滚到SQLite，修改 `server/config/database.js` 中的 `development` 配置：
```javascript
development: {
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/database.sqlite'),
  // ... 其他配置
}
```
