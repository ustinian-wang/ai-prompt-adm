import { Sequelize } from 'sequelize'

// MySQL连接配置
const config = {
  host: '42.193.243.30',
  port: 3306,
  username: 'root',
  password: 'fai@508',
  database: 'ai_prompt_admin',
  dialect: 'mysql',
  logging: console.log
}

async function testMySQLConnection() {
  console.log('🔌 测试MySQL数据库连接...')
  console.log('📋 连接信息:')
  console.log(`   - 主机: ${config.host}`)
  console.log(`   - 端口: ${config.port}`)
  console.log(`   - 用户名: ${config.username}`)
  console.log(`   - 数据库: ${config.database}`)
  
  const sequelize = new Sequelize(config)
  
  try {
    // 测试连接
    await sequelize.authenticate()
    console.log('✅ MySQL数据库连接成功！')
    
    // 测试数据库操作
    console.log('🔍 测试数据库操作...')
    
    // 检查数据库是否存在
    const [results] = await sequelize.query('SHOW DATABASES LIKE ?', {
      replacements: [config.database]
    })
    
    if (results.length > 0) {
      console.log(`✅ 数据库 '${config.database}' 存在`)
    } else {
      console.log(`⚠️  数据库 '${config.database}' 不存在，需要先创建`)
    }
    
    // 检查表是否存在
    const [tables] = await sequelize.query('SHOW TABLES')
    console.log('📊 当前数据库中的表:')
    if (tables.length > 0) {
      tables.forEach(table => {
        const tableName = Object.values(table)[0]
        console.log(`   - ${tableName}`)
      })
    } else {
      console.log('   (暂无表)')
    }
    
  } catch (error) {
    console.error('❌ MySQL数据库连接失败:', error.message)
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 提示: 用户名或密码错误')
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 提示: 无法连接到数据库服务器，请检查IP地址和端口')
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 提示: 数据库不存在，请先创建数据库')
    }
    
    return false
  } finally {
    await sequelize.close()
  }
  
  return true
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  testMySQLConnection()
    .then(success => {
      if (success) {
        console.log('🎉 MySQL连接测试完成！')
      } else {
        console.log('❌ MySQL连接测试失败！')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('❌ 测试过程中发生错误:', error)
      process.exit(1)
    })
}

export default testMySQLConnection
