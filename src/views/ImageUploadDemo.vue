<template>
  <div class="image-upload-demo">
    <div class="demo-header">
      <h1>图片上传组件演示</h1>
      <p>这是一个完整的图片上传组件使用示例</p>
    </div>

    <div class="demo-content">
      <!-- 基础用法 -->
      <a-card title="基础用法" class="demo-card">
        <ImageUpload
          v-model="basicImages"
          :max-count="3"
          :multiple="true"
          :max-size="5"
          upload-url="/api/upload/image"
          :upload-params="{
            userId: 'demo_user',
            workId: 'demo_work'
          }"
          upload-text="点击或拖拽上传图片"
          @change="handleBasicImagesChange"
          @remove="handleBasicImageRemove"
        />
        <div class="demo-info">
          <p><strong>当前图片数量:</strong> {{ basicImages.length }}</p>
          <p><strong>图片列表:</strong></p>
          <pre>{{ JSON.stringify(basicImages, null, 2) }}</pre>
        </div>
      </a-card>

      <!-- 单张图片上传 -->
      <a-card title="单张图片上传" class="demo-card">
        <ImageUpload
          v-model="singleImage"
          :max-count="1"
          :multiple="false"
          :max-size="10"
          upload-url="/api/upload/image"
          :upload-params="{
            userId: 'demo_user',
            workId: 'single_work'
          }"
          upload-text="上传单张图片"
          @change="handleSingleImageChange"
          @remove="handleSingleImageRemove"
        />
        <div class="demo-info">
          <p><strong>当前图片:</strong> {{ singleImage.length > 0 ? singleImage[0].name : '无' }}</p>
        </div>
      </a-card>

      <!-- 禁用状态 -->
      <a-card title="禁用状态" class="demo-card">
        <ImageUpload
          v-model="disabledImages"
          :disabled="true"
          :max-count="2"
          :multiple="true"
          upload-url="/api/upload/image"
          upload-text="禁用状态（无法上传）"
        />
      </a-card>

      <!-- 自定义配置 -->
      <a-card title="自定义配置" class="demo-card">
        <ImageUpload
          v-model="customImages"
          :max-count="5"
          :multiple="true"
          :max-size="2"
          accept-types="image/jpeg,image/png"
          upload-url="/api/upload/image"
          :upload-params="{
            userId: 'custom_user',
            workId: 'custom_work'
          }"
          upload-text="自定义配置：最多5张，每张最大2MB，仅支持JPG/PNG"
          @change="handleCustomImagesChange"
          @remove="handleCustomImageRemove"
        />
        <div class="demo-info">
          <p><strong>配置说明:</strong></p>
          <ul>
            <li>最大上传数量: 5张</li>
            <li>单张图片最大: 2MB</li>
            <li>支持格式: JPG、PNG</li>
            <li>支持多选和拖拽</li>
          </ul>
        </div>
      </a-card>

      <!-- 操作按钮 -->
      <a-card title="操作按钮" class="demo-card">
        <div class="demo-actions">
          <a-button type="primary" @click="clearAllImages">清空所有图片</a-button>
          <a-button @click="addDemoImages">添加演示图片</a-button>
          <a-button @click="logImageData">打印图片数据</a-button>
        </div>
        
        <ImageUpload
          v-model="actionImages"
          :max-count="4"
          :multiple="true"
          :max-size="5"
          upload-url="/api/upload/image"
          :upload-params="{
            userId: 'action_user',
            workId: 'action_work'
          }"
          upload-text="操作演示区域"
          @change="handleActionImagesChange"
          @remove="handleActionImageRemove"
        />
      </a-card>
    </div>
  </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload.vue'
import { message } from 'ant-design-vue'

