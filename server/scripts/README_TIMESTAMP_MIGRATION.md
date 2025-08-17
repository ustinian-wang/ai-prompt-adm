# 数据库时间字段迁移说明

## 概述

本项目已将数据库中的所有时间字段从Sequelize默认的DATETIME类型改为BIGINT类型的时间戳（Unix时间戳，以秒为单位），同时提供格式化的时间字符串字段。

## 修改的模型

### 1. User模型
- `user_created_at`: BIGINT类型，创建时间戳（秒）
- `user_updated_at`: BIGINT类型，更新时间戳（秒）
- `user_created_at_str`: 自动生成的格式化字符串（YYYY-MM-DD HH:mm:ss）
- `user_updated_at_str`: 自动生成的格式化字符串（YYYY-MM-DD HH:mm:ss）

### 2. Work模型
- `work_created_at`: BIGINT类型，创建时间戳（秒）
- `work_updated_at`: BIGINT类型，更新时间戳（秒）
- `work_created_at_str`: 自动生成的格式化字符串（YYYY-MM-DD HH:mm:ss）
- `work_updated_at_str`: 自动生成的格式化字符串（YYYY-MM-DD HH:mm:ss）

### 3. Category模型
- `category_created_at`: BIGINT类型，创建时间戳（秒）
- `category_updated_at`: BIGINT类型，更新时间戳（秒）
- `category_created_at_str`: 自动生成的格式化字符串（YYYY-MM-DD HH:mm:ss）
- `category_updated_at_str`: 自动生成的格式化字符串（YYYY-MM-DD HH:mm:ss）

## 迁移脚本

### 1. 完整迁移脚本 (migrate-timestamps.js)
**用途**: 开发环境或测试环境，会清空所有数据
**特点**: 
- 删除现有表结构
- 重新创建表
- 创建测试数据
- 验证数据格式

**使用方法**:
```bash
cd server
node scripts/migrate-timestamps.js
```

### 2. 安全迁移脚本 (safe-migrate-timestamps.js)
**用途**: 生产环境，保留现有数据
**特点**:
- 检查现有表结构
- 添加缺失的时间字段
- 为现有记录设置默认时间戳
- 不删除任何数据

**使用方法**:
```bash
cd server
node scripts/safe-migrate-timestamps.js
```

## 数据格式示例

### 时间戳字段
```javascript
{
  "user_created_at": 1703123456,  // Unix时间戳（秒）
  "user_updated_at": 1703123456   // Unix时间戳（秒）
}
```

### 格式化字符串字段
```javascript
{
  "user_created_at_str": "2023-12-21 15:30:56",  // YYYY-MM-DD HH:mm:ss
  "user_updated_at_str": "2023-12-21 15:30:56"   // YYYY-MM-DD HH:mm:ss
}
```

## 自动时间管理

### 创建记录时
- `created_at` 字段自动设置为当前时间戳
- `updated_at` 字段自动设置为当前时间戳

### 更新记录时
- `updated_at` 字段自动更新为当前时间戳

### 数据输出时
- 通过 `toJSON()` 方法自动生成格式化的时间字符串
- 前端可以直接使用 `xxx_str` 字段显示时间

## 注意事项

1. **开发环境**: 建议使用 `migrate-timestamps.js` 脚本
2. **生产环境**: 必须使用 `safe-migrate-timestamps.js` 脚本
3. **数据备份**: 执行迁移前请备份重要数据
4. **时间格式**: 时间戳以秒为单位，不是毫秒
5. **时区**: 时间戳基于UTC时间，格式化字符串基于本地时区

## 验证迁移结果

迁移完成后，可以通过以下方式验证：

1. 检查数据库表结构
2. 查看模型实例的 `toJSON()` 输出
3. 确认时间字段类型为 BIGINT
4. 验证格式化字符串字段的格式

## 故障排除

### 常见问题
1. **字段已存在**: 安全迁移脚本会自动跳过已存在的字段
2. **权限不足**: 确保数据库用户有ALTER TABLE权限
3. **连接失败**: 检查数据库配置和连接参数

### 回滚方案
如果需要回滚，可以：
1. 恢复数据库备份
2. 或者手动修改模型文件，恢复原来的时间字段配置
