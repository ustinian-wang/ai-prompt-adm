import sequelize from '../config/database.js'

/**
 * 创建作品分类关联表
 * 实现作品与分类的多对多关系
 */
async function createWorkCategoryTable() {
  try {
    console.log('开始创建作品分类关联表...')
    
    // 创建 work_category 表
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS work_category (
        id INT AUTO_INCREMENT PRIMARY KEY COMMENT '关联记录ID',
        work_id INT NOT NULL COMMENT '作品ID',
        category_id INT NOT NULL COMMENT '分类ID',
        created_at BIGINT NOT NULL COMMENT '创建时间戳（毫秒）',
        
        -- 索引
        INDEX idx_work_id (work_id),
        INDEX idx_category_id (category_id),
        
        -- 唯一约束，防止重复关联
        UNIQUE KEY unique_work_category (work_id, category_id),
        
        -- 外键约束
        FOREIGN KEY (work_id) REFERENCES work(work_id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作品分类关联表';
    `
    
    await sequelize.query(createTableSQL)
    console.log('✅ 作品分类关联表创建成功')
    
    // 验证表结构
    const [results] = await sequelize.query('DESCRIBE work_category')
    console.log('📋 表结构验证:')
    results.forEach(row => {
      console.log(`  ${row.Field}: ${row.Type} ${row.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${row.Key ? `(${row.Key})` : ''}`)
    })
    
    // 检查索引
    const [indexes] = await sequelize.query('SHOW INDEX FROM work_category')
    console.log('🔍 索引信息:')
    indexes.forEach(index => {
      console.log(`  ${index.Key_name}: ${index.Column_name}`)
    })
    
    console.log('🎉 作品分类关联表创建完成！')
    
  } catch (error) {
    console.error('❌ 创建作品分类关联表失败:', error)
    throw error
  }
}

/**
 * 删除作品分类关联表
 */
async function dropWorkCategoryTable() {
  try {
    console.log('开始删除作品分类关联表...')
    
    await sequelize.query('DROP TABLE IF EXISTS work_category')
    console.log('✅ 作品分类关联表删除成功')
    
  } catch (error) {
    console.error('❌ 删除作品分类关联表失败:', error)
    throw error
  }
}

/**
 * 插入测试数据
 */
async function insertTestData() {
  try {
    console.log('开始插入测试数据...')
    
    // 检查是否有作品和分类数据
    const [works] = await sequelize.query('SELECT work_id FROM work LIMIT 1')
    const [categories] = await sequelize.query('SELECT category_id FROM category LIMIT 1')
    
    if (works.length === 0 || categories.length === 0) {
      console.log('⚠️  没有作品或分类数据，跳过测试数据插入')
      return
    }
    
    const workId = works[0].work_id
    const categoryId = categories[0].category_id
    
    // 插入测试关联
    const insertSQL = `
      INSERT IGNORE INTO work_category (work_id, category_id, created_at) 
      VALUES (?, ?, ?)
    `
    
    await sequelize.query(insertSQL, {
      replacements: [workId, categoryId, Date.now()]
    })
    
    console.log(`✅ 测试数据插入成功: 作品ID ${workId} -> 分类ID ${categoryId}`)
    
  } catch (error) {
    console.error('❌ 插入测试数据失败:', error)
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    const command = process.argv[2]
    
    switch (command) {
      case 'create':
        await createWorkCategoryTable()
        break
      case 'drop':
        await dropWorkCategoryTable()
        break
      case 'test':
        await createWorkCategoryTable()
        await insertTestData()
        break
      default:
        console.log('使用方法:')
        console.log('  node create-work-category-table.js create  # 创建表')
        console.log('  node create-work-category-table.js drop    # 删除表')
        console.log('  node create-work-category-table.js test    # 创建表并插入测试数据')
        break
    }
    
    process.exit(0)
  } catch (error) {
    console.error('脚本执行失败:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { createWorkCategoryTable, dropWorkCategoryTable, insertTestData }
