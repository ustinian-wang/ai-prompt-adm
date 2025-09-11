<template>
  <div class="collect-preview-page">
    <!-- 头部导航 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-text">即时设计</span>
          <span class="logo-subtitle">提示词收集项目</span>
        </div>
      </div>
      
      <div class="header-center">
        <div class="search-container">
          <div class="search-dropdown">
            <a-dropdown>
              <a-button class="dropdown-btn">
                我的收集 <a-icon type="down" />
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="1">我的收集</a-menu-item>
                <a-menu-item key="2">全部收集</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div class="search-input">
            <a-input-search
              placeholder="请输入行业关键词搜索"
              size="large"
              @search="onSearch"
            >
              <a-icon slot="prefix" type="search" />
            </a-input-search>
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <div class="header-actions">
          <a-button class="action-btn">
            <a-icon type="code" />
          </a-button>
          <a-button class="action-btn">
            <a-icon type="play-circle" />
          </a-button>
          <a-button class="action-btn">
            <span>未</span>
          </a-button>
          <a-button class="action-btn">
            <span>未</span>
          </a-button>
          <a-button class="action-btn">
            <span>未</span>
          </a-button>
          <a-dropdown>
            <a-button class="action-btn">
              无边框 <a-icon type="down" />
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item key="1">无边框</a-menu-item>
              <a-menu-item key="2">有边框</a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-button class="action-btn">
            <a-icon type="share-alt" />
            分享
          </a-button>
          <a-button class="action-btn">
            <a-icon type="fullscreen" />
          </a-button>
          <a-button class="login-btn">
            登录/注册
          </a-button>
        </div>
      </div>
    </div>

    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="nav-item active">
        <a-icon type="home" />
        <span>首页</span>
      </div>
      <div class="nav-item">
        <a-icon type="folder" />
        <span>我的收集</span>
      </div>
    </div>

    <!-- 分类导航栏 -->
    <div class="category-nav">
      <div class="category-tabs">
        <div class="tab active">全部</div>
        <div class="tab">广告设计</div>
        <div class="tab">室内设计</div>
        <div class="tab">产品设计</div>
        <div class="tab">开发编程</div>
        <div class="tab">短视频</div>
        <div class="tab">影视电影</div>
        <div class="tab">电商设计</div>
        <div class="tab">UI设计</div>
        <div class="tab">金融</div>
        <div class="tab">化工配方</div>
        <div class="tab">生物</div>
        <div class="tab">法律法规</div>
        <div class="tab">食物</div>
        <div class="tab">音乐</div>
        <div class="tab">宠物</div>
        <div class="tab">房地产</div>
        <div class="tab">贸易</div>
        <div class="tab">建筑</div>
        <div class="tab">电网</div>
        <div class="tab">水利工程</div>
        <div class="tab">环保</div>
        <div class="expand-btn">
          展开▼
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-wrapper">
        <!-- 导航箭头 -->
        <div class="nav-arrow left">
          <a-icon type="left" />
        </div>
        
        <!-- 设计资产展示 -->
        <div class="design-assets">
          <div class="asset-item" v-for="(asset, index) in designAssets" :key="index">
            <div class="asset-image">
              <div class="d3-icon">
                <div class="icon-base"></div>
                <div class="icon-layers">
                  <div class="layer layer-1"></div>
                  <div class="layer layer-2"></div>
                  <div class="layer layer-3"></div>
                </div>
                <div class="orbit-line"></div>
              </div>
            </div>
            
            <div class="asset-info">
              <div class="asset-title">3D图标设计</div>
              <div class="asset-tags">
                <span class="tag">#UI</span>
                <span class="tag">#3D</span>
                <span class="tag">#icon</span>
              </div>
              <div class="asset-stats">
                <a-icon type="heart" />
                <span>1.2w</span>
              </div>
              <div class="prompt-section">
                <div class="prompt-label">中文提示词:</div>
                <div class="prompt-content">
                  卡车,ui图标设计,蓝色和橙色,高品质,许多细节,oc渲染,透明磨砂玻璃材质,干净背景,未来科技感,等距照明,工作室照明,等距渲染,OC渲染,Blender, 3d, C4D, 4k
                </div>
              </div>
              <div class="prompt-section">
                <div class="prompt-label">英文提示词:</div>
                <div class="prompt-content">
                  Logistics truck, ui icon design, blue and orange, high quality, many details, oc rendering, transparent frosted glass material, clean background, future technology sense, isometric lighting, studio lighting, isometric rendering, OC rendering, Blender, 3D, C4D, 4K
                </div>
              </div>
            </div>
            
            <!-- 收集弹窗 -->
            <div class="collection-popup" v-if="showCollectionPopup === index">
              <div class="popup-header">
                <h3>我的收集</h3>
              </div>
              <div class="popup-content">
                <div class="category-list">
                  <label class="category-item" v-for="category in categories" :key="category.id">
                    <a-radio :value="category.id" v-model="selectedCategory">
                      {{ category.name }}
                    </a-radio>
                  </label>
                </div>
                <div class="add-group-btn">
                  <a-button type="primary" class="add-group">
                    <a-icon type="plus" />
                    新增分组
                  </a-button>
                </div>
              </div>
              <div class="popup-actions">
                <a-button @click="cancelCollection">取消</a-button>
                <a-button type="primary" @click="confirmCollection">采集</a-button>
              </div>
            </div>
            
            <!-- 收集按钮 -->
            <div class="collect-btn" @click="showCollection(index)">
              <a-icon type="star" />
              收集
            </div>
          </div>
        </div>
        
        <!-- 导航箭头 -->
        <div class="nav-arrow right">
          <a-icon type="right" />
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="bottom-bar">
      <div class="status-info">
        <span>4/4 采集</span>
      </div>
      <div class="bottom-actions">
        <a-button class="action-btn">
          <a-icon type="reload" />
        </a-button>
        <a-button class="action-btn">
          <a-icon type="question-circle" />
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectPreview',
  data() {
    return {
      showCollectionPopup: null,
      selectedCategory: null,
      designAssets: [
        { id: 1, title: '3D图标设计' },
        { id: 2, title: '3D图标设计' }
      ],
      categories: [
        { id: 1, name: '广告设计' },
        { id: 2, name: 'UI设计' },
        { id: 3, name: '开发编程' },
        { id: 4, name: '金融' }
      ]
    }
  },
  methods: {
    onSearch(value) {
      console.log('搜索:', value)
    },
    
    showCollection(index) {
      this.showCollectionPopup = index
      this.selectedCategory = this.categories[0].id
    },
    
    cancelCollection() {
      this.showCollectionPopup = null
      this.selectedCategory = null
    },
    
    confirmCollection() {
      if (this.selectedCategory) {
        this.$message.success('收集成功')
        this.showCollectionPopup = null
        this.selectedCategory = null
      } else {
        this.$message.warning('请选择分类')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.collect-preview-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  position: relative;
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
    flex-direction: column;
    
    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: #333;
      line-height: 1.2;
    }
    
    .logo-subtitle {
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }
  }
}

