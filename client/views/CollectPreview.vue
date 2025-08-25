<template>
  <div class="collect-preview-page">
    <div class="page-header">
      <a-button @click="$router.go(-1)" class="back-btn">
        <a-icon type="arrow-left" />
        返回
      </a-button>
      <h1>提示词预览</h1>
    </div>
    
    <div class="content">
      <div class="preview-card">
        <div class="work-header">
          <h2>{{ work.title }}</h2>
          <div class="work-meta">
            <span class="category">{{ work.categoryName }}</span>
            <span class="time">{{ formatTime(work.createdAt) }}</span>
          </div>
        </div>
        
        <div class="work-content">
          <p>{{ work.content }}</p>
        </div>
        
        <div class="work-actions">
          <a-button type="primary" @click="copyContent">
            <a-icon type="copy" />
            复制内容
          </a-button>
          <a-button @click="editWork">
            <a-icon type="edit" />
            编辑
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectPreview',
  data() {
    return {
      work: {
        id: 1,
        title: 'AI绘画提示词示例',
        content: '一个美丽的风景画，包含山脉、湖泊和森林，使用温暖的色调，画面要充满生机和活力。',
        categoryName: 'AI绘画',
        createdAt: new Date()
      }
    }
  },
  methods: {
    formatTime(time) {
      return new Date(time).toLocaleDateString()
    },
    
    copyContent() {
      navigator.clipboard.writeText(this.work.content).then(() => {
        this.$message.success('内容已复制到剪贴板')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    },
    
    editWork() {
      // 跳转到编辑页面
      console.log('编辑作品:', this.work)
    }
  }
}
</script>

<style lang="scss" scoped>
.collect-preview-page {
  padding: 24px;
  
  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    
    .back-btn {
      margin-right: 16px;
    }
    
    h1 {
      margin: 0;
      color: #333;
    }
  }
  
  .content {
    max-width: 800px;
    
    .preview-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 24px;
      
      .work-header {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;
        
        h2 {
          margin: 0 0 12px 0;
          color: #333;
          font-size: 24px;
        }
        
        .work-meta {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: #999;
          
          .category {
            background: #f0f0f0;
            padding: 4px 12px;
            border-radius: 4px;
            color: #666;
          }
        }
      }
      
      .work-content {
        margin-bottom: 32px;
        
        p {
          font-size: 16px;
          line-height: 1.8;
          color: #333;
          margin: 0;
        }
      }
      
      .work-actions {
        display: flex;
        gap: 12px;
      }
    }
  }
}
</style>
