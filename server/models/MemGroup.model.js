import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// 会员分组模型（mem_group）
const MemGroup = sequelize.define('MemGroup', {
  mg_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    comment: '分组ID'
  },
  mg_mem_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '所属会员ID，关联 member_accounts.mem_id'
  },
  mg_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '分组名称，同一会员下唯一'
  },
  mg_desc: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '分组描述'
  },
  mg_is_private: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: '是否私有：1-私有 0-公开'
  },
  mg_sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序值，越大越前'
  },
  mg_cover_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '封面URL'
  },
  mg_color: {
    type: DataTypes.STRING(32),
    allowNull: true,
    comment: '分组颜色'
  },
  mg_item_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '条目数量（冗余统计）'
  },
  mg_created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  },
  mg_updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新时间'
  },
  mg_deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '软删除时间'
  }
}, {
  tableName: 'mem_group',
  timestamps: true,
  createdAt: 'mg_created_at',
  updatedAt: 'mg_updated_at',
  paranoid: true,
  deletedAt: 'mg_deleted_at',
  comment: '会员分组表'
});

export default MemGroup;


