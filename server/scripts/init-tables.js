import { Sequelize } from 'sequelize';

console.log('🔄 开始初始化数据库表...');

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

async function initTables() {
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
    
    // 删除现有表（如果存在）
    console.log('🗑️  删除现有表...');
    await sequelize.query('DROP TABLE IF EXISTS `work`');
    await sequelize.query('DROP TABLE IF EXISTS `category`');
    await sequelize.query('DROP TABLE IF EXISTS `user`');
    console.log('✅ 现有表删除完成！');
    
    // 创建用户表（与 User.model.js 完全匹配）
    console.log('🔨 创建用户表...');
    await sequelize.query(`
      CREATE TABLE \`user\` (
        \`user_id\` int NOT NULL AUTO_INCREMENT,
        \`username\` varchar(50) NOT NULL,
        \`user_email\` varchar(100) NOT NULL,
        \`user_password\` varchar(255) NOT NULL,
        \`user_real_name\` varchar(50) DEFAULT NULL COMMENT '真实姓名',
        \`user_phone\` varchar(20) DEFAULT NULL COMMENT '手机号码',
        \`user_avatar\` varchar(255) DEFAULT 'https://via.placeholder.com/32x32/1890ff/ffffff?text=U',
        \`user_role\` enum('admin','sales','manager') DEFAULT 'sales' COMMENT '用户角色：admin-总后台管理员, sales-业务员, manager-客户经理',
        \`user_status\` enum('active','inactive') DEFAULT 'active' COMMENT '用户状态：active-正常, inactive-冻结',
        \`user_created_at\` bigint NOT NULL DEFAULT 0 COMMENT '创建时间戳（毫秒）',
        \`user_updated_at\` bigint NOT NULL DEFAULT 0 COMMENT '更新时间戳（毫秒）',
        PRIMARY KEY (\`user_id\`),
        UNIQUE KEY \`username\` (\`username\`),
        UNIQUE KEY \`user_email\` (\`user_email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ 用户表创建成功！');
    
    // 创建分类表（与 Category.model.js 完全匹配）
    console.log('🔨 创建分类表...');
    await sequelize.query(`
      CREATE TABLE \`category\` (
        \`category_id\` int NOT NULL AUTO_INCREMENT COMMENT '分类ID',
        \`name\` varchar(100) NOT NULL COMMENT '分类名称',
        \`description\` text COMMENT '分类描述',
        \`sort_order\` int NOT NULL DEFAULT 1 COMMENT '排序权重，数字越小排序越靠前',
        \`icon\` varchar(100) DEFAULT NULL COMMENT '分类图标',
        \`enabled\` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
        \`show_in_nav\` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否在导航中显示',
        \`category_created_at\` bigint NOT NULL DEFAULT 0 COMMENT '创建时间戳（毫秒）',
        \`category_updated_at\` bigint NOT NULL DEFAULT 0 COMMENT '更新时间戳（毫秒）',
        PRIMARY KEY (\`category_id\`),
        KEY \`idx_sort_order\` (\`sort_order\`),
        KEY \`idx_enabled\` (\`enabled\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ 分类表创建成功！');
    
    // 创建作品表（与 Work.model.js 完全匹配）
    console.log('🔨 创建作品表...');
    await sequelize.query(`
      CREATE TABLE \`work\` (
        \`work_id\` int NOT NULL AUTO_INCREMENT COMMENT '作品ID',
        \`work_name\` varchar(200) NOT NULL COMMENT '作品名称',
        \`work_desc\` text COMMENT '作品描述',
        \`work_prompt_cn\` text COMMENT '中文提示词',
        \`work_prompt_en\` text COMMENT '英文提示词',
        \`work_guide_desc\` longtext COMMENT '使用指南描述',
        \`work_img_path\` varchar(500) DEFAULT NULL COMMENT '作品图片路径',
        \`user_id\` int NOT NULL COMMENT '创建用户ID',
        \`work_status\` enum('draft','published','archived') DEFAULT 'draft' COMMENT '作品状态',
        \`work_category_list\` json DEFAULT NULL COMMENT '分类列表',
        \`work_outer_link_list\` json DEFAULT NULL COMMENT '外部链接列表',
        \`metadata\` json DEFAULT NULL COMMENT '元数据',
        \`work_created_at\` bigint NOT NULL DEFAULT 0 COMMENT '创建时间戳（毫秒）',
        \`work_updated_at\` bigint NOT NULL DEFAULT 0 COMMENT '更新时间戳（毫秒）',
        PRIMARY KEY (\`work_id\`),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_work_status\` (\`work_status\`),
        KEY \`idx_work_created_at\` (\`work_created_at\`),
        CONSTRAINT \`work_ibfk_1\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\` (\`user_id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ 作品表创建成功！');
    
    // 插入默认数据
    console.log('📝 插入默认数据...');
    
    // 插入默认管理员用户（密码: admin123）
    const { hashPassword } = await import('../utils/sha256.js');
    const hashedPassword = hashPassword('admin123');
    
    const currentTime = Date.now();
    await sequelize.query(`
      INSERT INTO \`user\` (\`username\`, \`user_email\`, \`user_password\`, \`user_role\`, \`user_status\`, \`user_created_at\`, \`user_updated_at\`) VALUES
      ('admin', 'admin@example.com', '${hashedPassword}', 'admin', 'active', ${currentTime}, ${currentTime})
    `);
    console.log('✅ 默认管理员用户创建成功！');
    
    // 插入默认分类
    await sequelize.query(`
      INSERT INTO \`category\` (\`name\`, \`description\`, \`sort_order\`, \`enabled\`, \`show_in_nav\`, \`category_created_at\`, \`category_updated_at\`) VALUES
      ('默认分类', '系统默认分类', 1, 1, 1, ${currentTime}, ${currentTime})
    `);
    console.log('✅ 默认分类创建成功！');
    
    // 验证表是否创建成功
    console.log('🔍 验证表创建状态...');
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📊 已创建的表:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    
    // 验证字段结构
    console.log('\n🔍 验证表字段结构...');
    
    // 检查用户表字段
    const [userColumns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'ai_prompt_admin' AND TABLE_NAME = 'user'
      ORDER BY ORDINAL_POSITION
    `);
    console.log('📋 用户表字段:');
    userColumns.forEach(col => {
      console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'} ${col.COLUMN_COMMENT ? `(${col.COLUMN_COMMENT})` : ''}`);
    });
    
    // 检查分类表字段
    const [categoryColumns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'ai_prompt_admin' AND TABLE_NAME = 'category'
      ORDER BY ORDINAL_POSITION
    `);
    console.log('\n📋 分类表字段:');
    categoryColumns.forEach(col => {
      console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'} ${col.COLUMN_COMMENT ? `(${col.COLUMN_COMMENT})` : ''}`);
    });
    
    // 检查作品表字段
    const [workColumns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'ai_prompt_admin' AND TABLE_NAME = 'work'
      ORDER BY ORDINAL_POSITION
    `);
    console.log('\n📋 作品表字段:');
    workColumns.forEach(col => {
      console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'} ${col.COLUMN_COMMENT ? `(${col.COLUMN_COMMENT})` : ''}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ 表初始化失败:', error.message);
    return false;
  } finally {
    await sequelize.close();
  }
}

// 运行初始化
initTables()
  .then(success => {
    if (success) {
      console.log('\n🎉 数据库表初始化完成！');
      console.log('💡 现在可以启动应用了');
    } else {
      console.log('\n❌ 数据库表初始化失败！');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ 初始化过程中发生错误:', error);
    process.exit(1);
  });
