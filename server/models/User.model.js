import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { hashPassword, verifyPassword } from '../utils/sha256.js'
import { getCurrentTimestamp, addFormattedTimestamps } from '../utils/timestamp.js'

const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    // validate: {
    //   len: [2, 50]
    // }
  },
  user_email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    // validate: {
    //   isEmail: true
    // }
  },
  user_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  user_real_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '真实姓名'
  },
  user_phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '手机号码'
  },
  user_avatar: {
    type: DataTypes.STRING(255),
    defaultValue: 'https://via.placeholder.com/32x32/1890ff/ffffff?text=U'
  },
  user_role: {
    type: DataTypes.ENUM('admin', 'sales', 'manager'),
    defaultValue: 'sales',
    comment: '用户角色：admin-总后台管理员, sales-业务员, manager-客户经理'
  },
  user_status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
    comment: '用户状态：active-正常, inactive-冻结'
  },
  user_created_at: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: () => Date.now(),
    comment: '创建时间戳（毫秒）'
  },
  user_updated_at: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: () => Date.now(),
    comment: '更新时间戳（毫秒）'
  }
}, {
  tableName: 'user',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.user_password) {
        // 使用纯SHA256加密密码
        user.user_password = hashPassword(user.user_password)
      }
      user.user_created_at = Date.now()
      user.user_updated_at = Date.now()
    },
    beforeUpdate: async (user) => {
      if (user.changed('user_password')) {
        // 更新密码时重新加密
        user.user_password = hashPassword(user.user_password)
      }
      user.user_updated_at = Date.now()
    }
  }
})

// 实例方法：验证密码
User.prototype.validatePassword = async function(password) {
  let res = verifyPassword(password, this.user_password);
  console.log('[validatePassword] res', res, password)
  return res;
}

// 确保时间字段返回原始毫秒时间戳，并添加格式化的时间字符串
User.prototype.toJSON = function() {
  const data = this.get();
  
  // 确保时间字段返回原始数值，而不是格式化的字符串
  if (data.user_created_at) {
    data.user_created_at = parseInt(data.user_created_at);
    // 添加格式化的时间字符串字段
    data.user_created_at_str = this.formatTimestamp(data.user_created_at);
  }
  
  if (data.user_updated_at) {
    data.user_updated_at = parseInt(data.user_updated_at);
    // 添加格式化的时间字符串字段
    data.user_updated_at_str = this.formatTimestamp(data.user_updated_at);
  }
  
  return data;
}

// 格式化时间戳为 YYYY-MM-DD HH:mm:ss 格式
User.prototype.formatTimestamp = function(timestamp) {
  if (!timestamp) return null;
  
  const date = new Date(timestamp);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) return null;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 类方法：查找用户（不返回密码）
User.findByUsername = async function(username) {
  return await this.findOne({
    where: { username }
  })
}

// 查找用户 by user_id
User.findByUserId = async function(userId) {
  return await this.findOne({
    where: { user_id: userId }
  })
}

// 类方法：验证登录
User.authenticate = async function(username, password) {
  const user = await this.findOne({ where: { username } })
  if (!user) return null
  
  const isValid = await user.validatePassword(password)
  return isValid ? user : null
}

export default User
