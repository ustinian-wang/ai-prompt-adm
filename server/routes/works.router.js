import express from 'express'
import { HttpResult } from '../utils/HttpResult.js'
import { svr_getWorkDetailById, svr_getWorkList, svr_deleteWork } from '../services/Work.svr.js'
import { getUid } from '../utils/uid.js'
import { authMiddleware, userCheckMiddleware, memberAuthMiddleware } from '../middleware/index.js'
import Work from '../models/Work.model.js'
import workCategoryService from '../services/workCategory.service.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import OssFile from '../models/OssFile.model.js'

const router = express.Router()


// 获取作品列表（公开/会员均可访问）
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, user_id, work_status, work_name } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };
    
    if (user_id) options.user_id = parseInt(user_id);
    if (work_status) options.work_status = work_status;
    if (work_name) options.work_name = work_name;
    
    const result = await Work.getList(options);
    res.status(200).json(HttpResult.success(result));
  } catch (error) {
    console.error('获取作品列表失败:', error);
    res.status(500).json(HttpResult.error({ msg: '获取作品列表失败' }));
  }
})

/**
 * @description 获取作品详情
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getWorkDetailHandler(req, res) {
  let { id } = req.query;
  id = parseInt(id) || 0;
  if (!id) {
    res.status(400).json(HttpResult.error({ msg: 'id is required' }))
    return
  };
  // let mock_work = {
  //   user_id: req?.user?.id || 0,
  //   work_id: id,
  //   work_name: 'work_name_test',
  //   work_description: 'work_description_test',
  //   work_image: 'work_image_test',
  //   work_prompt_cn: "work_prompt_cn_test",
  //   work_prompt_en: "work_prompt_en_test",
  //   work_outer_link_list: [
  //     {
  //       name: 'work_outer_link_list_name_test',
  //       url: 'work_outer_link_list_url_test'
  //     }
  //   ],
  // }
  let work = await svr_getWorkDetailById(id);
  if(work){
    // 将相对路径转为完整URL，带上当前请求域名与端口
    try {
      const base = `${req.protocol}://${req.get('host')}`
      if (work.work_img_path && typeof work.work_img_path === 'string' && work.work_img_path.startsWith('/')) {
        work.work_img_path = base + work.work_img_path
      }
    } catch (_) {}
    res.status(200).json(HttpResult.success({ data: work }));
  }else{
    res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
  }
  // res.status(200).json(HttpResult.success({ data: work }))
}

router.get('/getWorkDetail', authMiddleware(), getWorkDetailHandler)
router.post('/getWorkDetail', authMiddleware(), getWorkDetailHandler)


async function upsertWorkHandler(req, res) {
  let work_info = req.body;
  console.log('[jser upsertWorkHandler] work_info', work_info)
  if(!work_info.work_name){
    res.status(200).json(HttpResult.error({ msg: '作品名称不能为空' }))
    return
  }
  console.log('[jser upsertWorkHandler] req.user', req.user)
  work_info.user_id = req.user.id;

  // 提取分类ID列表，避免传递给Work模型
  const categoryIds = work_info.work_category_list || [];
  delete work_info.work_category_list; // 从work_info中移除，避免保存到work表

  let createdWork = null;
  
  if(work_info.work_id && work_info.work_id !== 'unknown'){
    // 更新现有作品
    const work = await Work.findByPk(work_info.work_id);
    if (!work) {
        res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
        return;
    }
    await work.update(work_info);
    createdWork = work;
  }else{
    // 创建新作品
    createdWork = await Work.create(work_info);
  }

  // 处理分类关联 - 通过服务层处理，保持模型解耦
  try {
    const categoryResult = await workCategoryService.setWorkCategories(createdWork.work_id, categoryIds);
    if (categoryResult.code === 200) {
      console.log(`[jser upsertWorkHandler] 已设置作品 ${createdWork.work_id} 的分类:`, categoryIds);
    } else {
      console.error('[jser upsertWorkHandler] 设置分类失败:', categoryResult.msg);
    }
  } catch (error) {
    console.error('[jser upsertWorkHandler] 设置分类异常:', error);
    // 分类设置失败不影响作品保存，只记录日志
  }

  // 如果提交了封面文件ID，则将对象键写入作品（若存在）
  try {
    const coverFileId = parseInt(work_info.work_img_file_id) || 0
    if (coverFileId > 0) {
      const fileRec = await OssFile.findByPk(coverFileId)
      if (fileRec && fileRec.object_key) {
        await createdWork.update({ work_img_path: fileRec.object_key })
      }
    }
  } catch(e) {
    console.warn('set cover by file_id failed:', e.message)
  }

  // 获取更新后的作品信息
  let now_work = await svr_getWorkDetailById(createdWork.work_id);

  res.status(200).json(HttpResult.success({
    data: now_work
  }))
}
router.get('/upsertWork', authMiddleware(), upsertWorkHandler)
// 后台账号（管理员/用户）可管理
router.post('/upsertWork', authMiddleware(), upsertWorkHandler)

// ==================== 接入通用OssFile：作品封面上传 ====================
function resolveOssBaseDir() {
  const rootDir = path.join(process.cwd(), 'uploads/oss')
  const serverDir = path.join(process.cwd(), 'server', 'uploads', 'oss')
  if (fs.existsSync(rootDir)) return rootDir
  if (fs.existsSync(serverDir)) return serverDir
  fs.mkdirSync(rootDir, { recursive: true })
  return rootDir
}
const ossBaseDir = resolveOssBaseDir()

function makeObjectKey(originalName) {
  const ext = path.extname(originalName) || ''
  const now = new Date()
  const yyyy = String(now.getFullYear())
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const id = uuidv4().replace(/-/g, '')
  return `${yyyy}/${mm}/${dd}/${id}${ext}`
}

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

async function uploadCoverHandler(req, res) {
  try {
    const file = req.file
    const workId = parseInt(req.body.work_id || req.body.workId || '0') || 0
    if (!file) return res.status(400).json(HttpResult.error({ msg: '缺少文件' }))
    if (!workId) return res.status(400).json(HttpResult.error({ msg: '缺少作品ID' }))

    const work = await Work.findByPk(workId)
    if (!work) return res.status(404).json(HttpResult.error({ msg: '作品不存在' }))

    const objectKey = makeObjectKey(file.originalname)
    const targetPath = path.join(ossBaseDir, objectKey)
    const dir = path.dirname(targetPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(targetPath, file.buffer)

    const baseUrl = `${req.protocol}://${req.get('host')}`
    const url = `${baseUrl}/api/ossFile/object/${encodeURIComponent(objectKey)}`
    const entity = await OssFile.create({
      object_key: objectKey,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype || 'application/octet-stream',
      url,
      created_by: req.user?.id || null
    })

    // 仅存对象键到 work_img_path（用作key），对外再拼URL
    await work.update({ work_img_path: entity.object_key })

    return res.status(200).json(HttpResult.success({
      data: {
        work_id: work.work_id,
        oss_file: entity,
        work_img_path: url
      }
    }))
  } catch (e) {
    if (e && e.name === 'MulterError' && e.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(HttpResult.error({ msg: '文件大小超过限制（最大10MB）' }))
    }
    console.error('uploadCover error:', e)
    return res.status(500).json(HttpResult.error({ msg: '上传失败' }))
  }
}

router.post('/uploadCover', authMiddleware(), upload.single('file'), uploadCoverHandler)

async function getWorkListHandler(req, res) {
  let user = req.user;
  let { work_name, work_status, work_type, category } = req.query;
  work_name = work_name || '';
  work_status = work_status || '';
  work_type = work_type || '';
  category = category || '';

  let work_list = await svr_getWorkList({
    user_id: user.id,
    work_name,
    work_status,
    work_type,
    category
  });
  res.status(200).json(HttpResult.success({
    data: work_list
  }))
}
router.get('/getWorkList', authMiddleware(), getWorkListHandler)
router.post('/getWorkList', authMiddleware(), getWorkListHandler)

async function deleteWorkHandler(req, res) {
  let { id } = req.query;
  id = parseInt(id) || 0;
  console.log('[jser deleteWorkHandler] id', id, req.query);
  if(id === undefined){
    res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
    return
  }

  try {
    const work = await Work.findByPk(id);
    if(work){
      await svr_deleteWork(id);
      res.status(200).json(HttpResult.success({
        msg: "删除成功"
      }))
    }else{
      res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
    }
  } catch (error) {
    console.error('删除作品失败:', error);
    res.status(200).json(HttpResult.error({ msg: '删除失败' }))
  }
}
router.get('/deleteWork', authMiddleware(), userCheckMiddleware(), deleteWorkHandler)
router.post('/deleteWork', authMiddleware(), userCheckMiddleware(), deleteWorkHandler)

// ==================== 作品分类管理接口 ====================

/**
 * 为作品设置分类
 */