.header-center {
  flex: 1;
  max-width: 600px;
  margin: 0 40px;
  
  .search-container {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .search-dropdown {
      .dropdown-btn {
        height: 40px;
        border-radius: 8px;
        font-weight: 500;
      }
    }
    
    .search-input {
      flex: 1;
      
      .ant-input-search {
        .ant-input {
          border-radius: 8px;
          height: 40px;
        }
        
        .ant-btn {
          border-radius: 0 8px 8px 0;
          height: 40px;
        }
      }
    }
  }
}

.header-right {
  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .action-btn {
      height: 36px;
      border-radius: 6px;
      padding: 0 12px;
      font-size: 12px;
      border: 1px solid #d9d9d9;
      
      &.ant-btn {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    .login-btn {
      height: 36px;
      border-radius: 18px;
      padding: 0 20px;
      background: #1890ff;
      color: white;
      border: none;
      font-weight: 500;
      
      &:hover {
        background: #40a9ff;
      }
    }
  }
}

.sidebar {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border-radius: 0 12px 12px 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 16px 8px;
  z-index: 90;
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    margin-bottom: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &.active {
      background: #e6f7ff;
      color: #1890ff;
    }
    
    &:hover {
      background: #f0f0f0;
    }
    
    .anticon {
      font-size: 20px;
      margin-bottom: 4px;
    }
    
    span {
      font-size: 12px;
      font-weight: 500;
    }
  }
}

