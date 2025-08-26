<template>
  <div class="index-detail-page">
    <!-- 头部导航 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-text">即时设计</span>
          <span class="logo-subtitle">提示词收集项目</span>
        </div>
      </div>
      
      <div class="header-center">
        <div class="nav-tabs">
          <div class="nav-tab">
            <a-icon type="message" />
          </div>
          <div class="nav-tab">
            <a-icon type="code" />
          </div>
          <div class="nav-tab">
            <a-icon type="link" />
          </div>
          <div class="nav-tab active">
            <a-icon type="play-circle" />
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
          <div class="action-item">
            <a-icon type="ellipsis" />
          </div>
        </div>
        
        <div class="user-info" v-if="isLoggedIn">
          <a-dropdown>
            <a class="ant-dropdown-link">
              <a-avatar icon="star" />
              <span class="username">{{ userInfo.username }}</span>
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>无边框</a-menu-item>
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
      <!-- 左侧边栏 -->
      <div class="left-sidebar">
        <div class="sidebar-nav">
          <div class="nav-item">
            <span>首页</span>
            <a-icon type="down" />
          </div>
          <div class="nav-item">
            <a-icon type="arrow-left" />
            <span>返回</span>
          </div>
          <div class="nav-item active">
            <a-icon type="thunderbolt" />
            <span>提示词</span>
          </div>
          <div class="nav-item">
            <a-icon type="book" />
            <span>教程</span>
          </div>
        </div>
      </div>

      <!-- 中央内容区 -->
      <div class="center-content">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <a-input-search
            placeholder="请输入行业关键词搜索"
            size="large"
            :enter-button="false"
          >
            <a-icon slot="prefix" type="search" />
          </a-input-search>
        </div>

        <!-- 3D图标展示区 -->
        <div class="icon-display-section">
          <div class="icon-row">
            <div 
              v-for="(icon, index) in 4" 
              :key="index"
              class="icon-item"
            >
              <div class="icon-3d">
                <!-- 服务器机架样式的3D图标 -->
                <div class="server-rack">
                  <div class="rack-layer"></div>
                  <div class="rack-layer"></div>
                  <div class="rack-layer"></div>
                  <div class="rack-layer"></div>
                </div>
                <div class="icon-info">
                  <a-icon type="info-circle" />
                </div>
              </div>
            </div>
          </div>
          <div class="icon-stats">
            <span class="views">1.2w</span>
            <a-icon type="heart" class="heart-icon" />
          </div>
        </div>

        <!-- 提示词描述区 -->
        <div class="prompt-description">
          <div class="prompt-section">
            <h4>中文提示词:</h4>
            <div class="prompt-content">
              <span class="prompt-text">卡车,ui图标设计,蓝色和橙色,高品质,许多细节,oc渲染,透明磨砂玻璃材质,干净背景,未来科技感,等距照明,工作室照明,等距渲染,OC渲染,Blender, 3d, C4D, 4k</span>
              <a-button type="link" class="copy-btn" @click="copyPrompt('卡车,ui图标设计,蓝色和橙色,高品质,许多细节,oc渲染,透明磨砂玻璃材质,干净背景,未来科技感,等距照明,工作室照明,等距渲染,OC渲染,Blender, 3d, C4D, 4k')">复制</a-button>
            </div>
          </div>
          
          <div class="prompt-section">
            <h4>英文提示词:</h4>
            <div class="prompt-content">
              <span class="prompt-text">Logistics truck, ui icon design, blue and orange, high quality, many details, oc rendering, transparent frosted glass material, clean background, future technology sense, isometric lighting, studio lighting, isometric rendering, OC rendering, Blender, 3d, C4D, 4k</span>
              <a-button type="link" class="copy-btn" @click="copyPrompt('Logistics truck, ui icon design, blue and orange, high quality, many details, oc rendering, transparent frosted glass material, clean background, future technology sense, isometric lighting, studio lighting, isometric rendering, OC rendering, Blender, 3d, C4D, 4k')">复制</a-button>
            </div>
          </div>
        </div>

        <!-- 教程区域 -->
        <div class="tutorials-section">
          <div class="tutorial-header">
            <div class="red-bar"></div>
            <h3>教程</h3>
          </div>
          <div class="tutorial-content">
            <h4>卡车3D图标案例</h4>
            <div class="tutorial-image">
              <div class="truck-icon">
                <div class="truck-body">
                  <div class="truck-cab"></div>
                  <div class="truck-trailer"></div>
                </div>
                <div class="truck-wheels">
                  <div class="wheel"></div>
                  <div class="wheel"></div>
                  <div class="wheel"></div>
                  <div class="wheel"></div>
                </div>
              </div>
              <div class="image-overlay">
                <span class="page-info">2/3</span>
                <span class="detail-text">详情页</span>
                <a-icon type="appstore" />
                <a-icon type="reload" />
              </div>
            </div>
          </div>
        </div>

        <!-- 导航箭头 -->
        <div class="nav-arrows">
          <a-icon type="left" class="nav-arrow left" />
          <a-icon type="right" class="nav-arrow right" />
        </div>
      </div>

      <!-- 右侧边栏 -->
      <div class="right-sidebar">
        <div class="sidebar-actions">
          <a-button class="copy-link-btn" @click="copyLink">复制链接分享</a-button>
          <a-button type="danger" class="collect-btn" @click="collectPrompt">采集</a-button>
        </div>

        <div class="design-info">
          <h4>3D图标设计</h4>
          <div class="tags">
            <span class="tag">#UI</span>
            <span class="tag">#3D</span>
            <span class="tag">#icon</span>
          </div>
          <a-button class="reward-btn">
            <a-icon type="thunderbolt" />
            打赏 (赏一颗棒棒糖吧~)
          </a-button>
        </div>

        <div class="external-links">
          <h4>打开外链</h4>
          <a-button class="link-btn">
            <span>复制并打开-即梦</span>
            <a-icon type="play-circle" />
          </a-button>
          <a-button class="link-btn">
            <span>复制并打开-Deepseek</span>
            <a-icon type="play-circle" />
          </a-button>
          <a-button class="link-btn">
            <span>复制并打开-chatGPT</span>
            <a-icon type="play-circle" />
          </a-button>
        </div>

        <div class="help-icon">
          <a-icon type="question-circle" />
        </div>
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
      // 组件数据
    }
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'userInfo'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    
    // 复制提示词
    copyPrompt(promptText) {
      navigator.clipboard.writeText(promptText).then(() => {
        this.$message.success('提示词已复制到剪贴板')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    },
    
    // 采集提示词
    collectPrompt() {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }
      
      this.$message.success('采集成功')
    },
    
    // 分享提示词
    sharePrompt() {
      this.$message.info('分享功能开发中...')
    },
    
    // 复制链接
    copyLink() {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl).then(() => {
        this.$message.success('链接已复制到剪贴板')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index-detail-page {
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
    flex-direction: column;
    
    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #000;
      margin-bottom: 2px;
    }
    
    .logo-subtitle {
      font-size: 12px;
      color: #666;
    }
  }
}

.header-center {
  .nav-tabs {
    display: flex;
    gap: 24px;
    
    .nav-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: #f0f0f0;
      }
      
      &.active {
        background: #1890ff;
        color: white;
      }
      
      .anticon {
        font-size: 18px;
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
    gap: 8px;
    
    .action-item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px;
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
}

.main-content {
  flex: 1;
  display: flex;
  height: calc(100vh - 80px);
}

.left-sidebar {
  width: 200px;
  background: #fafafa;
  border-right: 1px solid #f0f0f0;
  padding: 24px 0;
  
  .sidebar-nav {
    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      cursor: pointer;
      transition: background 0.3s;
      
      &:hover {
        background: #f0f0f0;
      }
      
      &.active {
        background: #fff;
        color: #ff4d4f;
        border-right: 3px solid #ff4d4f;
      }
      
      .anticon {
        font-size: 16px;
        margin-right: 8px;
      }
      
      span {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.center-content {
  flex: 1;
  padding: 24px;
  position: relative;
  overflow-y: auto;
}

.search-bar {
  margin-bottom: 32px;
  
  .ant-input-search {
    .ant-input {
      border-radius: 24px;
      height: 48px;
      font-size: 16px;
    }
  }
}

.icon-display-section {
  margin-bottom: 32px;
  
  .icon-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    
    .icon-item {
      cursor: pointer;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
      }
      
      .icon-3d {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
        border-radius: 12px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        transition: box-shadow 0.3s ease;
        
        &:hover {
          box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4);
        }
        
        .server-rack {
          width: 60px;
          height: 60px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          .rack-layer {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
            
            &:nth-child(2) {
              width: 80%;
              margin: 0 auto;
            }
            
            &:nth-child(3) {
              width: 90%;
              margin: 0 auto;
            }
            
            &:nth-child(4) {
              width: 70%;
              margin: 0 auto;
            }
          }
        }
        
        .icon-info {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s ease;
          
          &:hover {
            background: rgba(255, 255, 255, 1);
          }
          
          .anticon {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
  
  .icon-stats {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .views {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
    
    .heart-icon {
      color: #ff4d4f;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.2);
      }
    }
  }
}

.prompt-description {
  margin-bottom: 32px;
  
  .prompt-section {
    margin-bottom: 24px;
    
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    
    .prompt-content {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .prompt-text {
        flex: 1;
        font-size: 14px;
        line-height: 1.6;
        color: #555;
        margin-right: 16px;
      }
      
      .copy-btn {
        color: #1890ff;
        padding: 0;
        height: auto;
        font-size: 14px;
      }
    }
  }
}

.tutorials-section {
  .tutorial-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .red-bar {
      width: 4px;
      height: 20px;
      background: #ff4d4f;
      margin-right: 12px;
      border-radius: 2px;
    }
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
  }
  
  .tutorial-content {
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }
    
    .tutorial-image {
      position: relative;
      width: 100%;
      height: 200px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .truck-icon {
        width: 120px;
        height: 80px;
        position: relative;
        
        .truck-body {
          position: relative;
          width: 100%;
          height: 100%;
          
          .truck-cab {
            position: absolute;
            left: 0;
            top: 20px;
            width: 50px;
            height: 40px;
            background: #fff;
            border-radius: 8px 4px 4px 8px;
            border: 2px solid #ff8c00;
            
            &::before {
              content: '';
              position: absolute;
              top: 8px;
              left: 8px;
              width: 20px;
              height: 20px;
              background: rgba(255, 140, 0, 0.3);
              border-radius: 4px;
            }
          }
          
          .truck-trailer {
            position: absolute;
            right: 0;
            top: 25px;
            width: 70px;
            height: 35px;
            background: #fff;
            border-radius: 4px 8px 8px 4px;
            border: 2px solid #ff8c00;
          }
        }
        
        .truck-wheels {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          
          .wheel {
            width: 16px;
            height: 16px;
            background: #333;
            border-radius: 50%;
            border: 2px solid #666;
            
            &:nth-child(1) { margin-left: 15px; }
            &:nth-child(2) { margin-left: 25px; }
            &:nth-child(3) { margin-right: 25px; }
            &:nth-child(4) { margin-right: 15px; }
          }
        }
      }
      
      .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        
        .page-info {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .detail-text {
          font-size: 14px;
          font-weight: 500;
        }
        
        .anticon {
          font-size: 16px;
          opacity: 0.8;
        }
      }
    }
  }
}

.nav-arrows {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  pointer-events: none;
  
  .nav-arrow {
    position: absolute;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #666;
    cursor: pointer;
    pointer-events: auto;
    
    &.left {
      left: 20px;
    }
    
    &.right {
      right: 20px;
    }
    
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}

.right-sidebar {
  width: 280px;
  background: #fafafa;
  border-left: 1px solid #f0f0f0;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.sidebar-actions {
  margin-bottom: 24px;
  
  .copy-link-btn {
    width: 100%;
    margin-bottom: 12px;
    border-radius: 8px;
  }
  
  .collect-btn {
    width: 100%;
    border-radius: 8px;
    height: 40px;
  }
}

.design-info {
  margin-bottom: 24px;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
  }
  
  .tags {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    
    .tag {
      background: #e8e8e8;
      color: #666;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
  }
  
  .reward-btn {
    width: 100%;
    background: #fff2f0;
    border: 1px solid #ffccc7;
    color: #ff4d4f;
    border-radius: 8px;
    height: 40px;
    
    .anticon {
      margin-right: 8px;
    }
  }
}

.external-links {
  margin-bottom: 24px;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
  }
  
  .link-btn {
    width: 100%;
    margin-bottom: 8px;
    border-radius: 8px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border: 1px solid #d9d9d9;
    
    span {
      color: #333;
    }
    
    .anticon {
      color: #666;
    }
  }
}

.help-icon {
  margin-top: auto;
  text-align: center;
  
  .anticon {
    font-size: 24px;
    color: #ccc;
    cursor: pointer;
    
    &:hover {
      color: #999;
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .left-sidebar {
    width: 160px;
  }
  
  .right-sidebar {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-sidebar,
  .right-sidebar {
    width: 100%;
    order: 2;
  }
  
  .center-content {
    order: 1;
  }
  
  .nav-arrows {
    display: none;
  }
}
</style>