async function setWorkCategoriesHandler(req, res) {
  try {
    const { work_id, category_ids } = req.body
    const workId = parseInt(work_id) || 0
    const categoryIds = Array.isArray(category_ids) ? category_ids.map(id => parseInt(id)) : []
    
    if (!workId) {
      res.status(200).json(HttpResult.error({ msg: '作品ID不能为空' }))
      return
    }
    
    const result = await workCategoryService.setWorkCategories(workId, categoryIds)
    res.status(200).json(result)
  } catch (error) {
    console.error('设置作品分类失败:', error)
    res.status(500).json(HttpResult.error({ msg: '设置作品分类失败' }))
  }
}
router.get('/setWorkCategories', authMiddleware(), setWorkCategoriesHandler)
router.post('/setWorkCategories', authMiddleware(), setWorkCategoriesHandler)

/**
 * 获取作品的所有分类
 */
async function getWorkCategoriesHandler(req, res) {
  try {
    const { work_id } = req.query
    const workId = parseInt(work_id) || 0
    
    if (!workId) {
      res.status(200).json(HttpResult.error({ msg: '作品ID不能为空' }))
      return
    }
    
    const result = await workCategoryService.getWorkCategories(workId)
    res.status(200).json(result)
  } catch (error) {
    console.error('获取作品分类失败:', error)
    res.status(500).json(HttpResult.error({ msg: '获取作品分类失败' }))
  }
}
router.get('/getWorkCategories', authMiddleware(), getWorkCategoriesHandler)
router.post('/getWorkCategories', authMiddleware(), getWorkCategoriesHandler)

