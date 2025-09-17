import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

// 通用对象存储-文件表（oss_files）- 简化版本
const OssFile = sequelize.define('OssFile', {
  file_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键ID'
  },
  object_key: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: '对象键，例如 2025/09/17/uuid.png'
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '原始文件名'
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
    comment: '文件大小（字节）'
  },
  mimetype: {
    type: DataTypes.STRING(128),
    allowNull: true,
    comment: 'MIME类型'
  },
  url: {
    type: DataTypes.STRING(512),
    allowNull: true,
    comment: '可访问URL（保存时回填，local为相对或绝对路径）'
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: '上传者ID（可为空）'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'oss_files',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
  comment: '通用OSS文件表（简化）'
})

export default OssFile


