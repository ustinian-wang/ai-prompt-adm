import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { authMiddleware } from '../middleware/index.js'
import { HttpResult } from '../utils/HttpResult.js'
import { svr_getWorkDetailById, svr_updateWorkDetail } from '../services/Work.svr.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads/images')
const thumbDir = path.join(__dirname, '../uploads/thumbnails')

// 创建目录（如果不存在）
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir, { recursive: true })
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // 获取文件扩展名
    const ext = path.extname(file.originalname).toLowerCase()
    
    // 从请求中获取参数
    const userId = req.body.userId || req.user?.id || 'unknown'
    const workId = req.body.workId || 'unknown'
    const imgId = uuidv4().replace(/-/g, '')
    const timestamp = Date.now()
    
    // 生成文件名：userId_workId_imgId_timestamp.xx
    const filename = `${userId}_${workId}_${imgId}_${timestamp}${ext}`
    
    cb(null, filename)
  }
})

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的图片类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('只支持 JPG、PNG、GIF、WebP 格式的图片'), false)
  }
}

// 配置 multer - 改为单文件上传
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1 // 最多1个文件
  }
})

function get_file_name(req, file){
  // 获取文件扩展名
  let ext = path.extname(file.originalname).toLowerCase()
    
  // 从请求中获取参数
  let userId = req.body.userId || req.user?.id || 'unknown'
  let workId = req.body.workId || 'unknown'
  let imgId = uuidv4().replace(/-/g, '')
  let timestamp = Date.now()
  
  // 生成文件名：userId_workId_imgId_timestamp.xx
  let filename = `${userId}_${workId}_${imgId}_${timestamp}${ext}`
  return filename;
}

function uploadImageHandler (req, res) {
  try {
    // 检查是否有上传的文件
    if (!req.file) {
      return res.status(400).json(HttpResult.error({ msg: '请选择要上传的图片' }))
    }

    const file = req.file  // 单文件，使用 req.file
    const userId = req.body.userId || req.user.id
    const workId = req.body.workId || 'unknown'
    
    // 检查文件是否存在
    if (!fs.existsSync(file.path)) {
      return res.status(400).json(HttpResult.error({ msg: '文件上传失败' }))
    }

    // 获取文件信息
    const fileStats = fs.statSync(file.path)
    const fileSize = fileStats.size
    
    // 生成缩略图路径
    const thumbnailPath = path.join(thumbDir, file.filename)
    
    // 复制原图作为缩略图
    fs.copyFileSync(file.path, thumbnailPath)
    
    // 使用multer生成的文件名
    const filename = file.filename
    // 构建访问URL
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const imageUrl = `${baseUrl}/api/upload/image/${filename}`
    
    let old_work = svr_getWorkDetailById(workId);
    if(old_work){
      old_work.work_img_path = imageUrl;
      svr_updateWorkDetail(workId, old_work);
    }

    const result = {
      originalName: file.originalname,
      filename: filename,
      size: fileSize,
      mimetype: file.mimetype,
      url: imageUrl,
      path: file.path,
      userId: userId,
      workId: workId,
      uploadTime: new Date().toISOString()
    }
    
    res.json(HttpResult.success({ msg: '图片上传成功', data: result }))
    
  } catch (error) {
    console.error('图片上传错误:', error)
    res.status(500).json(HttpResult.error({ msg: '图片上传失败: ' + error.message }))
  }
}

// 单张图片上传接口 - 使用 multer.single('image')
router.post('/image', authMiddleware(), upload.single('image'), uploadImageHandler)
router.get('/image', authMiddleware(), upload.single('image'), uploadImageHandler)

// 获取图片文件
router.get('/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(uploadDir, filename)
    
    console.log('[jser getImageUrl] filePath', filePath)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json(HttpResult.error({ msg: '图片不存在' }))
    }
    res.sendFile(filePath)
  } catch (error) {
    console.error('获取图片错误:', error)
    res.status(500).json(HttpResult.error({ msg: '获取图片失败' }))
  }
})

// 获取缩略图文件
router.get('/thumbnails/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(thumbDir, filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json(HttpResult.error({ msg: '缩略图不存在' }))
    }
    
    res.sendFile(filePath)
  } catch (error) {
    console.error('获取缩略图错误:', error)
    res.status(500).json(HttpResult.error({ msg: '获取缩略图失败' }))
  }
})

// 删除图片接口
router.delete('/image/:filename', authMiddleware(), (req, res) => {
  try {
    const filename = req.params.filename
    const imagePath = path.join(uploadDir, filename)
    const thumbnailPath = path.join(thumbDir, filename)
    
    // 删除原图
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }
    
    // 删除缩略图
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath)
    }
    
    res.json(HttpResult.success({ msg: '图片删除成功' }))
  } catch (error) {
    console.error('删除图片错误:', error)
    res.status(500).json(HttpResult.error({ msg: '删除图片失败: ' + error.message }))
  }
})

// 错误处理中间件
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(HttpResult.error({ msg: '文件大小超过限制（最大10MB）' }))
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json(HttpResult.error({ msg: '文件数量超过限制（最多5个）' }))
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json(HttpResult.error({ msg: '不支持的文件字段' }))
    }
  }
  
  console.error('上传路由错误:', error)
  res.status(500).json(HttpResult.error({ msg: '上传失败: ' + error.message }))
})

export default router