/**
 * 检查作品是否包含某个分类
 */
async function hasWorkCategoryHandler(req, res) {
  try {
    const { work_id, category_id } = req.query
    const workId = parseInt(work_id) || 0
    const categoryId = parseInt(category_id) || 0
    
    if (!workId || !categoryId) {
      res.status(200).json(HttpResult.error({ msg: '作品ID和分类ID不能为空' }))
      return
    }
    
    const result = await workCategoryService.hasWorkCategory(workId, categoryId)
    res.status(200).json(result)
  } catch (error) {
    console.error('检查作品分类失败:', error)
    res.status(500).json(HttpResult.error({ msg: '检查作品分类失败' }))
  }
}
router.get('/hasWorkCategory', authMiddleware(), hasWorkCategoryHandler)
router.post('/hasWorkCategory', authMiddleware(), hasWorkCategoryHandler)

/**
 * 批量设置作品分类
 */
async function batchSetWorkCategoriesHandler(req, res) {
  try {
    const { work_categories } = req.body
    
    if (!Array.isArray(work_categories) || work_categories.length === 0) {
      res.status(200).json(HttpResult.error({ msg: '作品分类数据不能为空' }))
      return
    }
    
    const result = await workCategoryService.batchSetWorkCategories(work_categories)
    res.status(200).json(result)
  } catch (error) {
    console.error('批量设置作品分类失败:', error)
    res.status(500).json(HttpResult.error({ msg: '批量设置作品分类失败' }))
  }
}
router.get('/batchSetWorkCategories', authMiddleware(), batchSetWorkCategoriesHandler)
router.post('/batchSetWorkCategories', authMiddleware(), batchSetWorkCategoriesHandler)

// ==================== 调试接口 ====================

/**
 * 调试：获取作品的分类关联状态
 */
async function debugWorkCategoriesHandler(req, res) {
  try {
    const { work_id } = req.query
    const workId = parseInt(work_id) || 0
    
    if (!workId) {
      res.status(200).json(HttpResult.error({ msg: '作品ID不能为空' }))
      return
    }
    
    // 获取作品基本信息
    const work = await Work.findByPk(workId)
    if (!work) {
      res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
      return
    }
    
    // 获取分类关联
    const categoryResult = await workCategoryService.getWorkCategories(workId)
    
    // 获取work_category表中的原始数据
    const workCategoryRecords = await WorkCategory.findAll({
      where: { work_id: workId },
      raw: true
    })
    
    res.status(200).json(HttpResult.success({
      data: {
        work_info: {
          work_id: work.work_id,
          work_name: work.work_name,
          user_id: work.user_id
        },
        category_result: categoryResult,
        work_category_records: workCategoryRecords
      }
    }))
  } catch (error) {
    console.error('调试作品分类失败:', error)
    res.status(500).json(HttpResult.error({ msg: '调试失败' }))
  }
}
router.get('/debugWorkCategories', authMiddleware(), debugWorkCategoriesHandler)
router.post('/debugWorkCategories', authMiddleware(), debugWorkCategoriesHandler)

export default router

