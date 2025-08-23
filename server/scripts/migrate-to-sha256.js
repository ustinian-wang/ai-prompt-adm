import { Sequelize } from 'sequelize';
import { hashPassword } from '../utils/sha256.js';

console.log('🔄 开始迁移用户密码从 bcrypt 到 SHA256...');

// MySQL连接配置
const config = {
  host: '42.193.243.30',
  port: 3306,
  username: 'root',
  password: 'fai@508',
  database: 'ai_prompt_admin',
  dialect: 'mysql',
  logging: false
};

async function migratePasswords() {
  console.log('📋 连接信息:');
  console.log(`   - 主机: ${config.host}`);
  console.log(`   - 端口: ${config.port}`);
  console.log(`   - 用户名: ${config.username}`);
  console.log(`   - 数据库: ${config.database}`);
  
  const sequelize = new Sequelize(config);
  
  try {
    // 测试连接
    await sequelize.authenticate();
    console.log('✅ MySQL数据库连接成功！');
    
    // 检查是否需要移除 user_salt 字段
    console.log('🔍 检查数据库表结构...');
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'ai_prompt_admin' AND TABLE_NAME = 'user'
      ORDER BY ORDINAL_POSITION
    `);
    
    const hasSaltField = columns.some(col => col.COLUMN_NAME === 'user_salt');
    
    if (hasSaltField) {
      console.log('🔨 移除 user_salt 字段...');
      await sequelize.query(`
        ALTER TABLE \`user\` DROP COLUMN \`user_salt\`
      `);
      console.log('✅ user_salt 字段移除成功！');
    } else {
      console.log('✅ user_salt 字段不存在，无需移除');
    }
    
    // 获取所有用户
    console.log('👥 获取所有用户...');
    const [users] = await sequelize.query('SELECT user_id, username, user_password FROM `user`');
    console.log(`📊 找到 ${users.length} 个用户`);
    
    if (users.length === 0) {
      console.log('⚠️  没有找到用户，迁移完成');
      return true;
    }
    
    // 迁移每个用户的密码
    console.log('🔄 开始迁移用户密码...');
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      try {
        // 检查密码是否已经是SHA256格式（64位十六进制）
        const isAlreadySHA256 = /^[a-f0-9]{64}$/i.test(user.user_password);
        
        if (isAlreadySHA256) {
          console.log(`⏭️  用户 ${user.username} 密码已经是SHA256格式，跳过`);
          skippedCount++;
          continue;
        }
        
        // 检查是否是bcrypt格式（以$2a$开头）
        const isBcrypt = user.user_password.startsWith('$2a$');
        
        if (isBcrypt) {
          console.log(`🔄 迁移用户 ${user.username} 的密码从 bcrypt 到 SHA256...`);
          
          // 对于bcrypt密码，我们需要设置一个临时密码
          // 因为无法从bcrypt哈希中恢复原始密码
          const tempPassword = 'temp_password_' + Date.now();
          const hashedPassword = hashPassword(tempPassword);
          
          await sequelize.query(`
            UPDATE \`user\` 
            SET \`user_password\` = ?
            WHERE \`user_id\` = ?
          `, {
            replacements: [hashedPassword, user.user_id]
          });
          
          console.log(`⚠️  用户 ${user.username} 密码已重置为临时密码，需要用户重新设置`);
          migratedCount++;
        } else {
          // 其他格式的密码，直接转换为SHA256
          console.log(`🔄 转换用户 ${user.username} 的密码到 SHA256...`);
          
          const hashedPassword = hashPassword(user.user_password);
          
          await sequelize.query(`
            UPDATE \`user\` 
            SET \`user_password\` = ?
            WHERE \`user_id\` = ?
          `, {
            replacements: [hashedPassword, user.user_id]
          });
          
          console.log(`✅ 用户 ${user.username} 密码转换成功`);
          migratedCount++;
        }
      } catch (error) {
        console.error(`❌ 迁移用户 ${user.username} 失败:`, error.message);
      }
    }
    
    console.log('\n📊 迁移结果统计:');
    console.log(`   - 成功迁移: ${migratedCount} 个用户`);
    console.log(`   - 跳过: ${skippedCount} 个用户`);
    console.log(`   - 总计: ${users.length} 个用户`);
    
    if (migratedCount > 0) {
      console.log('\n⚠️  重要提醒:');
      console.log('   1. 从 bcrypt 迁移的用户密码已被重置为临时密码');
      console.log('   2. 这些用户需要使用"忘记密码"功能重新设置密码');
      console.log('   3. 或者管理员可以手动设置新密码');
    }
    
    console.log('\n💡 现在使用纯SHA256加密，不再需要盐值字段');
    console.log('⚠️  注意：纯SHA256加密安全性较低，建议在生产环境中使用更强的加密方式');
    
    return true;
  } catch (error) {
    console.error('❌ 密码迁移失败:', error.message);
    return false;
  } finally {
    await sequelize.close();
  }
}

// 运行迁移
migratePasswords()
  .then(success => {
    if (success) {
      console.log('\n🎉 密码迁移完成！');
      console.log('💡 现在可以重新初始化数据库表结构了');
    } else {
      console.log('\n❌ 密码迁移失败！');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ 迁移过程中发生错误:', error);
    process.exit(1);
  });
