import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import bcrypt from 'bcryptjs'

const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 50]
    }
  },
  user_email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  user_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  user_avatar: {
    type: DataTypes.STRING(255),
    defaultValue: 'https://via.placeholder.com/32x32/1890ff/ffffff?text=U'
  },
  user_role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  },
  user_status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'user',
  timestamps: true,
  createdAt: 'user_created_at',
  updatedAt: 'user_updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.user_password) {
        user.user_password = await bcrypt.hash(user.user_password, 10)
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('user_password')) {
        user.user_password = await bcrypt.hash(user.user_password, 10)
      }
    }
  }
})

// 实例方法：验证密码
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.user_password)
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
