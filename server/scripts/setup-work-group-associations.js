import { WorkGroup, Work, MemGroup } from '../models/index.js';

async function setupAssociations() {
  try {
    console.log('开始设置 WorkGroup 模型关联...');
    
    // 设置 WorkGroup 与 Work 的关联
    WorkGroup.belongsTo(Work, {
      foreignKey: 'wg_work_id',
      targetKey: 'work_id',
      as: 'work'
    });
    
    Work.hasMany(WorkGroup, {
      foreignKey: 'wg_work_id',
      sourceKey: 'work_id',
      as: 'workGroups'
    });
    
    // 设置 WorkGroup 与 MemGroup 的关联
    WorkGroup.belongsTo(MemGroup, {
      foreignKey: 'wg_mg_id',
      targetKey: 'mg_id',
      as: 'memGroup'
    });
    
    MemGroup.hasMany(WorkGroup, {
      foreignKey: 'wg_mg_id',
      sourceKey: 'mg_id',
      as: 'workGroups'
    });
    
    console.log('WorkGroup 模型关联设置完成！');
    
  } catch (error) {
    console.error('设置 WorkGroup 模型关联失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  setupAssociations()
    .then(() => {
      console.log('脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('脚本执行失败:', error);
      process.exit(1);
    });
}

export default setupAssociations;
