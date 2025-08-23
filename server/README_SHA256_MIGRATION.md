# SHA256 密码加密迁移指南

## 概述
本项目已从 bcrypt 密码加密迁移到纯 SHA256 加密方式。

## 🔐 SHA256 加密特点

### 优势
- ✅ **确定性**: 相同输入产生相同输出
- ✅ **高性能**: 计算速度快，适合大量数据处理
- ✅ **标准化**: 广泛使用的哈希算法
- ✅ **简单性**: 实现简单，无需管理盐值
- ✅ **兼容性**: 与现有系统兼容性好

### 注意事项
- ⚠️ **安全性较低**: 容易被彩虹表攻击
- ⚠️ **确定性**: 相同密码会产生相同哈希
- ⚠️ **抗暴力破解**: 不如 bcrypt 抗暴力破解
- ⚠️ **不适合高安全环境**: 生产环境建议使用更强加密

## 🚀 使用方法

### 1. 测试 SHA256 功能
```bash
cd server
npm run test:sha256
```

### 2. 迁移现有用户密码
```bash
cd server
npm run db:migrate-sha256
```

### 3. 重新初始化数据库表
```bash
cd server
npm run db:init-tables
```

## 📊 数据库表结构变化

### 用户表结构（简化版）
```sql
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `user_phone` varchar(20) DEFAULT NULL COMMENT '手机号码',
  `user_avatar` varchar(255) DEFAULT 'https://via.placeholder.com/32x32/1890ff/ffffff?text=U',
  `user_role` enum('admin','sales','manager') DEFAULT 'sales',
  `user_status` enum('active','inactive') DEFAULT 'active',
  `user_created_at` bigint NOT NULL DEFAULT 0,
  `user_updated_at` bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 🔧 API 使用方法

### 密码加密
```javascript
import { hashPassword } from '../utils/sha256.js';

// 加密密码
const hashedPassword = hashPassword('userPassword123');

// 存储到数据库
user.user_password = hashedPassword;
```

### 密码验证
```javascript
import { verifyPassword } from '../utils/sha256.js';

// 验证密码
const isValid = verifyPassword(inputPassword, user.user_password);
```

### 兼容性接口（保持向后兼容）
```javascript
import { hashPasswordWithSalt, verifyPasswordWithSalt } from '../utils/sha256.js';

// 这些函数仍然可用，但内部不再使用盐值
const { hashedPassword, salt } = hashPasswordWithSalt('password123');
const isValid = verifyPasswordWithSalt('password123', hashedPassword, salt);
```

## 📝 迁移注意事项

### 1. bcrypt 用户迁移
- 从 bcrypt 迁移的用户密码会被重置为临时密码
- 用户需要使用"忘记密码"功能重新设置
- 或管理员手动设置新密码

### 2. 数据备份
迁移前请务必备份数据库：
```bash
mysqldump -h 42.193.243.30 -u root -p ai_prompt_admin > backup_before_sha256.sql
```

### 3. 测试验证
迁移完成后，请测试：
- 用户登录功能
- 密码修改功能
- 新用户注册功能

## 🛡️ 安全建议

### 1. 开发/测试环境
- 纯 SHA256 适合开发测试
- 简单快速，便于调试
- 无需管理复杂的盐值

### 2. 生产环境
- ⚠️ **强烈建议升级到更强加密**
- 考虑使用 bcrypt、Argon2 或 PBKDF2
- 实现密码复杂度要求
- 定期强制密码更换

### 3. 密码策略
- 强制用户使用强密码
- 定期要求用户更换密码
- 实现密码历史检查
- 监控异常登录行为

## 🔄 升级到更强加密

### 1. 安装 bcrypt
```bash
npm install bcryptjs
```

### 2. 修改 User 模型
```javascript

// 在 hooks 中
beforeCreate: async (user) => {
  if (user.user_password) {
    user.user_password = await bcrypt.hash(user.user_password, 12);
  }
  // ... 其他逻辑
}
```

### 3. 更新验证方法
```javascript
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.user_password);
}
```

## 📚 相关文件

- `server/utils/sha256.js` - SHA256 加密工具（简化版）
- `server/models/User.model.js` - 用户模型（已更新）
- `server/scripts/migrate-to-sha256.js` - 迁移脚本
- `server/scripts/test-sha256.js` - 测试脚本
- `server/scripts/init-tables.js` - 表初始化脚本

## 🎯 总结

纯 SHA256 加密提供了：
- 更好的性能
- 确定性输出
- 简单的实现
- 良好的兼容性

**但安全性较低**，适合：
- 开发测试环境
- 内部系统
- 对安全性要求不高的场景

**不适合**：
- 高安全要求的系统
- 面向公网的应用
- 存储敏感信息的系统

建议在条件允许时升级到 bcrypt 或 Argon2 等更强加密方式。