.category-nav {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  overflow-x: auto;
  
  .category-tabs {
    display: flex;
    align-items: center;
    gap: 0;
    white-space: nowrap;
    
    .tab {
      padding: 16px 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s;
      font-size: 14px;
      color: #666;
      
      &.active {
        color: #1890ff;
        border-bottom-color: #1890ff;
      }
      
      &:hover {
        color: #1890ff;
      }
    }
    
    .expand-btn {
      padding: 16px 20px;
      color: #999;
      cursor: pointer;
      font-size: 14px;
      
      &:hover {
        color: #666;
      }
    }
  }
}

.main-content {
  flex: 1;
  padding: 24px;
  position: relative;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  
  &.left {
    left: -20px;
  }
  
  &.right {
    right: -20px;
  }
  
  .anticon {
    font-size: 18px;
    color: #666;
  }
  
  &:hover {
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.design-assets {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex: 1;
}

.asset-item {
  position: relative;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 400px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
}

.asset-image {
  height: 200px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  .d3-icon {
    position: relative;
    width: 120px;
    height: 120px;
    
    .icon-base {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 80px;
      background: #ff4757;
      border-radius: 50%;
    }
    
    .icon-layers {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      
      .layer {
        position: absolute;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 4px;
        
        &.layer-1 {
          width: 60px;
          height: 8px;
          top: 0;
          left: -30px;
        }
        
        &.layer-2 {
          width: 40px;
          height: 8px;
          top: 20px;
          left: -20px;
        }
        
        &.layer-3 {
          width: 20px;
          height: 8px;
          top: 40px;
          left: -10px;
        }
      }
    }
    
    .orbit-line {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-radius: 50%;
    }
  }
}

.asset-info {
  padding: 20px;
}

.asset-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.asset-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  
  .tag {
    background: #f0f0f0;
    color: #666;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
  }
}

.asset-stats {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  color: #ff4757;
  font-size: 14px;
  
  .anticon {
    font-size: 16px;
  }
}

.prompt-section {
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .prompt-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
  }
  
  .prompt-content {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
    background: #f8f9fa;
    padding: 8px;
    border-radius: 6px;
    border-left: 3px solid #1890ff;
  }
}

.collect-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #d9d9d9;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
  
  &:hover {
    background: #fff;
    border-color: #1890ff;
    color: #1890ff;
  }
  
  .anticon {
    font-size: 14px;
  }
}

.collection-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  width: 320px;
  z-index: 1000;
  
  .popup-header {
    padding: 20px 20px 16px;
    border-bottom: 1px solid #f0f0f0;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .popup-content {
    padding: 16px 20px;
    
    .category-list {
      margin-bottom: 16px;
      
      .category-item {
        display: block;
        padding: 8px 0;
        cursor: pointer;
        
        .ant-radio-wrapper {
          width: 100%;
        }
      }
    }
    
    .add-group-btn {
      .add-group {
        width: 100%;
        height: 36px;
        border-radius: 18px;
        background: #ff4757;
        border-color: #ff4757;
        
        &:hover {
          background: #ff3742;
          border-color: #ff3742;
        }
      }
    }
  }
  
  .popup-actions {
    padding: 16px 20px 20px;
    display: flex;
    gap: 12px;
    
    .ant-btn {
      flex: 1;
      height: 36px;
      border-radius: 18px;
    }
  }
}

.bottom-bar {
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .status-info {
    font-size: 14px;
    color: #666;
  }
  
  .bottom-actions {
    display: flex;
    gap: 8px;
    
    .action-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #d9d9d9;
      
      .anticon {
        font-size: 16px;
        color: #666;
      }
      
      &:hover {
        border-color: #1890ff;
        color: #1890ff;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .design-assets {
    gap: 20px;
  }
  
  .asset-item {
    width: 350px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
    flex-direction: column;
    gap: 16px;
    
    .header-center {
      margin: 0;
      order: 3;
      width: 100%;
    }
  }
  
  .sidebar {
    display: none;
  }
  
  .category-nav {
    padding: 0 16px;
    
    .category-tabs {
      .tab {
        padding: 12px 16px;
        font-size: 13px;
      }
    }
  }
  
  .main-content {
    padding: 16px;
  }
  
  .design-assets {
    flex-direction: column;
    gap: 20px;
  }
  
  .asset-item {
    width: 100%;
    max-width: 400px;
  }
  
  .nav-arrow {
    display: none;
  }
}
</style>
