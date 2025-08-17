import express from 'express'
import { HttpResult } from '../utils/HttpResult.js'
import { svr_getWorkDetailById, svr_getWorkList, svr_deleteWork } from '../services/work.service.js'
import { getUid } from '../utils/uid.js'
import { authMiddleware, userCheckMiddleware } from '../middleware/index.js'
import Work from '../models/Work.model.js'

const router = express.Router()


// 简化：返回静态数据（演示）
router.get('/', (req, res) => {
  res.status(200).json(HttpResult.success({
    data: []
  }))
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

  let createdWork = null;
  
  if(work_info.work_id && work_info.work_id !== 'unknown'){
    // 更新现有作品
    let old_work = await svr_getWorkList({
      user_id: req.user.id,
      work_id: work_info.work_id
    });
    if(old_work.length > 0){
      Object.assign(old_work[0], work_info);
      const work = await Work.findByPk(work_info.work_id);
      if (!work) {
          res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
          return;
      }
      await work.update(work_info);
      createdWork = work;
    }else{
      res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
      return;
    }
  }else{
    // 创建新作品
    createdWork = await Work.create(work_info);
  }

  // 获取更新后的作品信息
  let now_work = await svr_getWorkDetailById(createdWork.work_id);

  res.status(200).json(HttpResult.success({
    data: now_work
  }))
}
router.get('/upsertWork', authMiddleware(), upsertWorkHandler)
router.post('/upsertWork', authMiddleware(), upsertWorkHandler)

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

function deleteWorkHandler(req, res) {
  let { id } = req.query;
  id = parseInt(id) || 0;
  console.log('[jser deleteWorkHandler] id', id, req.query);
  if(id === undefined){
    res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
    return
  }

  let list = svr_getWorkList({
    user_id: req.user.id,
    work_id: id
  });
  // console.log('[jser deleteWorkHandler] work', list)
  if(list.length > 0){
    svr_deleteWork(list[0].work_id);
    res.status(200).json(HttpResult.success({
      msg: "删除成功"
    }))
  }else{
    res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
  }
}
router.get('/deleteWork', authMiddleware(), userCheckMiddleware(), deleteWorkHandler)
router.post('/deleteWork', authMiddleware(), userCheckMiddleware(), deleteWorkHandler)

export default router

