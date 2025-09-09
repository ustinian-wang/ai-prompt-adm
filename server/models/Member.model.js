import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Member = sequelize.define('Member', {
  mem_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    comment: '会员ID'
  },
  mem_username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '会员用户名'
  },
  mem_password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '密码'
  },
  mem_nickname: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '昵称'
  },
  mem_avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '头像URL'
  },
  mem_status: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1,
    comment: '账号状态：1-正常，0-禁用'
  },
  mem_level: {
    type: DataTypes.TINYINT(2),
    allowNull: false,
    defaultValue: 1,
    comment: '会员等级：1-普通会员，2-VIP会员'
  },
  mem_last_login_time: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '最后登录时间'
  },
  mem_register_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '注册时间'
  }
}, {
  tableName: 'member_accounts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '会员账号表'
});

// 静态方法：根据用户名查找用户
Member.findByUsername = async function(username) {
  return await this.findOne({
    where: { 
      mem_username: username,
      mem_status: 1 
    }
  });
};

// 静态方法：创建新用户
Member.createUser = async function(userData) {
  return await this.create(userData);
};

// 静态方法：更新最后登录时间
Member.updateLastLogin = async function(memId) {
  return await this.update(
    { mem_last_login_time: new Date() },
    { where: { mem_id: memId } }
  );
};

// 实例方法：验证密码
Member.prototype.validatePassword = function(password) {
  return this.mem_password === password;
};

// 实例方法：获取用户信息（不包含密码）
Member.prototype.getPublicInfo = function() {
  const { mem_password, ...publicInfo } = this.toJSON();
  return publicInfo;
};

export default Member;
