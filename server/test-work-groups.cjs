const { WorkGroup } = require('./models/index.js');
const { MemGroup } = require('./models/MemGroup.model.js');

async function testWorkGroups() {
  try {
    console.log('=== 测试 WorkGroup.getWorkGroups 方法 ===');
    
    // 先检查是否有数据
    const workGroupCount = await WorkGroup.count();
    const memGroupCount = await MemGroup.count();
    
    console.log('work_group 表记录数:', workGroupCount);
    console.log('mem_group 表记录数:', memGroupCount);
    
    if (workGroupCount === 0) {
      console.log('❌ work_group 表为空，无法测试');
      return;
    }
    
    if (memGroupCount === 0) {
      console.log('❌ mem_group 表为空，无法测试');
      return;
    }
    
    // 获取一个作品分组记录
    const workGroup = await WorkGroup.findOne({
      order: [['wg_created_at', 'DESC']]
    });
    
    console.log('测试用的 work_group 记录:', {
      wg_id: workGroup.wg_id,
      wg_work_id: workGroup.wg_work_id,
      wg_mg_id: workGroup.wg_mg_id,
      wg_mem_id: workGroup.wg_mem_id
    });
    
    // 测试 getWorkGroups 方法
    const result = await WorkGroup.getWorkGroups(workGroup.wg_work_id, workGroup.wg_mem_id);
    
    console.log('getWorkGroups 返回结果:');
    console.log('结果类型:', typeof result);
    console.log('结果长度:', Array.isArray(result) ? result.length : 'N/A');
    console.log('结果内容:', JSON.stringify(result, null, 2));
    
    if (Array.isArray(result) && result.length > 0) {
      console.log('✅ getWorkGroups 方法工作正常');
      console.log('返回的分组数据:');
      result.forEach((group, index) => {
        console.log(`分组 ${index + 1}:`, {
          mg_id: group.mg_id,
          mg_name: group.mg_name,
          mg_mem_id: group.mg_mem_id
        });
      });
    } else {
      console.log('❌ getWorkGroups 方法返回空结果或非数组');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    console.error('错误堆栈:', error.stack);
  }
  
  process.exit(0);
}

testWorkGroups();
