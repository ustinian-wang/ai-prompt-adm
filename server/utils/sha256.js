import crypto from 'crypto'

/**
 * SHA256 密码加密工具
 * 注意：SHA256 是单向哈希，每次对相同输入产生相同输出
 */

/**
 * 使用 SHA256 加密密码
 * @param {string} password - 明文密码
 * @returns {string} - 加密后的密码
 */
export function hashPassword(password) {
  if (!password) {
    throw new Error('密码不能为空')
  }
  
  // 使用 SHA256 加密
  const hash = crypto.createHash('sha256')
  hash.update(password, 'utf8')
  
  return hash.digest('hex')
}

/**
 * 验证密码
 * @param {string} password - 明文密码
 * @param {string} hashedPassword - 已加密的密码
 * @returns {boolean} - 密码是否匹配
 */
export function verifyPassword(password, hashedPassword) {
  if (!password || !hashedPassword) {
    return false
  }
  
  // 对输入的密码进行相同的加密
  const inputHash = hashPassword(password)
  
  // 比较两个哈希值
  return inputHash === hashedPassword
}

/**
 * 使用 SHA256 加密密码（兼容旧接口）
 * @param {string} password - 明文密码
 * @returns {object} - 包含加密密码的对象（兼容旧代码）
 */
export function hashPasswordWithSalt(password) {
  const hashedPassword = hashPassword(password)
  
  return {
    hashedPassword,
    salt: '' // 空盐值，保持兼容性
  }
}

/**
 * 验证密码（兼容旧接口）
 * @param {string} password - 明文密码
 * @param {string} hashedPassword - 已加密的密码
 * @param {string} salt - 盐值（忽略，保持兼容性）
 * @returns {boolean} - 密码是否匹配
 */
export function verifyPasswordWithSalt(password, hashedPassword, salt = '') {
  return verifyPassword(password, hashedPassword)
}
