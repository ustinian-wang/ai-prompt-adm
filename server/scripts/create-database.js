import { Sequelize } from 'sequelize';

console.log('🗄️ 开始创建MySQL数据库...');

// 连接到MySQL服务器（不指定数据库）
const config = {
  host: '42.193.243.30',
  port: 3306,
  username: 'root',
  password: 'fai@508',
  dialect: 'mysql',
  logging: false
};

async function createDatabase() {
  console.log('📋 连接信息:');
  console.log(`   - 主机: ${config.host}`);
  console.log(`   - 端口: ${config.port}`);
  console.log(`   - 用户名: ${config.username}`);
  
  const sequelize = new Sequelize(config);
  
  try {
    // 测试连接
    await sequelize.authenticate();
    console.log('✅ MySQL服务器连接成功！');
    
    // 创建数据库
    console.log('🔨 创建数据库 ai_prompt_admin...');
    await sequelize.query('CREATE DATABASE IF NOT EXISTS `ai_prompt_admin` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ 数据库 ai_prompt_admin 创建成功！');
    
    // 验证数据库是否创建成功
    const [results] = await sequelize.query('SHOW DATABASES LIKE ?', {
      replacements: ['ai_prompt_admin']
    });
    
    if (results.length > 0) {
      console.log('✅ 数据库创建验证成功！');
    } else {
      console.log('❌ 数据库创建验证失败！');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 提示: 用户名或密码错误');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 提示: 无法连接到数据库服务器，请检查IP地址和端口');
    } else if (error.code === 'ER_DBACCESS_DENIED_ERROR') {
      console.error('💡 提示: 用户没有创建数据库的权限');
    }
    
    return false;
  } finally {
    await sequelize.close();
  }
}

// 运行创建数据库
createDatabase()
  .then(success => {
    if (success) {
      console.log('🎉 数据库创建完成！');
      console.log('💡 现在可以运行初始化脚本来创建表结构了');
    } else {
      console.log('❌ 数据库创建失败！');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ 创建过程中发生错误:', error);
    process.exit(1);
  });
