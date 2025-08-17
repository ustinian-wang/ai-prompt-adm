/**
 * 时间戳工具函数
 * 统一处理数据库时间字段的存储和输出格式
 */

/**
 * 获取当前时间戳（毫秒）
 * @returns {number} Unix时间戳（毫秒）
 */
export function getCurrentTimestamp() {
  return Date.now()
}

/**
 * 将时间戳转换为格式化的字符串
 * @param {number} timestamp - Unix时间戳（毫秒）
 * @param {string} format - 输出格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化的时间字符串
 */
export function formatTimestamp(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  
  if (format === 'YYYY-MM-DD HH:mm:ss') {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
  }
  
  if (format === 'YYYY-MM-DD') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-')
  }
  
  if (format === 'HH:mm:ss') {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }
  
  // 默认返回完整格式
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}

/**
 * 为模型实例添加格式化的时间字符串字段
 * @param {Object} instance - Sequelize模型实例
 * @param {string} createdField - 创建时间字段名
 * @param {string} updatedField - 更新时间字段名
 * @returns {Object} 包含格式化时间字符串的对象
 */
export function addFormattedTimestamps(instance, createdField, updatedField) {
  const values = instance.toJSON ? instance.toJSON() : instance
  
  // 添加格式化的时间字符串
  if (values[createdField]) {
    values[`${createdField}_str`] = formatTimestamp(values[createdField])
  }
  
  if (values[updatedField]) {
    values[`${updatedField}_str`] = formatTimestamp(values[updatedField])
  }
  
  return values
}

/**
 * 批量处理数组中的时间戳格式化
 * @param {Array} instances - Sequelize模型实例数组
 * @param {string} createdField - 创建时间字段名
 * @param {string} updatedField - 更新时间字段名
 * @returns {Array} 包含格式化时间字符串的数组
 */
export function addFormattedTimestampsToArray(instances, createdField, updatedField) {
  if (!Array.isArray(instances)) return instances
  
  return instances.map(instance => 
    addFormattedTimestamps(instance, createdField, updatedField)
  )
}

/**
 * 验证时间戳是否有效
 * @param {number} timestamp - 要验证的时间戳
 * @returns {boolean} 是否有效
 */
export function isValidTimestamp(timestamp) {
  if (typeof timestamp !== 'number') return false
  if (timestamp < 0) return false
  if (timestamp > 9999999999999) return false // 最大到2286年（毫秒）
  return true
}

/**
 * 将Date对象转换为时间戳
 * @param {Date} date - Date对象
 * @returns {number} Unix时间戳（毫秒）
 */
export function dateToTimestamp(date) {
  if (!(date instanceof Date)) return getCurrentTimestamp()
  return date.getTime()
}

/**
 * 将时间戳转换为Date对象
 * @param {number} timestamp - Unix时间戳（毫秒）
 * @returns {Date} Date对象
 */
export function timestampToDate(timestamp) {
  if (!isValidTimestamp(timestamp)) return new Date()
  return new Date(timestamp)
}

/**
 * 获取相对时间描述（如：刚刚、5分钟前、1小时前等）
 * @param {number} timestamp - Unix时间戳（毫秒）
 * @returns {string} 相对时间描述
 */
export function getRelativeTime(timestamp) {
  if (!isValidTimestamp(timestamp)) return ''
  
  const now = getCurrentTimestamp()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
  if (diff < 31536000000) return `${Math.floor(diff / 2592000000)}个月前`
  
  return `${Math.floor(diff / 31536000000)}年前`
}
