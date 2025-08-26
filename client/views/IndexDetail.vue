<template>
  <div class="index-detail-page">
    <!-- 头部导航 -->
    <div class="header">
      <div class="header-left">
        <a-button @click="$router.go(-1)" class="back-btn">
          <a-icon type="arrow-left" />
          返回
        </a-button>
        <div class="logo">
          <a-icon type="robot" class="logo-icon" />
          <span class="logo-text">AI提示词收集系统</span>
        </div>
      </div>
      
      <div class="header-center">
        <div class="nav-tabs">
          <div class="nav-tab">
            <a-icon type="play-circle" />
            <span>首页</span>
          </div>
          <div class="nav-tab active">
            <a-icon type="message" />
            <span>聊天</span>
          </div>
          <div class="nav-tab">
            <a-icon type="code" />
            <span>代码</span>
          </div>
          <div class="nav-tab">
            <a-icon type="phone" />
            <span>电话</span>
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <div class="user-actions">
          <div class="action-item">
            <a-icon type="appstore" />
          </div>
          <div class="action-item">
            <a-icon type="share-alt" />
            <span>分享</span>
          </div>
          <div class="action-item">
            <a-icon type="fullscreen" />
          </div>
        </div>
        
        <div class="user-info" v-if="isLoggedIn">
          <a-dropdown>
            <a class="ant-dropdown-link">
              <a-avatar :src="userInfo.avatar" icon="user" />
              <span class="username">{{ userInfo.username }}</span>
            </a>
            <a-menu slot="overlay">
              <a-menu-item @click="goToCollect">
                <a-icon type="collection" />
                我的收集
              </a-menu-item>
              <a-menu-item @click="logout">
                <a-icon type="logout" />
                退出登录
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        
        <div class="login-btn" v-else>
          <a-button type="primary" @click="$router.push('/login')">
            登录/注册
          </a-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="detail-container">
        <!-- 提示词详情卡片 -->
        <div class="prompt-detail-card">
          <div class="prompt-header">
            <h1>{{ prompt.title }}</h1>
            <div class="prompt-meta">
              <span class="category">{{ prompt.category }}</span>
              <span class="author">作者: {{ prompt.author }}</span>
              <span class="time">{{ formatTime(prompt.createdAt) }}</span>
            </div>
          </div>
          
          <div class="prompt-content">
            <div class="content-section">
              <h3>提示词内容</h3>
              <div class="content-text">{{ prompt.content }}</div>
            </div>
            
            <div class="content-section">
              <h3>使用说明</h3>
              <div class="content-text">{{ prompt.instructions }}</div>
            </div>
            
            <div class="content-section">
              <h3>适用场景</h3>
              <div class="tags">
                <span 
                  v-for="tag in prompt.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="prompt-actions">
            <a-button type="primary" @click="copyPrompt">
              <a-icon type="copy" />
              复制提示词
            </a-button>
            <a-button @click="collectPrompt">
              <a-icon type="star" />
              收藏
            </a-button>
            <a-button @click="sharePrompt">
              <a-icon type="share-alt" />
              分享
            </a-button>
          </div>
        </div>
        
        <!-- 相关推荐 -->
        <div class="related-prompts">
          <h3>相关推荐</h3>
          <div class="prompt-grid">
            <div 
              v-for="related in relatedPrompts" 
              :key="related.id"
              class="related-item"
              @click="viewRelated(related)"
            >
              <div class="item-title">{{ related.title }}</div>
              <div class="item-category">{{ related.category }}</div>
              <div class="item-preview">{{ related.preview }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <div class="footer-content">
        <p>© 2024 AI提示词收集系统 版权所有</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'IndexDetail',
  data() {
    return {
      prompt: {
        id: 1,
        title: 'AI绘画风景提示词 - 详细版',
        category: 'AI绘画',
        author: 'AI艺术家',
        createdAt: new Date(),
        content: '一个美丽的风景画，包含山脉、湖泊和森林，使用温暖的色调，画面要充满生机和活力。画面风格偏向写实主义，光影效果要自然，色彩搭配要和谐。',
        instructions: '1. 将提示词复制到AI绘画工具中\n2. 选择合适的模型和参数\n3. 根据需要调整关键词\n4. 生成后可以进一步优化',
        tags: ['风景画', '写实风格', '温暖色调', '自然光影']
      },
      relatedPrompts: [
        {
          id: 2,
          title: '城市夜景绘画',
          category: 'AI绘画',
          preview: '现代都市的夜晚景色，霓虹灯闪烁...'
        },
        {
          id: 3,
          title: '人物肖像创作',
          category: 'AI绘画',
          preview: '高质量的人物肖像，注重细节表现...'
        },
        {
          id: 4,
          title: '抽象艺术风格',
          category: 'AI绘画',
          preview: '现代抽象艺术，色彩丰富，构图独特...'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'userInfo'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    
    formatTime(time) {
      return new Date(time).toLocaleDateString()
    },
    
    copyPrompt() {
      navigator.clipboard.writeText(this.prompt.content).then(() => {
        this.$message.success('提示词已复制到剪贴板')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    },
    
    collectPrompt() {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }
      
      this.$message.success('收藏成功')
    },
    
    sharePrompt() {
      this.$message.info('分享功能开发中...')
    },
    
    goToCollect() {
      this.$router.push('/collect')
    },
    
    viewRelated(related) {
      this.$router.push(`/detail/${related.id}`)
    },
    
    async logout() {
      try {
        await this.logout()
        this.$message.success('退出登录成功')
        this.$router.push('/')
      } catch (error) {
        this.$message.error('退出登录失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.index-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .back-btn {
    border-radius: 20px;
    height: 36px;
    padding: 0 16px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    
    .logo-icon {
      font-size: 24px;
      color: #1890ff;
      margin-right: 8px;
    }
    
    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }
}

.header-center {
  .nav-tabs {
    display: flex;
    gap: 32px;
    
    .nav-tab {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: #f0f0f0;
      }
      
      &.active {
        background: #e6f7ff;
        color: #1890ff;
        border-bottom: 2px solid #1890ff;
      }
      
      .anticon {
        font-size: 16px;
      }
      
      span {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .user-actions {
    display: flex;
    gap: 12px;
    
    .action-item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s;
      
      &:hover {
        background: #f0f0f0;
      }
      
      .anticon {
        font-size: 16px;
        color: #666;
      }
      
      span {
        font-size: 12px;
        color: #666;
      }
    }
  }
  
  .user-info {
    .ant-dropdown-link {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      
      .username {
        color: #333;
        font-weight: 500;
      }
    }
  }
  
  .login-btn {
    .ant-btn {
      border-radius: 20px;
      height: 36px;
      padding: 0 20px;
    }
  }
}

.main-content {
  flex: 1;
  padding: 40px 24px;
}

.detail-container {
  max-width: 1000px;
  margin: 0 auto;
}

.prompt-detail-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 32px;
}

.prompt-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px 24px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 16px 0;
  }
  
  .prompt-meta {
    display: flex;
    gap: 24px;
    font-size: 14px;
    opacity: 0.9;
    
    .category {
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 12px;
      border-radius: 20px;
    }
  }
}

.prompt-content {
  padding: 32px 24px;
  
  .content-section {
    margin-bottom: 24px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      border-left: 4px solid #1890ff;
      padding-left: 12px;
    }
    
    .content-text {
      font-size: 16px;
      line-height: 1.8;
      color: #555;
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #1890ff;
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tag {
        background: #e6f7ff;
        color: #1890ff;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 14px;
        border: 1px solid #91d5ff;
      }
    }
  }
}

.prompt-actions {
  padding: 24px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 12px;
  
  .ant-btn {
    border-radius: 8px;
    height: 40px;
    padding: 0 20px;
    font-weight: 500;
  }
}

.related-prompts {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }
  
  .prompt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    
    .related-item {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;
      
      &:hover {
        background: #e6f7ff;
        border-color: #1890ff;
        transform: translateY(-2px);
      }
      
      .item-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }
      
      .item-category {
        font-size: 12px;
        color: #1890ff;
        background: #fff;
        padding: 4px 8px;
        border-radius: 12px;
        display: inline-block;
        margin-bottom: 8px;
      }
      
      .item-preview {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
      }
    }
  }
}

.footer {
  background: #fff;
  padding: 24px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  
  .footer-content {
    p {
      color: #999;
      font-size: 14px;
      margin: 0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
    flex-direction: column;
    gap: 16px;
    
    .header-center {
      order: 3;
      width: 100%;
      
      .nav-tabs {
        justify-content: center;
        gap: 16px;
        
        .nav-tab {
          padding: 6px 12px;
          
          span {
            display: none;
          }
        }
      }
    }
  }
  
  .main-content {
    padding: 20px 16px;
  }
  
  .prompt-header {
    padding: 24px 20px;
    
    h1 {
      font-size: 24px;
    }
    
    .prompt-meta {
      flex-direction: column;
      gap: 12px;
    }
  }
  
  .prompt-content {
    padding: 24px 20px;
  }
  
  .prompt-actions {
    padding: 20px;
    flex-direction: column;
    
    .ant-btn {
      width: 100%;
    }
  }
  
  .related-prompts {
    .prompt-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
