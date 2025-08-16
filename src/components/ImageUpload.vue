<template>
  <div class="image-upload">
    <a-upload
      :file-list="fileList"
      :before-upload="beforeUpload"
      :custom-request="customUpload"
      :show-upload-list="false"
      :accept="acceptTypes"
      :disabled="disabled"
      :multiple="multiple"
      list-type="picture-card"
      class="upload-area"
      @drop="handleDrop"
    >
      <div v-if="fileList.length < maxCount" class="upload-trigger">
        <div class="upload-icon">
          <a-icon type="plus" />
        </div>
        <div class="upload-text">{{ uploadText }}</div>
      </div>
      
      <template v-else>
        <div class="upload-trigger disabled">
          <div class="upload-icon">
            <a-icon type="exclamation-circle" />
          </div>
          <div class="upload-text">已达到最大上传数量</div>
        </div>
      </template>
    </a-upload>

    <!-- 图片预览列表 -->
    <div v-if="fileList.length > 0" class="image-preview-list">
      <div
        v-for="(file, index) in fileList"
        :key="file.uid || index"
        class="image-preview-item"
      >
        <div class="image-wrapper">
          <img
            v-if="file.url || file.thumbUrl"
            :src="file.url || file.thumbUrl"
            :alt="file.name"
            class="preview-image"
          />
          <div v-else class="image-placeholder">
            <a-icon type="picture" />
          </div>
          
          <!-- 上传进度 -->
          <div v-if="file.status === 'uploading'" class="upload-progress">
            <a-progress
              :percent="file.percent || 0"
              :show-info="false"
              size="small"
              stroke-color="#1890ff"
            />
          </div>
          
          <!-- 操作按钮 -->
          <div class="image-actions">
            <a-button
              type="text"
              size="small"
              @click="previewImage(file)"
              class="action-btn"
            >
              查看
            </a-button>
            <a-button
              type="text"
              size="small"
              @click="removeImage(index)"
              class="action-btn delete"
            >
              删除
            </a-button>
          </div>
        </div>
        
        <!-- 文件信息 -->
        <div class="file-info">
          <div class="file-name" :title="file.name">{{ file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size) }}</div>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <a-modal
      :visible="previewVisible"
      :title="previewTitle"
      :footer="null"
      width="800px"
      centered
      @cancel="previewVisible = false"
    >
      <img
        v-if="previewImageUrl"
        :src="previewImageUrl"
        :alt="previewTitle"
        style="width: 100%"
      />
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import request from '@/utils/request'

