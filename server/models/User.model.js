import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import bcrypt from 'bcryptjs'
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
        user.user_password = await bcrypt.hash(user.user_password, 10)
      }
      user.user_created_at = Date.now()
      user.user_updated_at = Date.now()
    },
    beforeUpdate: async (user) => {
      if (user.changed('user_password')) {
        user.user_password = await bcrypt.hash(user.user_password, 10)
      }
      user.user_updated_at = Date.now()
    }
  }
})

// 实例方法：验证密码
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.user_password)
}

// 移除时间格式化getter，直接返回原始数据
User.prototype.toJSON = function() {
  return Object.assign({}, this.get())
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
