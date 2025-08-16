import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 项目根目录
const PROJECT_ROOT = path.resolve(__dirname, '..')

// 数据目录
const DATA_DIR = path.join(PROJECT_ROOT, 'data')
const DATABASE_DIR = path.join(DATA_DIR, 'database')
const CACHE_DIR = path.join(DATA_DIR, 'cache')
const LOGS_DIR = path.join(DATA_DIR, 'logs')

// 上传目录
const UPLOADS_DIR = path.join(PROJECT_ROOT, 'uploads')
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images')
const THUMBNAILS_DIR = path.join(UPLOADS_DIR, 'thumbnails')
const DOCUMENTS_DIR = path.join(UPLOADS_DIR, 'documents')
const TEMP_DIR = path.join(UPLOADS_DIR, 'temp')

// 数据文件
const USERS_FILE = path.join(DATABASE_DIR, 'users.json')
const WORKS_FILE = path.join(DATABASE_DIR, 'works.json')
const CATEGORIES_FILE = path.join(DATABASE_DIR, 'categories.json')

// 日志文件
const APP_LOG_FILE = path.join(LOGS_DIR, 'app.log')
const ERROR_LOG_FILE = path.join(LOGS_DIR, 'error.log')
const ACCESS_LOG_FILE = path.join(LOGS_DIR, 'access.log')

export const PATHS = {
  PROJECT_ROOT,
  DATA_DIR,
  DATABASE_DIR,
  CACHE_DIR,
  LOGS_DIR,
  UPLOADS_DIR,
  IMAGES_DIR,
  THUMBNAILS_DIR,
  DOCUMENTS_DIR,
  TEMP_DIR,
  USERS_FILE,
  WORKS_FILE,
  CATEGORIES_FILE,
  APP_LOG_FILE,
  ERROR_LOG_FILE,
  ACCESS_LOG_FILE
}

export default PATHS
