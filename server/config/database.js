const mysql = require('mysql2/promise')

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ai_prompt_admin',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
}

// 创建连接池
const pool = mysql.createPool(dbConfig)

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('数据库连接成功')
    connection.release()
  } catch (error) {
    console.error('数据库连接失败:', error.message)
    process.exit(1)
  }
}

// 初始化数据库表
async function initDatabase() {
  try {
    const connection = await pool.getConnection()
    
    // 创建用户表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        role_id INT DEFAULT 2,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    
    // 创建角色表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        permissions JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    
    // 创建分类表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        parent_id INT DEFAULT 0,
        sort_order INT DEFAULT 0,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `)
    
    // 创建作品表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS works (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        content LONGTEXT,
        category_id INT,
        user_id INT NOT NULL,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        view_count INT DEFAULT 0,
        like_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    
    // 创建提示词表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS prompts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        work_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        parameters JSON,
        model_type VARCHAR(50),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
      )
    `)
    
    // 插入默认角色
    await connection.execute(`
      INSERT IGNORE INTO roles (id, name, description, permissions) VALUES
      (1, 'admin', '系统管理员', '["*"]'),
      (2, 'user', '普通用户', '["works:read", "works:write", "categories:read"]')
    `)
    
    // 插入默认管理员用户 (密码: admin123)
    const hashedPassword = require('bcryptjs').hashSync('admin123', 10)
    await connection.execute(`
      INSERT IGNORE INTO users (id, username, email, password, role_id) VALUES
      (1, 'admin', 'admin@example.com', ?, 1)
    `, [hashedPassword])
    
    // 插入默认分类
    await connection.execute(`
      INSERT IGNORE INTO categories (id, name, description, parent_id, sort_order) VALUES
      (1, 'AI写作', 'AI写作相关提示词', 0, 1),
      (2, 'AI绘画', 'AI绘画相关提示词', 0, 2),
      (3, 'AI编程', 'AI编程相关提示词', 0, 3),
      (4, 'AI对话', 'AI对话相关提示词', 0, 4)
    `)
    
    connection.release()
    console.log('数据库表初始化完成')
  } catch (error) {
    console.error('数据库初始化失败:', error.message)
    throw error
  }
}

module.exports = {
  pool,
  testConnection,
  initDatabase
}
