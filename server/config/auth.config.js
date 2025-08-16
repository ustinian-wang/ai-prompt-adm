// 认证相关配置
export const authConfig = {
  // JWT密钥，生产环境应该从环境变量获取
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  
  // JWT token过期时间
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // 密码加密轮数
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  
  // 允许的角色
  ALLOWED_ROLES: ['admin', 'super_admin', 'user', 'guest'],
  
  // 管理员角色
  ADMIN_ROLES: ['admin', 'super_admin'],
  
  // 用户角色
  USER_ROLES: ['admin', 'super_admin', 'user'],
  
  // 访客角色
  GUEST_ROLES: ['guest']
}

// 权限配置
export const permissionConfig = {
  // 用户管理权限
  USER_MANAGEMENT: {
    CREATE: ['admin', 'super_admin'],
    READ: ['admin', 'super_admin', 'user'],
    UPDATE: ['admin', 'super_admin', 'user'],
    DELETE: ['admin', 'super_admin']
  },
  
  // 作品管理权限
  WORK_MANAGEMENT: {
    CREATE: ['admin', 'super_admin', 'user'],
    READ: ['admin', 'super_admin', 'user', 'guest'],
    UPDATE: ['admin', 'super_admin', 'user'],
    DELETE: ['admin', 'super_admin', 'user']
  },
  
  // 分类管理权限
  CATEGORY_MANAGEMENT: {
    CREATE: ['admin', 'super_admin'],
    READ: ['admin', 'super_admin', 'user', 'guest'],
    UPDATE: ['admin', 'super_admin'],
    DELETE: ['admin', 'super_admin']
  },
  
  // 角色管理权限
  ROLE_MANAGEMENT: {
    CREATE: ['admin', 'super_admin'],
    READ: ['admin', 'super_admin'],
    UPDATE: ['admin', 'super_admin'],
    DELETE: ['admin', 'super_admin']
  }
}
