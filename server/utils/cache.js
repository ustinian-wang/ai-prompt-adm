import fs from 'fs'
import path from 'path'
import { PATHS } from '../config/paths.js'

// 内存缓存
const memoryCache = new Map()

// 文件缓存
class FileCache {
  constructor(cacheDir = PATHS.CACHE_DIR) {
    this.cacheDir = cacheDir
    this.ensureCacheDir()
  }

  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true })
    }
  }

  // 生成缓存文件名
  getCacheFileName(key) {
    const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_')
    return `${safeKey}.cache`
  }

  // 设置缓存
  set(key, value, ttl = 3600000) { // 默认1小时
    const cacheData = {
      value,
      timestamp: Date.now(),
      ttl
    }

    // 内存缓存
    memoryCache.set(key, cacheData)

    // 文件缓存
    try {
      const cacheFile = path.join(this.cacheDir, this.getCacheFileName(key))
      fs.writeFileSync(cacheFile, JSON.stringify(cacheData), 'utf-8')
    } catch (error) {
      console.error('写入文件缓存失败:', error)
    }
  }

  // 获取缓存
  get(key) {
    // 先检查内存缓存
    if (memoryCache.has(key)) {
      const cacheData = memoryCache.get(key)
      if (Date.now() - cacheData.timestamp < cacheData.ttl) {
        return cacheData.value
      } else {
        memoryCache.delete(key)
      }
    }

    // 检查文件缓存
    try {
      const cacheFile = path.join(this.cacheDir, this.getCacheFileName(key))
      if (fs.existsSync(cacheFile)) {
        const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'))
        if (Date.now() - cacheData.timestamp < cacheData.ttl) {
          // 同步到内存缓存
          memoryCache.set(key, cacheData)
          return cacheData.value
        } else {
          // 删除过期缓存
          fs.unlinkSync(cacheFile)
        }
      }
    } catch (error) {
      console.error('读取文件缓存失败:', error)
    }

    return null
  }

  // 删除缓存
  delete(key) {
    memoryCache.delete(key)
    
    try {
      const cacheFile = path.join(this.cacheDir, this.getCacheFileName(key))
      if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile)
      }
    } catch (error) {
      console.error('删除文件缓存失败:', error)
    }
  }

  // 清理过期缓存
  cleanExpired() {
    const now = Date.now()
    
    // 清理内存缓存
    for (const [key, cacheData] of memoryCache.entries()) {
      if (now - cacheData.timestamp >= cacheData.ttl) {
        memoryCache.delete(key)
      }
    }

    // 清理文件缓存
    try {
      const files = fs.readdirSync(this.cacheDir)
      files.forEach(file => {
        if (file.endsWith('.cache')) {
          const cacheFile = path.join(this.cacheDir, file)
          try {
            const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'))
            if (now - cacheData.timestamp >= cacheData.ttl) {
              fs.unlinkSync(cacheFile)
            }
          } catch (error) {
            // 如果文件损坏，直接删除
            fs.unlinkSync(cacheFile)
          }
        }
      })
    } catch (error) {
      console.error('清理过期缓存失败:', error)
    }
  }

  // 清空所有缓存
  clear() {
    memoryCache.clear()
    
    try {
      const files = fs.readdirSync(this.cacheDir)
      files.forEach(file => {
        if (file.endsWith('.cache')) {
          fs.unlinkSync(path.join(this.cacheDir, file))
        }
      })
    } catch (error) {
      console.error('清空缓存失败:', error)
    }
  }
}

// 创建默认缓存实例
const defaultCache = new FileCache()

export { FileCache, defaultCache }
export default defaultCache
