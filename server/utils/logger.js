import fs from 'fs'
import path from 'path'
import { PATHS } from '../config/paths.js'

// 确保日志目录存在
const ensureLogDir = () => {
  if (!fs.existsSync(PATHS.LOGS_DIR)) {
    fs.mkdirSync(PATHS.LOGS_DIR, { recursive: true })
  }
}

// 写入日志文件
const writeLog = (logFile, message) => {
  ensureLogDir()
  const timestamp = new Date().toISOString()
  const logEntry = `[${timestamp}] ${message}\n`
  
  try {
    fs.appendFileSync(logFile, logEntry, 'utf-8')
  } catch (error) {
    console.error('写入日志失败:', error)
  }
}

// 应用日志
export const logApp = (message) => {
  console.log(message)
  writeLog(PATHS.APP_LOG_FILE, message)
}

// 错误日志
export const logError = (message, error = null) => {
  const errorMessage = error ? `${message}: ${error.stack || error.message}` : message
  console.error(errorMessage)
  writeLog(PATHS.ERROR_LOG_FILE, errorMessage)
}

// 访问日志
export const logAccess = (req, res, responseTime) => {
  const { method, url, ip } = req
  const { statusCode } = res
  const userAgent = req.get('User-Agent') || 'Unknown'
  
  const accessLog = `${method} ${url} ${statusCode} ${ip} ${responseTime}ms "${userAgent}"`
  writeLog(PATHS.ACCESS_LOG_FILE, accessLog)
}

// 清理旧日志文件
export const cleanOldLogs = (maxDays = 30) => {
  try {
    const files = fs.readdirSync(PATHS.LOGS_DIR)
    const now = Date.now()
    const maxAge = maxDays * 24 * 60 * 60 * 1000
    
    files.forEach(file => {
      const filePath = path.join(PATHS.LOGS_DIR, file)
      const stats = fs.statSync(filePath)
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath)
        console.log(`清理旧日志文件: ${file}`)
      }
    })
  } catch (error) {
    console.error('清理日志文件失败:', error)
  }
}

export default {
  logApp,
  logError,
  logAccess,
  cleanOldLogs
}
