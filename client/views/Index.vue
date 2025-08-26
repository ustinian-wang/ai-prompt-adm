<template>
  <div class="index-page">
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

      <!-- 已登录状态 - 用户仪表板 -->
      <div v-else class="dashboard-content">
        <div class="dashboard-header">
          <h1>欢迎回来，{{ userInfo.username }}！</h1>
          <p>今天想要收集什么提示词呢？</p>
        </div>
        
        <div class="dashboard-stats">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-card>
                <a-statistic
                  title="我的收集"
                  :value="collectionCount"
                  suffix="个"
                >
                  <template #prefix>
                    <a-icon type="collection" />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card>
                <a-statistic
                  title="今日新增"
                  :value="todayNewCount"
                  suffix="个"
                >
                  <template #prefix>
                    <a-icon type="plus" />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card>
                <a-statistic
                  title="收藏总数"
                  :value="favoriteCount"
                  suffix="个"
                >
                  <template #prefix>
                    <a-icon type="heart" />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
          </a-row>
        </div>
        
        <div class="quick-actions">
          <h2>快速操作</h2>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-card hoverable @click="$router.push('/collect/add')">
                <a-icon type="plus" class="action-icon" />
                <h3>新增分组</h3>
                <p>创建新的提示词分组</p>
              </a-card>
            </a-col>
            <a-col :span="6">
              <a-card hoverable @click="$router.push('/collect/my')">
                <a-icon type="collection" class="action-icon" />
                <h3>我的收集</h3>
                <p>查看已收集的提示词</p>
              </a-card>
            </a-col>
            <a-col :span="6">
              <a-card hoverable @click="explorePrompts">
                <a-icon type="search" class="action-icon" />
                <h3>探索提示词</h3>
                <p>发现新的优质提示词</p>
              </a-card>
            </a-col>
            <a-col :span="6">
              <a-card hoverable @click="sharePrompts">
                <a-icon type="share-alt" class="action-icon" />
                <h3>分享提示词</h3>
                <p>分享你的优质提示词</p>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  data() {
    return {
      collectionCount: 12,
      todayNewCount: 3,
      favoriteCount: 28
    }
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'userInfo'])
  },
  methods: {
    explorePrompts() {
      // 探索提示词逻辑
      this.$message.info('探索功能开发中...')
    },
    sharePrompts() {
      // 分享提示词逻辑
      this.$message.info('分享功能开发中...')
    }
  }
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
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
    gap: 8px;
    
    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .logo-subtitle {
      font-size: 14px;
      color: #666;
    }
    
    .logo-icon {
      font-size: 16px;
      color: #666;
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
      color: #666;
      
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
      color: #666;
      
      &:hover {
        background: #f0f0f0;
      }
      
      &.share-btn {
        background: #1890ff;
        color: #fff;
        
        &:hover {
          background: #40a9ff;
        }
      }
      
      .anticon {
        font-size: 14px;
      }
      
      span {
        font-size: 12px;
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

.main-container {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  padding: 20px 0;
  position: relative;
  
  .sidebar-section {
    padding: 0 20px;
    margin-bottom: 20px;
    
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #333;
      font-weight: 500;
      
      .anticon {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .sidebar-nav {
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      cursor: pointer;
      transition: background 0.3s;
      
      &:hover {
        background: #f5f5f5;
      }
      
      &.active {
        background: #e6f7ff;
        color: #1890ff;
        
        .nav-icon {
          color: #1890ff;
        }
      }
      
      .nav-icon {
        font-size: 16px;
        color: #666;
      }
      
      span {
        font-size: 14px;
      }
    }
  }
  
  .sidebar-toggle {
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    .anticon {
      font-size: 12px;
      color: #999;
    }
  }
}

.content-area {
  flex: 1;
  padding: 24px;
  position: relative;
}

.search-section {
  margin-bottom: 24px;
  
  .search-bar {
    position: relative;
    max-width: 600px;
    
    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      color: #999;
    }
    
    .search-input {
      width: 100%;
      height: 48px;
      padding: 0 16px 0 48px;
      border: 1px solid #e8e8e8;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      
      &:focus {
        border-color: #1890ff;
      }
      
      &::placeholder {
        color: #999;
      }
    }
  }
}

.category-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  align-items: center;
  
  .tab {
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    
    &:hover {
      background: #f0f0f0;
    }
    
    &.active {
      background: #ff4d4f;
      color: #fff;
    }
  }
  
  .expand-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    background: #f5f5f5;
    color: #666;
    font-size: 14px;
    
    .anticon {
      font-size: 12px;
    }
  }
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.content-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    border-color: #d9d9d9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &.active {
    background: #f8f8f8;
    border-color: #d9d9d9;
  }
  
  .card-header {
    position: absolute;
    top: 12px;
    right: 12px;
    
    .collect-btn {
      background: #ff4d4f;
      color: #fff;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      cursor: pointer;
    }
  }
  
  .card-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    
    .icon-3d {
      position: relative;
      width: 80px;
      height: 80px;
      
      .icon-stack {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        
        .stack-item {
          width: 40px;
          height: 8px;
          border-radius: 2px;
          margin-bottom: 2px;
          
          &.red {
            background: #ff4d4f;
          }
          
          &.white {
            background: #fff;
            border: 1px solid #f0f0f0;
          }
        }
      }
      
      .icon-base {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        
        .base-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-bottom: 4px;
          
          &.red {
            background: #ff4d4f;
          }
          
          &.white {
            background: #fff;
            border: 2px solid #f0f0f0;
          }
        }
      }
      
      .icon-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        border: 2px solid #f0f0f0;
        border-radius: 50%;
        z-index: 0;
      }
    }
  }
  
  .card-content {
    text-align: center;
    
    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    .card-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 12px;
      
      .view-count {
        font-size: 12px;
        color: #999;
      }
      
      .anticon {
        font-size: 14px;
        
        &.liked {
          color: #ff4d4f;
        }
        
        &.not-liked {
          color: #d9d9d9;
        }
      }
    }
    
    .card-tags {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      
      .tag {
        font-size: 12px;
        color: #666;
        background: #f5f5f5;
        padding: 2px 8px;
        border-radius: 10px;
      }
    }
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
  
  .page-info {
    font-size: 14px;
    color: #666;
  }
  
  .page-controls {
    display: flex;
    gap: 12px;
    
    .anticon {
      font-size: 16px;
      color: #666;
      cursor: pointer;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
}

.help-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .anticon {
    font-size: 20px;
    color: #666;
  }
  
  &:hover {
    border-color: #1890ff;
    
    .anticon {
      color: #1890ff;
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
  
  .sidebar {
    width: 160px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .category-tabs {
    gap: 12px;
    
    .tab {
      padding: 6px 12px;
      font-size: 12px;
    }
  }
  
  .content-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
}
</style>
