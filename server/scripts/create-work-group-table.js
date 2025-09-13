import { WorkGroup } from '../models/index.js';
import sequelize from '../config/database.js';

async function createWorkGroupTable() {
  try {
    console.log('开始创建 work_group 表...');
    console.log('WorkGroup 模型:', WorkGroup);
    
    // 同步模型到数据库
    console.log('正在同步模型到数据库...');
    await WorkGroup.sync({ force: false });
    
    console.log('work_group 表创建成功！');
    
    // 显示表结构
    console.log('正在获取表结构...');
    const tableInfo = await sequelize.getQueryInterface().describeTable('work_group');
    console.log('\n表结构:');
    console.log(JSON.stringify(tableInfo, null, 2));
    
  } catch (error) {
    console.error('创建 work_group 表失败:', error);
    console.error('错误详情:', error.message);
    console.error('错误堆栈:', error.stack);
    throw error;
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  createWorkGroupTable()
    .then(() => {
      console.log('脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('脚本执行失败:', error);
      process.exit(1);
    });
}

export default createWorkGroupTable;