export default {
  name: 'ImageUploadDemo',
  components: {
    ImageUpload
  },
  data() {
    return {
      basicImages: [],
      singleImage: [],
      disabledImages: [],
      customImages: [],
      actionImages: []
    }
  },
  methods: {
    // 基础用法处理
    handleBasicImagesChange(images) {
      console.log('基础用法图片变化:', images)
      this.basicImages = images
    },
    
    handleBasicImageRemove(removedImage, index) {
      console.log('移除基础图片:', removedImage, '索引:', index)
      message.success(`已移除图片: ${removedImage.name}`)
    },

    // 单张图片处理
    handleSingleImageChange(images) {
      console.log('单张图片变化:', images)
      this.singleImage = images
    },
    
    handleSingleImageRemove(removedImage, index) {
      console.log('移除单张图片:', removedImage, '索引:', index)
      message.success(`已移除图片: ${removedImage.name}`)
    },

    // 自定义配置处理
    handleCustomImagesChange(images) {
      console.log('自定义配置图片变化:', images)
      this.customImages = images
    },
    
    handleCustomImageRemove(removedImage, index) {
      console.log('移除自定义图片:', removedImage, '索引:', index)
      message.success(`已移除图片: ${removedImage.name}`)
    },

    // 操作按钮处理
    handleActionImagesChange(images) {
      console.log('操作演示图片变化:', images)
      this.actionImages = images
    },
    
    handleActionImageRemove(removedImage, index) {
      console.log('移除操作演示图片:', removedImage, '索引:', index)
      message.success(`已移除图片: ${removedImage.name}`)
    },

    // 清空所有图片
    clearAllImages() {
      this.basicImages = []
      this.singleImage = []
      this.customImages = []
      this.actionImages = []
      message.success('已清空所有图片')
    },

    // 添加演示图片
    addDemoImages() {
      const demoImages = [
        {
          uid: 'demo1',
          name: '演示图片1.jpg',
          url: 'https://via.placeholder.com/300x200/1890ff/ffffff?text=Demo+Image+1',
          status: 'done',
          size: 1024 * 1024
        },
        {
          uid: 'demo2',
          name: '演示图片2.png',
          url: 'https://via.placeholder.com/300x200/52c41a/ffffff?text=Demo+Image+2',
          status: 'done',
          size: 2048 * 1024
        }
      ]
      
      this.actionImages = [...this.actionImages, ...demoImages]
      message.success('已添加演示图片')
    },

    // 打印图片数据
    logImageData() {
      console.log('=== 图片数据汇总 ===')
      console.log('基础用法:', this.basicImages)
      console.log('单张图片:', this.singleImage)
      console.log('自定义配置:', this.customImages)
      console.log('操作演示:', this.actionImages)
      message.info('图片数据已打印到控制台')
    }
  }
}
</script>

<style lang="scss" scoped>
.image-upload-demo {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;

  .demo-header {
    text-align: center;
    margin-bottom: 32px;
    
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #262626;
      margin: 0 0 8px 0;
    }
    
    p {
      color: #8c8c8c;
      font-size: 16px;
      margin: 0;
    }
  }

  .demo-content {
    max-width: 1200px;
    margin: 0 auto;
    
    .demo-card {
      margin-bottom: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      
      .ant-card-head {
        background: #fafafa;
        border-bottom: 1px solid #f0f0f0;
        
        .ant-card-head-title {
          font-weight: 600;
          color: #262626;
        }
      }
      
      .demo-info {
        margin-top: 16px;
        padding: 16px;
        background: #fafafa;
        border-radius: 6px;
        border: 1px solid #f0f0f0;
        
        p {
          margin: 0 0 8px 0;
          color: #595959;
          
          strong {
            color: #262626;
          }
        }
        
        pre {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #d9d9d9;
          font-size: 12px;
          overflow-x: auto;
        }
        
        ul {
          margin: 8px 0;
          padding-left: 20px;
          
          li {
            color: #595959;
            margin-bottom: 4px;
          }
        }
      }
      
      .demo-actions {
        margin-bottom: 16px;
        
        .ant-btn {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .image-upload-demo {
    padding: 16px;
    
    .demo-header {
      h1 {
        font-size: 24px;
      }
      
      p {
        font-size: 14px;
      }
    }
    
    .demo-content {
      .demo-card {
        .demo-info {
          pre {
            font-size: 10px;
          }
        }
      }
    }
  }
}
</style>
