import express from 'express';
import { WorkGroup } from '../models/index.js';
import { memberAuthMiddleware } from '../middleware/auth.js';
import { HttpResult } from '../utils/HttpResult.js';
import sequelize from '../config/database.js';

const router = express.Router();

// 测试端点
router.get('/test', memberAuthMiddleware(), (req, res) => {
  console.log('测试端点被调用');
  res.json({ message: 'WorkGroup API 正常工作' });
});

// 采集作品到分组 - 支持GET和POST
router.get('/collect', memberAuthMiddleware(), collectHandler);
router.post('/collect', memberAuthMiddleware(), collectHandler);

// 从分组中移除作品 - 支持GET和POST
router.get('/remove', memberAuthMiddleware(), removeHandler);
router.post('/remove', memberAuthMiddleware(), removeHandler);

// 获取分组下的作品列表
router.get('/group/:groupId/works', memberAuthMiddleware(), async (req, res) => {
  try {
    const { groupId } = req.params;
    const memId = req.member.id;
    const { page = 1, limit = 20, orderBy = 'wg_collected_at', order = 'DESC' } = req.query;
    
    // 验证分组是否属于当前会员
    const { MemGroup } = await import('../models/index.js');
    const group = await MemGroup.findByPk(groupId);
    if (!group || group.mg_mem_id !== memId) {
      return res.json(HttpResult.error('分组不存在或无权限'));
    }
    
    const result = await WorkGroup.getGroupWorks(groupId, memId, {
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order
    });
    
    res.json(HttpResult.success(result));
  } catch (error) {
    console.error('获取分组作品失败:', HttpResult.error);
    res.json(HttpResult.error(HttpResult.error.message || '获取失败'));
  }
});

// 获取作品所在的分组列表
router.get('/work/:workId/groups', memberAuthMiddleware(), async (req, res) => {
  try {
    const { workId } = req.params;
    const memId = req.member.id;
    
    const groups = await WorkGroup.getWorkGroups(workId, memId);
    
    res.json(HttpResult.success(groups));
  } catch (error) {
    console.error('获取作品分组失败:', HttpResult.error);
    res.json(HttpResult.error(HttpResult.error.message || '获取失败'));
  }
});

// 检查作品是否在指定分组中
router.get('/check/:workId/:groupId', memberAuthMiddleware(), async (req, res) => {
  try {
    const { workId, groupId } = req.params;
    const memId = req.member.id;
    
    const isInGroup = await WorkGroup.isWorkInGroup(workId, groupId, memId);
    
    res.json(HttpResult.success({ isInGroup }));
  } catch (error) {
    console.error('检查作品分组失败:', HttpResult.error);
    res.json(HttpResult.error(HttpResult.error.message || '检查失败'));
  }
});

// 获取会员采集的所有作品
router.get('/member/works', memberAuthMiddleware(), async (req, res) => {
  try {
    const memId = req.member.id;
    const { page = 1, limit = 20, orderBy = 'wg_collected_at', order = 'DESC' } = req.query;
    
    const result = await WorkGroup.getMemberCollectedWorks(memId, {
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order
    });
    
    res.json(HttpResult.success(result));
  } catch (error) {
    console.error('获取会员采集作品失败:', HttpResult.error);
    res.json(HttpResult.error(HttpResult.error.message || '获取失败'));
  }
});

// 批量采集作品到分组 - 支持GET和POST
router.get('/batch-collect', memberAuthMiddleware(), batchCollectHandler);
router.post('/batch-collect', memberAuthMiddleware(), batchCollectHandler);

// 批量从分组中移除作品 - 支持GET和POST
router.get('/batch-remove', memberAuthMiddleware(), batchRemoveHandler);
router.post('/batch-remove', memberAuthMiddleware(), batchRemoveHandler);

// 将作品采集到多个分组 - 支持GET和POST
router.get('/collect-to-groups', memberAuthMiddleware(), collectToGroupsHandler);
router.post('/collect-to-groups', memberAuthMiddleware(), collectToGroupsHandler);

