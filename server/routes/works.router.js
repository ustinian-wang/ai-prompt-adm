import express from 'express'
import { HttpResult } from '../utils/HttpResult.js'
import { svr_getWorkDetailById, svr_createWorkDetail, svr_getWorkList, svr_updateWorkDetail, svr_deleteWork } from '../services/works.service.js'
import { getUid } from '../utils/uid.js'

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
function getWorkDetailHandler(req, res) {
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
  let work = svr_getWorkDetailById(id);
  if(work){
    res.status(200).json(HttpResult.success({ data: work }));
  }else{
    res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
  }
  // res.status(200).json(HttpResult.success({ data: work }))
}

router.get('/getWorkDetail', getWorkDetailHandler)
router.post('/getWorkDetail', getWorkDetailHandler)

/**
 * @description 创建作品
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function createWorkHandler  (req, res) {
  res.status(200).json(HttpResult.success({}))
}
router.get('/createWork', createWorkHandler)
router.post('/createWork', createWorkHandler)


/**
 * @description 更新作品
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function updateWorkHandler(req, res) {
  res.status(200).json(HttpResult.success({}))
}
router.get('/updateWork', updateWorkHandler)
router.post('/updateWork', updateWorkHandler)

function upsertWorkHandler(req, res) {
  let work_info = req.body;
  console.log('[jser upsertWorkHandler] work_info', work_info)
  if(!work_info.work_name){
    res.status(200).json(HttpResult.error({ msg: '作品名称不能为空' }))
    return
  }

  let old_work = svr_getWorkDetailById(work_info.work_id);
  if(old_work){
    Object.assign(old_work, work_info);
    svr_updateWorkDetail(work_info.work_id, old_work);
  }else{
    svr_createWorkDetail(work_info);
  }

  let now_work = svr_getWorkDetailById(work_info.work_id);

  res.status(200).json(HttpResult.success({
    data: now_work
  }))
}
router.get('/upsertWork', upsertWorkHandler)
router.post('/upsertWork', upsertWorkHandler)

function getWorkListHandler(req, res) {
  let user_id = req?.user?.user_id || 0;
  let { work_name, work_status, work_type, category } = req.query;
  work_name = work_name || '';
  work_status = work_status || '';
  work_type = work_type || '';
  category = category || '';

  let work_list = svr_getWorkList({
    user_id,
    work_name,
    work_status,
    work_type,
    category
  });
  res.status(200).json(HttpResult.success({
    data: work_list
  }))
}
router.get('/getWorkList', getWorkListHandler)
router.post('/getWorkList', getWorkListHandler)

function deleteWorkHandler(req, res) {
  let { id } = req.query;
  id = parseInt(id) || 0;
  console.log('[jser deleteWorkHandler] id', id, req.query);
  if(id === undefined){
    res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
    return
  }

  let work = svr_getWorkDetailById(id);
  console.log('[jser deleteWorkHandler] work', work)
  if(work){
    svr_deleteWork(id);
    res.status(200).json(HttpResult.success({
      msg: "删除成功"
    }))
  }else{
    res.status(200).json(HttpResult.error({ msg: '作品不存在' }))
  }
}
router.get('/deleteWork', deleteWorkHandler)
router.post('/deleteWork', deleteWorkHandler)

export default router

