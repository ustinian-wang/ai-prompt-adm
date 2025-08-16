# 权限验证中间件使用说明

## 概述

本项目提供了完整的权限验证中间件系统，用于保护API接口的安全性和权限控制。

## 中间件列表

### 1. authMiddleware(requiredRoles = [])
**功能**: 验证JWT token和用户权限
**参数**: 
- `requiredRoles`: 可选，需要的角色权限数组
**使用场景**: 需要登录验证的接口

```javascript
// 需要任何登录用户
router.get('/user/info', authMiddleware(), getUserInfo)

// 需要特定角色
router.get('/admin/users', authMiddleware(['admin', 'super_admin']), getUsers)
```

### 2. optionalAuthMiddleware()
**功能**: 可选认证，有token就验证，没有就跳过
**使用场景**: 可选登录的接口，如公开内容但支持个性化

```javascript
router.get('/public/works', optionalAuthMiddleware(), getWorks)
```

### 3. roleCheckMiddleware(roles)
**功能**: 检查用户角色权限
**参数**: `roles` - 允许的角色数组
**使用场景**: 在authMiddleware之后使用，进行角色权限检查

```javascript
router.get('/admin/users', authMiddleware(), roleCheckMiddleware(['admin']), getUsers)
```

### 4. adminCheckMiddleware()
**功能**: 检查是否为管理员角色
**使用场景**: 管理员专用接口

```javascript
router.get('/admin/users', authMiddleware(), adminCheckMiddleware(), getUsers)
```

### 5. userCheckMiddleware()
**功能**: 检查是否为有效用户角色
**使用场景**: 普通用户和管理员都可以访问的接口

```javascript
router.get('/user/profile', authMiddleware(), userCheckMiddleware(), getProfile)
```

## 使用示例

### 基础认证
```javascript
import { authMiddleware } from '../middleware/index.js'

// 需要登录
router.get('/user/info', authMiddleware(), getUserInfo)
```

### 角色权限控制
```javascript
import { authMiddleware, adminCheckMiddleware } from '../middleware/index.js'

// 需要管理员权限
router.post('/admin/users', authMiddleware(), adminCheckMiddleware(), createUser)
```

### 自定义角色权限
```javascript
import { authMiddleware, roleCheckMiddleware } from '../middleware/index.js'

// 需要特定角色
router.get('/content/manage', authMiddleware(), roleCheckMiddleware(['admin', 'content_manager']), manageContent)
```

### 可选认证
```javascript
import { optionalAuthMiddleware } from '../middleware/index.js'

// 可选登录
router.get('/public/works', optionalAuthMiddleware(), getWorks)
```

## 权限配置

权限配置在 `../config/auth.config.js` 中定义：

```javascript
export const permissionConfig = {
  USER_MANAGEMENT: {
    CREATE: ['admin', 'super_admin'],
    READ: ['admin', 'super_admin', 'user'],
    UPDATE: ['admin', 'super_admin', 'user'],
    DELETE: ['admin', 'super_admin']
  }
}
```

## 中间件执行顺序

1. **authMiddleware**: 验证JWT token，检查用户状态
2. **roleCheckMiddleware**: 检查角色权限
3. **业务逻辑**: 执行具体的业务处理

## 错误处理

中间件会自动处理以下错误情况：
- 401: 未认证或token无效
- 403: 权限不足
- 500: 服务器内部错误

## 安全建议

1. 生产环境必须设置 `JWT_SECRET` 环境变量
2. 定期更换JWT密钥
3. 合理设置token过期时间
4. 根据业务需求合理分配角色权限
5. 敏感操作建议使用双重验证
