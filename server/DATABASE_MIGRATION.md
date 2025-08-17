# 数据库迁移说明

## 概述

本项目已从文件数据库迁移到 Sequelize + SQLite 架构，支持后期无缝迁移到 MySQL。

## 🏗️ 新架构特点

### 1. **ORM 封装**
- 使用 Sequelize 作为 ORM，提供类型安全的数据库操作
- 支持模型关联、事务、迁移等高级功能
- 代码更清晰，维护性更强

### 2. **多数据库支持**
- **开发环境**: SQLite（文件数据库，无需安装数据库服务）
- **生产环境**: MySQL（高性能关系型数据库）
- 通过环境变量 `NODE_ENV` 自动切换

### 3. **数据模型**
- `User`: 用户管理
- `Category`: 分类管理（支持树形结构）
- `Work`: 作品管理

## 🚀 快速开始

### 1. 安装依赖
```bash
cd server
yarn install
```

### 2. 数据库迁移
```bash
# 创建数据库表
yarn db:migrate

# 插入初始数据
yarn db:seed
```

### 3. 启动服务
```bash
# 开发模式
yarn dev

# 生产模式
yarn start
```

## 📊 数据库配置

### 开发环境 (SQLite)
```javascript
// config/database.js
development: {
  dialect: 'sqlite',
  storage: './data/database.sqlite',
  logging: console.log
}
```

### 生产环境 (MySQL)
```bash
# 环境变量
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ai_prompt_admin
```

## 🔄 迁移到 MySQL

### 1. 安装 MySQL 依赖
```bash
yarn add mysql2
```

### 2. 设置环境变量
```bash
export NODE_ENV=production
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=ai_prompt_admin
```

### 3. 创建 MySQL 数据库
```sql
CREATE DATABASE ai_prompt_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 运行迁移
```bash
yarn db:migrate
yarn db:seed
```

## 📁 目录结构

```
server/
├── config/
│   └── database.js          # 数据库配置
├── models/
│   ├── User.js              # 用户模型
│   ├── Category.js          # 分类模型
│   ├── Work.js              # 作品模型
│   └── index.js             # 模型索引
├── scripts/
│   ├── migrate.js           # 数据库迁移
│   └── seed.js              # 数据种子
└── data/
    └── database.sqlite      # SQLite 数据库文件
```

## 🛠️ 常用命令

```bash
# 数据库操作
yarn db:migrate              # 创建/更新数据库表
yarn db:seed                 # 插入初始数据

# 开发
yarn dev                     # 开发模式启动
yarn start                   # 生产模式启动
```

## 🔧 模型使用示例

### 创建用户
```javascript
import { User } from '../models/index.js'

const user = await User.create({
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
})
```

### 查询分类（树形结构）
```javascript
import { Category } from '../models/index.js'

const categories = await Category.getTree()
```

### 查询作品（带分页）
```javascript
import { Work } from '../models/index.js'

const result = await Work.getList({
  page: 1,
  limit: 10,
  category_id: 1,
  search: 'AI'
})
```

## 📝 注意事项

1. **数据备份**: 迁移前请备份原有数据
2. **环境变量**: 生产环境必须设置正确的数据库环境变量
3. **权限设置**: 确保数据库用户有足够的权限
4. **字符集**: 建议使用 utf8mb4 字符集支持 emoji

## 🆘 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查环境变量设置
   - 确认数据库服务运行状态
   - 验证用户名密码

2. **表创建失败**
   - 检查数据库权限
   - 确认数据库名称正确
   - 查看错误日志

3. **数据插入失败**
   - 检查数据格式
   - 确认外键关联正确
   - 验证必填字段

## 🔗 相关链接

- [Sequelize 官方文档](https://sequelize.org/)
- [SQLite 官方文档](https://www.sqlite.org/)
- [MySQL 官方文档](https://dev.mysql.com/doc/)
