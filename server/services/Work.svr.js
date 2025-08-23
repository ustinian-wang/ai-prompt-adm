import Work from '../models/Work.model.js';
import workCategoryService from './workCategory.service.js';
import { Op } from 'sequelize';

// 数据转换辅助函数
async function transformWorkData(work) {
  if (!work) return work;
  
  const workData = work.toJSON ? work.toJSON() : work;
  
  // 强制转换JSON字段，确保前端收到正确的数据类型
  if (workData.work_outer_link_list !== null && workData.work_outer_link_list !== undefined) {
    if (typeof workData.work_outer_link_list === 'string') {
      try {
        workData.work_outer_link_list = JSON.parse(workData.work_outer_link_list);
      } catch (e) {
        console.warn('Failed to parse work_outer_link_list:', e);
        workData.work_outer_link_list = [];
      }
    } else if (!Array.isArray(workData.work_outer_link_list)) {
      workData.work_outer_link_list = [];
    }
  } else {
    workData.work_outer_link_list = [];
  }
  
  // 获取作品分类数据 - 通过服务层获取，避免模型耦合
  try {
    const categoryResult = await workCategoryService.getWorkCategories(work.work_id);
    if (categoryResult.code === 200) {
      workData.work_category_list = categoryResult.category_ids || [];
      console.log(`[jser transformWorkData] 作品 ${work.work_id} 的分类ID:`, workData.work_category_list);
    } else {
      workData.work_category_list = [];
      console.log(`[jser transformWorkData] 作品 ${work.work_id} 获取分类失败:`, categoryResult.msg);
    }
  } catch (error) {
    console.warn('Failed to get work category list:', error);
    workData.work_category_list = [];
  }
  
  if (workData.metadata !== null && workData.metadata !== undefined) {
    if (typeof workData.metadata === 'string') {
      try {
        workData.metadata = JSON.parse(workData.metadata);
      } catch (e) {
        console.warn('Failed to parse metadata:', e);
        workData.metadata = {};
      }
    } else if (typeof workData.metadata !== 'object') {
      workData.metadata = {};
    }
  } else {
    workData.metadata = {};
  }
  
  return workData;
}

export function svr_getWorkDetailMock() {
    return { work_name: 'test' };
}

export async function svr_getWorkDetailById(workId) {
    try {
        const work = await Work.findByPk(workId);
        return await transformWorkData(work);
    } catch (error) {
        console.error('根据ID获取作品失败:', error);
        throw error;
    }
}

export async function svr_createWorkDetail(workData) {
    try {
        const newWork = await Work.create(workData);
        return await transformWorkData(newWork);
    } catch (error) {
        console.error('创建作品失败:', error);
        throw error;
    }
}

export async function svr_updateWorkDetail(workId, workData) {
    const work = await Work.findByPk(workId);
    if(work){
      await work.update(workData);
      return await transformWorkData(work);
    }
    return work;
}

export async function svr_getWorkList(options) {
    try {
        const { user_id, work_id, work_name, work_status, page = 1, pageSize = 10 } = options;
        const whereClause = {};
        if (user_id) whereClause.user_id = user_id;
        if (work_id) whereClause.work_id = work_id;
        if (work_name) whereClause.work_name = { [Op.like]: `%${work_name}%` };
        if (work_status) whereClause.work_status = work_status;

        let find_query = {
            where: whereClause,
            limit: parseInt(pageSize),
            offset: (parseInt(page) - 1) * parseInt(pageSize),
            order: [['work_created_at', 'DESC']]
        };
        // console.log('[jser svr_getWorkList] find_query', find_query)
        let find_res = await Work.findAndCountAll(find_query);
        const { count, rows } = find_res;
        // console.log('[jser svr_getWorkList] find_res', find_res)
        // return { list: rows.map(row => row.dataValues), total: count, page: parseInt(page), pageSize: parseInt(pageSize) };
        let list = await Promise.all(rows.map(async row => {
            try {
                return await transformWorkData(row);
            } catch (error) {
                console.warn('Failed to transform work data:', error);
                // 返回基本数据，不包含分类信息
                const basicData = row.toJSON ? row.toJSON() : row;
                basicData.work_category_list = [];
                return basicData;
            }
        }));
        // console.log('[jser svr_getWorkList] list', list)
        return { list, total: count, page: parseInt(page), pageSize: parseInt(pageSize) };
    } catch (error) {
        console.error('获取作品列表失败:', error);
        throw error;
    }
}

export async function svr_deleteWork(workId) {
    try {
        const work = await Work.findByPk(workId);
        if (!work) {
            throw new Error('作品不存在');
        }
        await work.destroy();
        return true;
    } catch (error) {
        console.error('删除作品失败:', error);
        throw error;
    }
} 