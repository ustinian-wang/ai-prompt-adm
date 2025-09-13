import express from 'express';
import { HttpResult, getReqParam } from '../utils/HttpResult.js';
import { Op } from 'sequelize';
import MemGroup from '../models/MemGroup.model.js';
import Work from '../models/Work.model.js';
import { WorkCategory } from '../models/index.js';
import { memberAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 保护：以下接口均要求会员已登录
router.use(memberAuthMiddleware())

// 列表
async function listHandler(req, res) {
  try {
    const mem_id = parseInt(getReqParam(req, 'mem_id')) || req.member?.id || 0;
    const page = Math.max(1, parseInt(getReqParam(req, 'page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(getReqParam(req, 'limit') || '20')));
    const keyword = (getReqParam(req, 'keyword') || '').trim();
    const visibility = (getReqParam(req, 'visibility') || 'all').trim();

    if (!mem_id) {
      return res.status(401).json(HttpResult.error({ msg: '未登录或缺少会员身份' }));
    }

    const where = { mg_mem_id: mem_id };
    if (keyword) {
      // 简单模糊匹配：name 或 desc
      where[Op.or] = [
        { mg_name: { [Op.like]: `%${keyword}%` } },
        { mg_desc: { [Op.like]: `%${keyword}%` } }
      ];
    }
    if (visibility === 'public') where.mg_is_private = 0;
    if (visibility === 'private') where.mg_is_private = 1;

    const offset = (page - 1) * limit;
    const { rows, count } = await MemGroup.findAndCountAll({
      where,
      order: [ ['mg_sort_order', 'DESC'], ['mg_id', 'DESC'] ],
      offset,
      limit
    });

    return res.status(200).json(HttpResult.success({ list: rows, total: count, page, limit }));
  } catch (error) {
    console.error('mem_group list error:', error);
    return res.status(500).json(HttpResult.error({ msg: '获取分组列表失败' }));
  }
}

router.get('/list', listHandler);
router.post('/list', listHandler);

// 详情
async function detailHandler(req, res) {
  try {
    const mg_id = parseInt(getReqParam(req, 'mg_id')) || 0;
    const mem_id = parseInt(getReqParam(req, 'mem_id')) || req.member?.id || 0;
    if (!mg_id || !mem_id) {
      return res.status(400).json(HttpResult.error({ msg: '缺少 mg_id 或 mem_id' }));
    }
    const entity = await MemGroup.findByPk(mg_id);
    if (!entity || entity.mg_mem_id !== mem_id) {
      return res.status(404).json(HttpResult.error({ msg: '分组不存在' }));
    }
    return res.status(200).json(HttpResult.success(entity));
  } catch (error) {
    console.error('mem_group detail error:', error);
    return res.status(500).json(HttpResult.error({ msg: '获取分组详情失败' }));
  }
}

router.get('/detail', detailHandler);
router.post('/detail', detailHandler);

// 创建
async function createHandler(req, res) {
  try {
    const mem_id = parseInt(getReqParam(req, 'mem_id')) || req.member?.id || 0;
    const name = (getReqParam(req, 'name') || '').trim();
    const desc = (getReqParam(req, 'desc') || '').trim();
    const is_private = parseInt(getReqParam(req, 'is_private'));
    const sort_order = parseInt(getReqParam(req, 'sort_order'));
    const cover_url = (getReqParam(req, 'cover_url') || '').trim();
    const color = (getReqParam(req, 'color') || '').trim();

    if (!mem_id) return res.json({ success: false, msg: '会员ID不能为空' });
    if (!name) return res.json({ success: false, msg: '分组名称不能为空' });
    if (name.length > 50) return res.json({ success: false, msg: '分组名称长度不能超过50个字符' });
    if (desc && desc.length > 255) return res.json({ success: false, msg: '描述长度不能超过255个字符' });
    if (cover_url && !/^https?:\/\/.+/.test(cover_url)) return res.json({ success: false, msg: '封面URL格式不正确' });

    // 唯一校验
    const existed = await MemGroup.findOne({ where: { mg_mem_id: mem_id, mg_name: name } });
    if (existed) return res.json({ success: false, msg: '同名分组已存在' });

    const entity = await MemGroup.create({
      mg_mem_id: mem_id,
      mg_name: name,
      mg_desc: desc || null,
      mg_is_private: Number.isNaN(is_private) ? 1 : (is_private ? 1 : 0),
      mg_sort_order: Number.isNaN(sort_order) ? 0 : sort_order,
      mg_cover_url: cover_url || null,
      mg_color: color || null
    });
    return res.status(200).json(HttpResult.success(entity));
  } catch (error) {
    console.error('mem_group create error:', error);
    return res.status(500).json(HttpResult.error({ msg: '创建分组失败' }));
  }
}

router.get('/create', createHandler);
router.post('/create', createHandler);

// 更新
async function updateHandler(req, res) {
  try {
    const mg_id = parseInt(getReqParam(req, 'mg_id')) || 0;
    const mem_id = parseInt(getReqParam(req, 'mem_id')) || req.member?.id || 0;
    if (!mg_id || !mem_id) return res.status(400).json(HttpResult.error({ msg: '缺少 mg_id 或 mem_id' }));

    const entity = await MemGroup.findByPk(mg_id);
    if (!entity || entity.mg_mem_id !== mem_id) return res.status(404).json(HttpResult.error({ msg: '分组不存在' }));

    const name = (getReqParam(req, 'name') || '').trim();
    const desc = (getReqParam(req, 'desc') || '').trim();
    const cover_url = (getReqParam(req, 'cover_url') || '').trim();
    const color = (getReqParam(req, 'color') || '').trim();
    const is_private_raw = getReqParam(req, 'is_private');
    const sort_order_raw = getReqParam(req, 'sort_order');

    const updates = {};
    if (name) {
      if (name.length > 50) return res.json({ success: false, msg: '分组名称长度不能超过50个字符' });
      const existed = await MemGroup.findOne({ where: { mg_mem_id: mem_id, mg_name: name } });
      if (existed && existed.mg_id !== mg_id) return res.json({ success: false, msg: '同名分组已存在' });
      updates.mg_name = name;
    }
    if (desc) {
      if (desc.length > 255) return res.json({ success: false, msg: '描述长度不能超过255个字符' });
      updates.mg_desc = desc;
    }
    if (cover_url) {
      if (!/^https?:\/\/.+/.test(cover_url)) return res.json({ success: false, msg: '封面URL格式不正确' });
      updates.mg_cover_url = cover_url;
    }
    if (color) updates.mg_color = color;
    if (is_private_raw !== undefined) updates.mg_is_private = parseInt(is_private_raw) ? 1 : 0;
    if (sort_order_raw !== undefined) updates.mg_sort_order = parseInt(sort_order_raw) || 0;

    await entity.update(updates);
    return res.status(200).json(HttpResult.success(entity));
  } catch (error) {
    console.error('mem_group update error:', error);
    return res.status(500).json(HttpResult.error({ msg: '更新分组失败' }));
  }
}

router.get('/update', updateHandler);
router.post('/update', updateHandler);

// 删除
async function deleteHandler(req, res) {
  try {
    const mg_id = parseInt(getReqParam(req, 'mg_id')) || 0;
    const mem_id = parseInt(getReqParam(req, 'mem_id')) || req.member?.id || 0;
    const hard = parseInt(getReqParam(req, 'hard')) || 0;
    if (!mg_id || !mem_id) return res.status(400).json(HttpResult.error({ msg: '缺少 mg_id 或 mem_id' }));

    const entity = await MemGroup.findByPk(mg_id);
    if (!entity || entity.mg_mem_id !== mem_id) return res.status(404).json(HttpResult.error({ msg: '分组不存在' }));

    if (hard === 1) {
      await entity.destroy({ force: true });
    } else {
      await entity.destroy();
    }
    return res.status(200).json(HttpResult.success({ success: true }));
  } catch (error) {
    console.error('mem_group delete error:', error);
    return res.status(500).json(HttpResult.error({ msg: '删除分组失败' }));
  }
}

router.get('/delete', deleteHandler);
router.post('/delete', deleteHandler);

// 获取分组内的作品列表
async function getGroupWorksHandler(req, res) {
  try {
    const mg_id = parseInt(getReqParam(req, 'mg_id')) || 0;
    const mem_id = req.member?.id || 0;
    const page = Math.max(1, parseInt(getReqParam(req, 'page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(getReqParam(req, 'limit') || '20')));
    const keyword = (getReqParam(req, 'keyword') || '').trim();

    if (!mg_id) {
      return res.status(400).json(HttpResult.error({ msg: '缺少分组ID' }));
    }
    if (!mem_id) {
      return res.status(401).json(HttpResult.error({ msg: '未登录或缺少会员身份' }));
    }

    // 验证分组归属
    const group = await MemGroup.findByPk(mg_id);
    if (!group || group.mg_mem_id !== mem_id) {
      return res.status(404).json(HttpResult.error({ msg: '分组不存在' }));
    }

    // 构建查询条件
    const where = { work_status: 1 }; // 只显示已发布的作品
    if (keyword) {
      where[Op.or] = [
        { work_name: { [Op.like]: `%${keyword}%` } },
        { work_desc: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 通过分组ID查找关联的作品
    const offset = (page - 1) * limit;
    const { rows: works, count } = await Work.findAndCountAll({
      where,
      include: [{
        model: WorkCategory,
        as: 'workCategories',
        where: { category_id: mg_id }, // 使用分组ID作为分类ID
        required: true
      }],
      order: [['work_created_at', 'DESC']],
      offset,
      limit
    });

    // 格式化作品数据
    const formattedWorks = works.map(work => ({
      work_id: work.work_id,
      work_name: work.work_name,
      work_desc: work.work_desc,
      work_img_path: work.work_img_path,
      work_created_at: work.work_created_at,
      work_updated_at: work.work_updated_at,
      categoryName: group.mg_name,
      groupInfo: {
        mg_id: group.mg_id,
        mg_name: group.mg_name,
        mg_desc: group.mg_desc
      }
    }));

    return res.status(200).json(HttpResult.success({
      list: formattedWorks,
      total: count,
      page,
      limit,
      groupInfo: {
        mg_id: group.mg_id,
        mg_name: group.mg_name,
        mg_desc: group.mg_desc,
        mg_item_count: group.mg_item_count
      }
    }));
  } catch (error) {
    console.error('获取分组作品列表失败:', error);
    return res.status(500).json(HttpResult.error({ msg: '获取分组作品列表失败' }));
  }
}

router.get('/works', getGroupWorksHandler);
router.post('/works', getGroupWorksHandler);

export default router;