// 采集到多个分组的处理函数
async function collectToGroupsHandler(req, res) {
  console.log(`收到${req.method}采集请求:`, req.method === 'GET' ? req.query : req.body);
  try {
    const memId = req.member.id;
    let workId, groupIds;
    
    // 根据请求方法获取参数
    if (req.method === 'GET') {
      const { workId: queryWorkId, groupIds: queryGroupIds } = req.query;
      workId = queryWorkId ? parseInt(queryWorkId) : null;
      
      // 解析groupIds参数（可能是逗号分隔的字符串）
      let parsedGroupIds = [];
      if (queryGroupIds) {
        if (typeof queryGroupIds === 'string') {
          parsedGroupIds = queryGroupIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        } else if (Array.isArray(queryGroupIds)) {
          parsedGroupIds = queryGroupIds.map(id => parseInt(id)).filter(id => !isNaN(id));
        }
      }
      groupIds = parsedGroupIds;
    } else {
      // POST请求从body获取参数
      const { workId: bodyWorkId, groupIds: bodyGroupIds } = req.body;
      workId = bodyWorkId;
      groupIds = bodyGroupIds;
    }
    
    console.log('处理参数:', { workId, groupIds, memId });
    
    if (!workId || !groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
      return res.json(HttpResult.error('作品ID和分组ID列表不能为空'));
    }
    
    // 调用通用处理函数
    try {
      // 验证分组是否都属于当前会员
      console.log('开始验证分组权限...');
      const { MemGroup } = await import('../models/index.js');
      const groups = await MemGroup.findAll({
        where: {
          mg_id: groupIds,
          mg_mem_id: memId
        }
      });
      
      console.log('找到的分组:', groups.length, '请求的分组:', groupIds.length);
      
      if (groups.length !== groupIds.length) {
        return res.json(HttpResult.error('部分分组不存在或无权限'));
      }
      
      const results = [];
      const errors = [];
      
      // 使用事务确保数据一致性
      const transaction = await sequelize.transaction();
      
      try {
        for (const groupId of groupIds) {
          try {
            const workGroup = await WorkGroup.collectWork(workId, groupId, memId, { transaction });
            results.push(workGroup);
            
            // 更新分组的作品数量
            await MemGroup.increment('mg_item_count', {
              where: { mg_id: groupId },
              transaction
            });
          } catch (error) {
            errors.push({ groupId, error: error.message });
            // 如果某个分组采集失败，回滚整个事务
            await transaction.rollback();
            return res.json(HttpResult.error(`采集失败: ${error.message}`));
          }
        }
        
        await transaction.commit();
        
        res.json(HttpResult.success({
          successCount: results.length,
          errorCount: errors.length,
          success: results,
          errors: errors
        }, `成功采集到 ${results.length} 个分组`));
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('采集作品到多个分组失败:', error);
      res.json(HttpResult.error({
        message: error.message || '采集失败'
      }));
    }
  } catch (error) {
    console.error(`${req.method}采集作品到多个分组失败:`, error);
    res.json(HttpResult.error({
      message: error.message || '采集失败'
    }));
  }
}


// 采集作品到分组的处理函数
async function collectHandler(req, res) {
  console.log(`收到${req.method}采集请求:`, req.method === 'GET' ? req.query : req.body);
  try {
    const memId = req.member.id;
    let workId, groupId;
    
    // 根据请求方法获取参数
    if (req.method === 'GET') {
      const { workId: queryWorkId, groupId: queryGroupId } = req.query;
      workId = queryWorkId ? parseInt(queryWorkId) : null;
      groupId = queryGroupId ? parseInt(queryGroupId) : null;
    } else {
      // POST请求从body获取参数
      const { workId: bodyWorkId, groupId: bodyGroupId } = req.body;
      workId = bodyWorkId;
      groupId = bodyGroupId;
    }
    
    console.log('处理参数:', { workId, groupId, memId });
    
    if (!workId || !groupId) {
      return res.json(HttpResult.error('作品ID和分组ID不能为空'));
    }
    
    // 验证分组是否属于当前会员
    const { MemGroup } = await import('../models/index.js');
    const group = await MemGroup.findByPk(groupId);
    if (!group || group.mg_mem_id !== memId) {
      return res.json(HttpResult.error('分组不存在或无权限'));
    }
    
    // 采集作品
    const workGroup = await WorkGroup.collectWork(workId, groupId, memId);
    
    // 更新分组的作品数量
    await MemGroup.increment('mg_item_count', {
      where: { mg_id: groupId }
    });
    
    res.json(HttpResult.success(workGroup, '采集成功'));
  } catch (error) {
    console.error(`${req.method}采集作品失败:`, error);
    res.json(HttpResult.error(error.message || '采集失败'));
  }
}

// 从分组中移除作品的处理函数
async function removeHandler(req, res) {
  console.log(`收到${req.method}移除请求:`, req.method === 'GET' ? req.query : req.body);
  try {
    const memId = req.member.id;
    let workId, groupId;
    
    // 根据请求方法获取参数
    if (req.method === 'GET') {
      const { workId: queryWorkId, groupId: queryGroupId } = req.query;
      workId = queryWorkId ? parseInt(queryWorkId) : null;
      groupId = queryGroupId ? parseInt(queryGroupId) : null;
    } else {
      // POST请求从body获取参数
      const { workId: bodyWorkId, groupId: bodyGroupId } = req.body;
      workId = bodyWorkId;
      groupId = bodyGroupId;
    }
    
    console.log('处理参数:', { workId, groupId, memId });
    
    if (!workId || !groupId) {
      return res.json(HttpResult.error('作品ID和分组ID不能为空'));
    }
    
    // 移除作品
    const result = await WorkGroup.removeWork(workId, groupId, memId);
    
    // 更新分组的作品数量
    const { MemGroup } = await import('../models/index.js');
    await MemGroup.decrement('mg_item_count', {
      where: { mg_id: groupId }
    });
    
    res.json(HttpResult.success(result, '移除成功'));
  } catch (error) {
    console.error(`${req.method}移除作品失败:`, error);
    res.json(HttpResult.error(error.message || '移除失败'));
  }
}

// 批量采集作品到分组的处理函数
async function batchCollectHandler(req, res) {
  console.log(`收到${req.method}批量采集请求:`, req.method === 'GET' ? req.query : req.body);
  try {
    const memId = req.member.id;
    let workIds, groupId;
    
    // 根据请求方法获取参数
    if (req.method === 'GET') {
      const { workIds: queryWorkIds, groupId: queryGroupId } = req.query;
      groupId = queryGroupId ? parseInt(queryGroupId) : null;
      
      // 解析workIds参数（可能是逗号分隔的字符串）
      let parsedWorkIds = [];
      if (queryWorkIds) {
        if (typeof queryWorkIds === 'string') {
          parsedWorkIds = queryWorkIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        } else if (Array.isArray(queryWorkIds)) {
          parsedWorkIds = queryWorkIds.map(id => parseInt(id)).filter(id => !isNaN(id));
        }
      }
      workIds = parsedWorkIds;
    } else {
      // POST请求从body获取参数
      const { workIds: bodyWorkIds, groupId: bodyGroupId } = req.body;
      workIds = bodyWorkIds;
      groupId = bodyGroupId;
    }
    
    console.log('处理参数:', { workIds, groupId, memId });
    
    if (!workIds || !Array.isArray(workIds) || workIds.length === 0 || !groupId) {
      return res.json(HttpResult.error('作品ID列表和分组ID不能为空'));
    }
    
    // 验证分组是否属于当前会员
    const { MemGroup } = await import('../models/index.js');
    const group = await MemGroup.findByPk(groupId);
    if (!group || group.mg_mem_id !== memId) {
      return res.json(HttpResult.error('分组不存在或无权限'));
    }
    
    const results = [];
    const errors = [];
    
    for (const workId of workIds) {
      try {
        const workGroup = await WorkGroup.collectWork(workId, groupId, memId);
        results.push(workGroup);
      } catch (error) {
        errors.push({ workId, error: error.message });
      }
    }
    
    // 更新分组的作品数量
    await MemGroup.increment('mg_item_count', {
      by: results.length,
      where: { mg_id: groupId }
    });
    
    res.json(HttpResult.success({
      success: results,
      errors: errors
    }, `成功采集 ${results.length} 个作品`));
  } catch (error) {
    console.error(`${req.method}批量采集作品失败:`, error);
    res.json(HttpResult.error(error.message || '批量采集失败'));
  }
}

// 批量从分组中移除作品的处理函数
async function batchRemoveHandler(req, res) {
  console.log(`收到${req.method}批量移除请求:`, req.method === 'GET' ? req.query : req.body);
  try {
    const memId = req.member.id;
    let workIds, groupId;
    
    // 根据请求方法获取参数
    if (req.method === 'GET') {
      const { workIds: queryWorkIds, groupId: queryGroupId } = req.query;
      groupId = queryGroupId ? parseInt(queryGroupId) : null;
      
      // 解析workIds参数（可能是逗号分隔的字符串）
      let parsedWorkIds = [];
      if (queryWorkIds) {
        if (typeof queryWorkIds === 'string') {
          parsedWorkIds = queryWorkIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        } else if (Array.isArray(queryWorkIds)) {
          parsedWorkIds = queryWorkIds.map(id => parseInt(id)).filter(id => !isNaN(id));
        }
      }
      workIds = parsedWorkIds;
    } else {
      // POST请求从body获取参数
      const { workIds: bodyWorkIds, groupId: bodyGroupId } = req.body;
      workIds = bodyWorkIds;
      groupId = bodyGroupId;
    }
    
    console.log('处理参数:', { workIds, groupId, memId });
    
    if (!workIds || !Array.isArray(workIds) || workIds.length === 0 || !groupId) {
      return res.json(HttpResult.error('作品ID列表和分组ID不能为空'));
    }
    
    const results = [];
    const errors = [];
    
    for (const workId of workIds) {
      try {
        const result = await WorkGroup.removeWork(workId, groupId, memId);
        results.push({ workId, result });
      } catch (error) {
        errors.push({ workId, error: error.message });
      }
    }
    
    // 更新分组的作品数量
    const { MemGroup } = await import('../models/index.js');
    await MemGroup.decrement('mg_item_count', {
      by: results.length,
      where: { mg_id: groupId }
    });
    
    res.json(HttpResult.success({
      success: results,
      errors: errors
    }, `成功移除 ${results.length} 个作品`));
  } catch (error) {
    console.error(`${req.method}批量移除作品失败:`, error);
    res.json(HttpResult.error(error.message || '批量移除失败'));
  }
}
export default router;
