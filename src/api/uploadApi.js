import request from '@/utils/request'

// 上传单张图片
export const uploadImage = (formData) => {
  return request({
    url: '/api/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 批量上传图片
export const uploadImages = (formData) => {
  return request({
    url: '/upload/images',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除图片
export const deleteImage = (filename) => {
  return request({
    url: `/upload/image/${filename}`,
    method: 'delete'
  })
}

// 获取图片URL
export const getImageUrl = (filename) => {
  return `${import.meta.env.VITE_API_BASE || '/api'}/upload/images/${filename}`
}

// 获取缩略图URL
export const getThumbnailUrl = (filename) => {
  return `${import.meta.env.VITE_API_BASE || '/api'}/upload/thumbnails/${filename}`
}
