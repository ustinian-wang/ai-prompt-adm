<template>
  <div class="index-page">
    <!-- 头部导航 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <a-icon type="robot" class="logo-icon" />
          <span class="logo-text">AI提示词收集系统</span>
        </div>
      </div>
      
      <div class="header-center">
        <div class="nav-tabs">
          <div class="nav-tab active">
            <a-icon type="play-circle" />
            <span>首页</span>
          </div>
          <div class="nav-tab">
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
      <!-- 未登录状态 - 默认首页 -->
      <div v-if="!isLoggedIn" class="default-content">
        <div class="welcome-section">
          <h1>欢迎使用AI提示词收集系统</h1>
          <p>发现、收集、分享优质的AI提示词</p>
          <div class="action-buttons">
            <a-button type="primary" size="large" @click="$router.push('/login')">
              立即开始
            </a-button>
            <a-button size="large" @click="explorePrompts">
              探索提示词
            </a-button>
          </div>
        </div>
        
        <div class="feature-section">
          <div class="feature-card">
            <a-icon type="bulb" class="feature-icon" />
            <h3>智能推荐</h3>
            <p>基于AI算法推荐最适合的提示词</p>
          </div>
          <div class="feature-card">
            <a-icon type="team" class="feature-icon" />
            <h3>社区分享</h3>
            <p>与全球用户分享和发现优质提示词</p>
          </div>
          <div class="feature-card">
            <a-icon type="star" class="feature-icon" />
            <h3>收藏管理</h3>
            <p>个性化收藏和管理你的提示词库</p>
          </div>
        </div>
      </div>

      <!-- 已登录状态 - 个性化首页 -->
      <div v-else class="logged-in-content">
        <div class="user-welcome">
          <h2>欢迎回来，{{ userInfo.username }}！</h2>
          <p>继续你的AI提示词探索之旅</p>
        </div>
        
        <div class="quick-actions">
          <div class="action-card" @click="goToCollect">
            <a-icon type="collection" class="action-icon" />
            <h3>我的收集</h3>
            <p>查看和管理已收集的提示词</p>
          </div>
          <div class="action-card" @click="$router.push('/collect/add')">
            <a-icon type="plus" class="action-icon" />
            <h3>新增分组</h3>
            <p>创建新的提示词分组</p>
          </div>
          <div class="action-card" @click="explorePrompts">
            <a-icon type="search" class="action-icon" />
            <h3>探索发现</h3>
            <p>发现新的优质提示词</p>
          </div>
        </div>
        
        <div class="recent-prompts">
          <h3>最近使用的提示词</h3>
          <div class="prompt-list">
            <div 
              v-for="prompt in recentPrompts" 
              :key="prompt.id"
              class="prompt-item"
              @click="viewPrompt(prompt)"
            >
              <div class="prompt-title">{{ prompt.title }}</div>
              <div class="prompt-category">{{ prompt.category }}</div>
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
  name: 'Index',
  data() {
    return {
      recentPrompts: [
        { id: 1, title: 'AI绘画风景提示词', category: 'AI绘画' },
        { id: 2, title: '文案创作助手', category: '文案创作' },
        { id: 3, title: '代码生成模板', category: '代码生成' }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'userInfo'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    
    goToCollect() {
      this.$router.push('/collect')
    },
    
    explorePrompts() {
      // 探索提示词功能
      this.$message.info('探索功能开发中...')
    },
    
    viewPrompt(prompt) {
      this.$router.push(`/detail/${prompt.id}`)
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
.index-page {
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

.default-content {
  max-width: 1200px;
  margin: 0 auto;
  
  .welcome-section {
    text-align: center;
    margin-bottom: 60px;
    
    h1 {
      font-size: 48px;
      font-weight: 700;
      color: #333;
      margin-bottom: 16px;
    }
    
    p {
      font-size: 20px;
      color: #666;
      margin-bottom: 32px;
    }
    
    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      
      .ant-btn {
        border-radius: 24px;
        height: 48px;
        padding: 0 32px;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
  
  .feature-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    
    .feature-card {
      background: #fff;
      padding: 32px 24px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;
      
      &:hover {
        transform: translateY(-4px);
      }
      
      .feature-icon {
        font-size: 48px;
        color: #1890ff;
        margin-bottom: 16px;
      }
      
      h3 {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin-bottom: 12px;
      }
      
      p {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
      }
    }
  }
}

.logged-in-content {
  max-width: 1200px;
  margin: 0 auto;
  
  .user-welcome {
    text-align: center;
    margin-bottom: 40px;
    
    h2 {
      font-size: 32px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 16px;
      color: #666;
    }
  }
  
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
    
    .action-card {
      background: #fff;
      padding: 24px;
      border-radius: 12px;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }
      
      .action-icon {
        font-size: 32px;
        color: #1890ff;
        margin-bottom: 12px;
      }
      
      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }
      
      p {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
      }
    }
  }
  
  .recent-prompts {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }
    
    .prompt-list {
      display: grid;
      gap: 12px;
      
      .prompt-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          border-color: #1890ff;
          background: #f6ffed;
        }
        
        .prompt-title {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }
        
        .prompt-category {
          font-size: 12px;
          color: #999;
          background: #f5f5f5;
          padding: 4px 8px;
          border-radius: 4px;
        }
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
  
  .default-content {
    .welcome-section {
      h1 {
        font-size: 32px;
      }
      
      p {
        font-size: 16px;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
    }
    
    .feature-section {
      grid-template-columns: 1fr;
    }
  }
  
  .logged-in-content {
    .quick-actions {
      grid-template-columns: 1fr;
    }
  }
}
</style>
