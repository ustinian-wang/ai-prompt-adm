import { WorkGroup, Work, MemGroup } from '../models/index.js';
import { Op } from 'sequelize';

class WorkGroupService {
  /**
   * 采集作品到分组
   * @param {number} workId - 作品ID
   * @param {number} groupId - 分组ID
   * @param {number} memId - 会员ID
   * @returns {Promise<Object>} 采集结果
   */
  static async collectWork(workId, groupId, memId) {
    try {
      // 验证作品是否存在
      const work = await Work.findByPk(workId);
      if (!work) {
        throw new Error('作品不存在');
      }
      
      // 验证分组是否存在且属于当前会员
      const group = await MemGroup.findByPk(groupId);
      if (!group || group.mg_mem_id !== memId) {
        throw new Error('分组不存在或无权限');
      }
      
      // 检查是否已经采集过
      const existing = await WorkGroup.findOne({
        where: {
          wg_work_id: workId,
          wg_mg_id: groupId
        }
      });
      
      if (existing) {
        throw new Error('该作品已经在此分组中');
      }
      
      // 创建采集记录
      const workGroup = await WorkGroup.create({
        wg_work_id: workId,
        wg_mg_id: groupId,
        wg_mem_id: memId,
        wg_collected_at: Date.now()
      });
      
      // 更新分组的作品数量
      await MemGroup.increment('mg_item_count', {
        where: { mg_id: groupId }
      });
      
      return workGroup;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * 从分组中移除作品
   * @param {number} workId - 作品ID
   * @param {number} groupId - 分组ID
   * @param {number} memId - 会员ID
   * @returns {Promise<number>} 删除的记录数
   */
  static async removeWork(workId, groupId, memId) {
    try {
      const result = await WorkGroup.destroy({
        where: {
          wg_work_id: workId,
          wg_mg_id: groupId,
          wg_mem_id: memId
        }
      });
      
      if (result === 0) {
        throw new Error('该作品不在此分组中');
      }
      
      // 更新分组的作品数量
      await MemGroup.decrement('mg_item_count', {
        where: { mg_id: groupId }
      });
      
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * 获取分组下的作品列表
   * @param {number} groupId - 分组ID
   * @param {number} memId - 会员ID
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 作品列表和分页信息
   */
  static async getGroupWorks(groupId, memId, options = {}) {
    const {
      page = 1,
      limit = 20,
      orderBy = 'wg_collected_at',
      order = 'DESC',
      search = ''
    } = options;
    
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {
      wg_mg_id: groupId,
      wg_mem_id: memId
    };
    
    // 构建包含条件
    const include = [
      {
        model: Work,
        as: 'work',
        attributes: ['work_id', 'work_name', 'work_desc', 'work_img_path', 'work_status', 'metadata', 'work_created_at', 'work_updated_at'],
        where: search ? {
          [Op.or]: [
            { work_name: { [Op.like]: `%${search}%` } },
            { work_desc: { [Op.like]: `%${search}%` } }
          ]
        } : undefined,
        required: false
      }
    ];
    
    const { count, rows } = await WorkGroup.findAndCountAll({
      where,
      include,
      order: [[orderBy, order]],
      limit,
      offset,
      distinct: true
    });
    
    return {
      works: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }
  
  /**
   * 获取作品所在的分组列表
   * @param {number} workId - 作品ID
   * @param {number} memId - 会员ID
   * @returns {Promise<Array>} 分组列表
   */
  static async getWorkGroups(workId, memId) {
    const rows = await WorkGroup.findAll({
      where: {
        wg_work_id: workId,
        wg_mem_id: memId
      },
      include: [
        {
          model: MemGroup,
          as: 'memGroup',
          attributes: ['mg_id', 'mg_name', 'mg_desc', 'mg_color', 'mg_cover_url', 'mg_item_count']
        }
      ],
      order: [['wg_collected_at', 'DESC']]
    });
    
    return rows;
  }
  
  /**
   * 检查作品是否在指定分组中
   * @param {number} workId - 作品ID
   * @param {number} groupId - 分组ID
   * @param {number} memId - 会员ID
   * @returns {Promise<boolean>} 是否在分组中
   */
  static async isWorkInGroup(workId, groupId, memId) {
    const result = await WorkGroup.findOne({
      where: {
        wg_work_id: workId,
        wg_mg_id: groupId,
        wg_mem_id: memId
      }
    });
    
    return !!result;
  }
  
  /**
   * 获取会员采集的所有作品（跨分组）
   * @param {number} memId - 会员ID
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 作品列表和分页信息
   */
  static async getMemberCollectedWorks(memId, options = {}) {
    const {
      page = 1,
      limit = 20,
      orderBy = 'wg_collected_at',
      order = 'DESC',
      search = '',
      groupId = null
    } = options;
    
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {
      wg_mem_id: memId
    };
    
    if (groupId) {
      where.wg_mg_id = groupId;
    }
    
    // 构建包含条件
    const include = [
      {
        model: Work,
        as: 'work',
        attributes: ['work_id', 'work_name', 'work_desc', 'work_img_path', 'work_status', 'metadata', 'work_created_at', 'work_updated_at'],
        where: search ? {
          [Op.or]: [
            { work_name: { [Op.like]: `%${search}%` } },
            { work_desc: { [Op.like]: `%${search}%` } }
          ]
        } : undefined,
        required: false
      },
      {
        model: MemGroup,
        as: 'memGroup',
        attributes: ['mg_id', 'mg_name', 'mg_color']
      }
    ];
    
    const { count, rows } = await WorkGroup.findAndCountAll({
      where,
      include,
      order: [[orderBy, order]],
      limit,
      offset,
      distinct: true
    });
    
    return {
      works: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }
  
  /**
   * 批量采集作品到分组
   * @param {Array<number>} workIds - 作品ID列表
   * @param {number} groupId - 分组ID
   * @param {number} memId - 会员ID
   * @returns {Promise<Object>} 批量采集结果
   */
  static async batchCollectWorks(workIds, groupId, memId) {
    try {
      // 验证分组是否存在且属于当前会员
      const group = await MemGroup.findByPk(groupId);
      if (!group || group.mg_mem_id !== memId) {
        throw new Error('分组不存在或无权限');
      }
      
      const results = [];
      const errors = [];
      
      for (const workId of workIds) {
        try {
          const workGroup = await this.collectWork(workId, groupId, memId);
          results.push(workGroup);
        } catch (error) {
          errors.push({ workId, error: error.message });
        }
      }
      
      return {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * 批量从分组中移除作品
   * @param {Array<number>} workIds - 作品ID列表
   * @param {number} groupId - 分组ID
   * @param {number} memId - 会员ID
   * @returns {Promise<Object>} 批量移除结果
   */
  static async batchRemoveWorks(workIds, groupId, memId) {
    try {
      const results = [];
      const errors = [];
      
      for (const workId of workIds) {
        try {
          const result = await this.removeWork(workId, groupId, memId);
          results.push({ workId, result });
        } catch (error) {
          errors.push({ workId, error: error.message });
        }
      }
      
      return {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * 获取分组的统计信息
   * @param {number} groupId - 分组ID
   * @param {number} memId - 会员ID
   * @returns {Promise<Object>} 统计信息
   */
  static async getGroupStats(groupId, memId) {
    try {
      // 验证分组是否属于当前会员
      const group = await MemGroup.findByPk(groupId);
      if (!group || group.mg_mem_id !== memId) {
        throw new Error('分组不存在或无权限');
      }
      
      // 获取作品总数
      const totalWorks = await WorkGroup.count({
        where: {
          wg_mg_id: groupId,
          wg_mem_id: memId
        }
      });
      
      // 获取最近采集的作品
      const recentWorks = await WorkGroup.findAll({
        where: {
          wg_mg_id: groupId,
          wg_mem_id: memId
        },
        include: [
          {
            model: Work,
            as: 'work',
            attributes: ['work_id', 'work_name', 'work_img_path']
          }
        ],
        order: [['wg_collected_at', 'DESC']],
        limit: 5
      });
      
      return {
        groupId,
        groupName: group.mg_name,
        totalWorks,
        recentWorks
      };
    } catch (error) {
      throw error;
    }
  }
}

export default WorkGroupService;
