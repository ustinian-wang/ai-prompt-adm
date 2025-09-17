import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { HttpResult } from '../utils/HttpResult.js'
import OssFile from '../models/OssFile.model.js'
import { memberAuthMiddleware as auth } from '../middleware/auth.js'

const router = express.Router()

// 兼容历史：优先采用已存在的目录，避免读写分离导致404
function resolveBaseDir() {
  const rootDir = path.join(process.cwd(), 'uploads/oss')
  const serverDir = path.join(process.cwd(), 'server', 'uploads', 'oss')
  if (fs.existsSync(rootDir)) return rootDir
  if (fs.existsSync(serverDir)) return serverDir
  // 默认创建根目录
  fs.mkdirSync(rootDir, { recursive: true })
  return rootDir
}
const baseDir = resolveBaseDir()

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

// 允许匿名上传
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json(HttpResult.error({ msg: '缺少文件' }))

    const objectKey = makeObjectKey(file.originalname)
    const targetPath = path.join(baseDir, objectKey)
    const targetDir = path.dirname(targetPath)
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })

    fs.writeFileSync(targetPath, file.buffer)

    const baseUrl = process.env.ASSET_BASE_URL || 'http://localhost:4002'
    const url = `${baseUrl}/api/ossFile/object/${encodeURIComponent(objectKey)}`
    const entity = await OssFile.create({
      object_key: objectKey,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype || 'application/octet-stream',
      url,
      created_by: req.member?.id || null
    })

    return res.status(200).json(HttpResult.success(entity))
  } catch (e) {
    console.error('OSS upload error:', e)
    return res.status(500).json(HttpResult.error({ msg: '上传失败' }))
  }
})

router.get('/object/:key(*)', async (req, res) => {
    console.log('[jser getObject] key', req.params.key)
  try {
    const key = decodeURIComponent(req.params.key)
    const abs = path.join(baseDir, key)
    if (!fs.existsSync(abs)) return res.status(404).json(HttpResult.error({ msg: '对象不存在' }))
    return res.sendFile(abs)
  } catch (e) {
    console.error('OSS read error:', e)
    return res.status(500).json(HttpResult.error({ msg: '读取失败' }))
  }
})

router.delete('/object/:key(*)', auth(), async (req, res) => {
    console.log('[jser deleteObject] key', req.params.key)
  try {
    const key = decodeURIComponent(req.params.key)
    const hard = parseInt(req.query.hard || '0') === 1
    const rec = await OssFile.findOne({ where: { object_key: key }, paranoid: !hard })
    if (!rec) return res.status(404).json(HttpResult.error({ msg: '对象不存在' }))
    const abs = path.join(baseDir, key)
    if (fs.existsSync(abs)) fs.unlinkSync(abs)
    if (hard) {
      await OssFile.destroy({ where: { object_key: key }, force: true })
    } else {
      await OssFile.destroy({ where: { object_key: key } })
    }
    return res.status(200).json(HttpResult.success({ success: true }))
  } catch (e) {
    console.error('OSS delete error:', e)
    return res.status(500).json(HttpResult.error({ msg: '删除失败' }))
  }
})

// 统一错误处理（包含multer体积限制等）
router.use((err, req, res, next) => {
  console.log('[jser ossFile router error] err', err)
  if (err && err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(HttpResult.error({ msg: '文件大小超过限制（最大10MB）' }))
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json(HttpResult.error({ msg: '不支持的文件字段' }))
    }
    return res.status(400).json(HttpResult.error({ msg: '文件上传错误' }))
  }
  if (err) {
    console.error('OSS router error:', err)
    return res.status(500).json(HttpResult.error({ msg: err.message || '服务异常' }))
  }
  next()
})

export default router



