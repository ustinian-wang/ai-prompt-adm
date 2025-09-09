import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || '42.193.243.30',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'fai@508',
  database: process.env.DB_NAME || 'ai_prompt_admin',
  charset: 'utf8mb4'
};

// 会员表创建SQL
const createMemberTableSQL = `
-- 会员账号表（简化版）
CREATE TABLE IF NOT EXISTS \`member_accounts\` (
  \`mem_id\` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '会员ID',
  \`mem_username\` varchar(50) NOT NULL COMMENT '会员用户名',
  \`mem_password\` varchar(100) NOT NULL COMMENT '密码',
  \`mem_nickname\` varchar(50) DEFAULT NULL COMMENT '昵称',
  \`mem_avatar\` varchar(255) DEFAULT NULL COMMENT '头像URL',
  \`mem_status\` tinyint(1) NOT NULL DEFAULT '1' COMMENT '账号状态：1-正常，0-禁用',
  \`mem_level\` tinyint(2) NOT NULL DEFAULT '1' COMMENT '会员等级：1-普通会员，2-VIP会员',
  \`mem_last_login_time\` datetime DEFAULT NULL COMMENT '最后登录时间',
  \`mem_register_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (\`mem_id\`),
  UNIQUE KEY \`uk_mem_username\` (\`mem_username\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员账号表';
`;

async function initMemberTables() {
  let connection;
  
  try {
    console.log('🔗 连接数据库...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ 数据库连接成功');

    console.log('📋 创建会员表...');
    await connection.execute(createMemberTableSQL);
    console.log('✅ 会员表创建成功');

    // 检查表是否创建成功
    const [tables] = await connection.execute("SHOW TABLES LIKE 'member_accounts'");
    if (tables.length > 0) {
      console.log('✅ 会员表验证成功');
      
      // 显示表结构
      const [columns] = await connection.execute("DESCRIBE member_accounts");
      console.log('📊 表结构:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
      });
    } else {
      console.log('❌ 会员表创建失败');
    }

    console.log('🎉 会员表初始化完成！');

  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 数据库连接已关闭');
    }
  }
}

// 如果直接运行此脚本
console.log('脚本开始执行...');
initMemberTables();

export { initMemberTables };
