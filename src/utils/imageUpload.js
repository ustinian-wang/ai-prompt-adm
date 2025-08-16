/**
 * 通用图片上传工具
 */

import request from '@/utils/request'

/**
 * 上传图片到服务器
 * @param {File} imageFile - 图片文件对象
 * @param {Object} options - 上传选项
 * @param {string} options.uploadUrl - 上传接口地址
 * @param {Object} options.uploadParams - 上传参数
 * @param {number} options.maxSize - 最大文件大小(MB)
 * @param {Array} options.allowedTypes - 允许的文件类型
 * @returns {Promise<string>} 返回图片URL
 */
export const uploadImage = async (imageFile, options = {}) => {
  const {
    uploadUrl = '/api/upload/image',
    uploadParams = {},
    maxSize = 5,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  } = options

  // 验证文件类型
  if (!allowedTypes.includes(imageFile.type)) {
    throw new Error('不支持的文件类型，请上传 JPG、PNG、GIF、WebP 格式的图片')
  }

  // 验证文件大小
  const maxSizeBytes = maxSize * 1024 * 1024
  if (imageFile.size > maxSizeBytes) {
    throw new Error(`文件大小不能超过 ${maxSize}MB`)
  }

  // 创建FormData
  const formData = new FormData()
  formData.append('image', imageFile)
  
  // 添加富文本编辑器标识
  formData.append('type', 'rich-text')
  
  // 添加上传参数
  Object.keys(uploadParams).forEach(key => {
    formData.append(key, uploadParams[key])
  })

  try {
    const response = await request({
      url: uploadUrl,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const result = response.data
    if (result.success) {
      // 返回图片URL
      return result.data.url || result.data
    } else {
      throw new Error(result.msg || '上传失败')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    throw new Error(error.message || '图片上传失败，请重试')
  }
}

/**
 * 富文本编辑器专用图片上传
 * @param {File} imageFile - 图片文件
 * @param {Object} uploadParams - 上传参数
 * @returns {Promise<string>} 返回图片URL
 */
export const uploadRichTextImage = (imageFile, uploadParams = {}) => {
  return uploadImage(imageFile, {
    uploadParams,
    maxSize: 5,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  })
}

/**
 * 作品参考图上传
 * @param {File} imageFile - 图片文件
 * @param {Object} workParams - 作品参数
 * @returns {Promise<string>} 返回图片URL
 */
export const uploadWorkImage = (imageFile, workParams = {}) => {
  return uploadImage(imageFile, {
    uploadParams: { ...workParams, type: 'work-reference' },
    maxSize: 5
  })
}

/**
 * 用户头像上传
 * @param {File} imageFile - 图片文件
 * @param {string} userId - 用户ID
 * @returns {Promise<string>} 返回图片URL
 */
export const uploadAvatar = (imageFile, userId) => {
  return uploadImage(imageFile, {
    uploadParams: { userId, type: 'avatar' },
    maxSize: 2
  })
}

/**
 * 图片压缩和优化
 * @param {File} imageFile - 原始图片文件
 * @param {Object} options - 压缩选项
 * @returns {Promise<Blob>} 返回压缩后的图片Blob
 */
export const compressImage = (imageFile, options = {}) => {
  return new Promise((resolve) => {
    const {
      maxWidth = 800,
      maxHeight = 600,
      quality = 0.8,
      outputFormat = 'image/jpeg'
    } = options

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // 计算缩放比例
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      // 绘制图片
      ctx.drawImage(img, 0, 0, width, height)

      // 转换为Blob
      canvas.toBlob(resolve, outputFormat, quality)
    }

    img.src = URL.createObjectURL(imageFile)
  })
}

/**
 * 创建图片HTML标签
 * @param {string} imageUrl - 图片URL
 * @param {Object} options - 图片属性选项
 * @returns {string} 返回HTML字符串
 */
export const createImageHtml = (imageUrl, options = {}) => {
  const {
    alt = '图片',
    width = 'auto',
    height = 'auto',
    align = 'center',
    className = '',
    style = ''
  } = options

  let imgStyle = `max-width: 100%; height: auto;`
  
  if (width !== 'auto') {
    imgStyle += ` width: ${width};`
  }
  if (height !== 'auto') {
    imgStyle += ` height: ${height};`
  }

  // 对齐方式
  switch (align) {
    case 'left':
      imgStyle += ' float: left; margin-right: 10px;'
      break
    case 'center':
      imgStyle += ' display: block; margin: 0 auto;'
      break
    case 'right':
      imgStyle += ' float: right; margin-left: 10px;'
      break
  }

  if (style) {
    imgStyle += ` ${style}`
  }

  return `<img src="${imageUrl}" alt="${alt}" style="${imgStyle}" class="${className}" />`
}

export default {
  uploadImage,
  uploadRichTextImage,
  uploadWorkImage,
  uploadAvatar,
  compressImage,
  createImageHtml
}