export default {
  name: 'ImageUpload',
  props: {
    // 文件列表
    value: {
      type: Array,
      default: () => []
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否支持多选 - 改为默认false，单文件上传
    multiple: {
      type: Boolean,
      default: false
    },
    // 最大上传数量 - 改为默认1
    maxCount: {
      type: Number,
      default: 1
    },
    // 最大文件大小（MB）
    maxSize: {
      type: Number,
      default: 10
    },
    // 允许的文件类型
    acceptTypes: {
      type: String,
      default: 'image/jpeg,image/jpg,image/png,image/gif,image/webp'
    },
    // 上传接口地址
    uploadUrl: {
      type: String,
      default: '/api/upload/image'
    },
    // 上传参数
    uploadParams: {
      type: Object,
      default: () => ({})
    },
    // 上传文本
    uploadText: {
      type: String,
      default: '点击或拖拽上传图片'
    }
  },
  data() {
    return {
      fileList: [],
      previewVisible: false,
      previewImageUrl: '',
      previewTitle: '',
      frozen: true,
    }
  },
  watch: {
    value: {
      handler(newValue) {
        if (newValue && Array.isArray(newValue)) {
          this.fileList = [...newValue]
        }
      },
      immediate: true,
      deep: true
    },
    fileList: {
      handler(newValue) {
        if(this.frozen){
          return
        }
        // this.$emit('input', newValue)
        // this.$emit('change', newValue)
      },
      deep: true
    }
  },
  methods: {
    // 允许的图片格式
    getAllowedTypes() {
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    },
    
    getAllowedExtensions() {
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (!bytes) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    // 验证文件
    validateFile(file) {
      const allowedTypes = this.getAllowedTypes()
      const allowedExtensions = this.getAllowedExtensions()
      
      // 检查文件类型
      if (!allowedTypes.includes(file.type)) {
        this.$message.error('只支持 JPG、PNG、GIF、WebP 格式的图片')
        return false
      }

      // 检查文件扩展名
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (!allowedExtensions.includes(extension)) {
        this.$message.error('文件扩展名不支持')
        return false
      }

      // 检查文件大小
      const maxSizeBytes = this.maxSize * 1024 * 1024
      if (file.size > maxSizeBytes) {
        this.$message.error(`文件大小不能超过 ${this.maxSize}MB`)
        return false
      }

      return true
    },

    // 上传前验证
    beforeUpload(file) {
      if (!this.validateFile(file)) {
        return false
      }

      // 检查上传数量限制
      if (this.fileList.length >= this.maxCount) {
        this.$message.error(`最多只能上传 ${this.maxCount} 张图片`)
        return false
      }

      return true
    },

    // 自定义上传
    customUpload({ file, onProgress, onSuccess, onError }) {
      // 创建FormData
      const formData = new FormData()
      formData.append('image', file)
      
      // 添加额外的上传参数
      Object.keys(this.uploadParams).forEach(key => {
        formData.append(key, this.uploadParams[key])
      })

      // 添加到文件列表 - 单文件上传时替换现有文件
      const fileItem = {
        uid: file.uid,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        percent: 0
      }
      
      // 单文件上传时，清空现有文件列表
      if (!this.multiple) {
        this.fileList = []
      }
      this.fileList.push(fileItem)

      // 使用项目的统一request工具发送上传请求
      request({
        url: this.uploadUrl,
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        const result = response.data
        if (result.code === 200) {
          // 更新文件状态
          const index = this.fileList.findIndex(item => item.uid === file.uid)
          if (index !== -1) {
            this.fileList[index] = {
              ...fileItem,
              status: 'done',
              url: result.data.url,
              thumbUrl: result.data.thumbUrl || result.data.url,
              response: result
            }
          }
          onSuccess(result)
          this.$message.success('上传成功')
        } else {
          throw new Error(result.message || '上传失败')
        }
      })
      .catch(error => {
        console.error('上传错误:', error)
        
        // 更新文件状态为错误
        const index = this.fileList.findIndex(item => item.uid === file.uid)
        if (index !== -1) {
          this.fileList[index] = {
            ...this.fileList[index],
            status: 'error',
            error: error.message
          }
        }
        
        onError(error)
        this.$message.error(error.message || '上传失败')
      })
    },

    // 处理拖拽
    handleDrop(e) {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      
      files.forEach(file => {
        if (file.type.startsWith('image/') && this.validateFile(file)) {
          this.customUpload({
            file,
            onProgress: () => {},
            onSuccess: () => {},
            onError: () => {}
          })
        }
      })
    },

    // 预览图片
    previewImage(file) {
      this.previewImageUrl = file.url || file.thumbUrl
      this.previewTitle = file.name
      this.previewVisible = true
    },

    // 移除图片
    removeImage(index) {
      const removedFile = this.fileList[index]
      this.fileList.splice(index, 1)
      this.$emit('remove', removedFile, index)
      this.$message.success('图片已移除')
    }
  },
  mounted(){
    this.frozen = false;
  }
}
</script>

<style lang="scss" scoped>
.image-upload {
  .upload-area {
    width: 100%;
    
    :deep(.ant-upload) {
      width: 100%;
    }
    
    :deep(.ant-upload-list-picture-card) {
      margin: 0;
    }
  }

  .upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 120px;
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    background: #fafafa;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: #1890ff;
      background: #f0f8ff;
    }
    
    &.disabled {
      cursor: not-allowed;
      opacity: 0.6;
      
      &:hover {
        border-color: #d9d9d9;
        background: #fafafa;
      }
    }
    
    .upload-icon {
      font-size: 24px;
      color: #999;
      margin-bottom: 8px;
    }
    
    .upload-text {
      color: #666;
      font-size: 14px;
    }
  }

  .image-preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;
  }

  .image-preview-item {
    width: 120px;
    
    .image-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #d9d9d9;
      
      .preview-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: #f5f5f5;
        color: #999;
        font-size: 24px;
      }
      
      .upload-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        padding: 4px;
      }
      
      .image-actions {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.3s;
        
        .action-btn {
          color: white;
          border: none;
          background: transparent;
          
          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          
          &.delete:hover {
            background: rgba(255, 77, 79, 0.8);
          }
        }
      }
      
      &:hover .image-actions {
        opacity: 1;
      }
    }
    
    .file-info {
      margin-top: 8px;
      text-align: center;
      
      .file-name {
        font-size: 12px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }
      
      .file-size {
        font-size: 11px;
        color: #999;
        margin-top: 2px;
      }
    }
  }
}
</style>
