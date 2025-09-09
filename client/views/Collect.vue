<template>
  <div class="collect-page">
    <!-- 头部导航 -->
    <div class="header">
      <div class="header-left">
        <a-button @click="$router.go(-1)" class="back-btn">
          <a-icon type="arrow-left" />
          返回
        </a-button>
        <div class="logo">
          <a-icon type="collection" class="logo-icon" />
          <span class="logo-text">提示词收集</span>
        </div>
      </div>
      
      <div class="header-right">
        <div class="search-box">
          <a-input-search
            v-model="searchKeyword"
            placeholder="搜索提示词..."
            @search="handleSearch"
            class="search-input"
          />
        </div>
        
        <div class="filter-dropdown">
          <a-dropdown>
            <a-button>
              分类筛选 <a-icon type="down" />
            </a-button>
            <a-menu slot="overlay" @click="handleCategoryFilter">
              <a-menu-item key="all">全部</a-menu-item>
              <a-menu-item key="ai-painting">AI绘画</a-menu-item>
              <a-menu-item key="copywriting">文案创作</a-menu-item>
              <a-menu-item key="code-generation">代码生成</a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        
        <a-button type="primary" @click="$router.push('/collect/add')" class="add-btn">
          <a-icon type="plus" />
          新增分组
        </a-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 分类标签 -->
      <div class="category-tabs">
        <div 
          v-for="category in categories" 
          :key="category.key"
          :class="['category-tab', { active: activeCategory === category.key }]"
          @click="selectCategory(category.key)"
        >
          <a-icon :type="category.icon" />
          <span>{{ category.name }}</span>
          <span class="count">({{ category.count }})</span>
        </div>
      </div>

      <!-- 提示词列表 -->
      <div class="prompt-list">
        <div 
          v-for="prompt in filteredPrompts" 
          :key="prompt.id"
          class="prompt-card"
          @click="viewPrompt(prompt)"
        >
          <div class="prompt-header">
            <h3 class="prompt-title">{{ prompt.title }}</h3>
            <div class="prompt-category">{{ prompt.categoryName }}</div>
          </div>
          
          <div class="prompt-content">
            <p>{{ prompt.content }}</p>
          </div>
          
          <div class="prompt-footer">
            <div class="prompt-meta">
              <span class="author">{{ prompt.author }}</span>
              <span class="time">{{ formatTime(prompt.createdAt) }}</span>
            </div>
            
            <div class="prompt-actions">
              <a-button 
                type="text" 
                size="small"
                @click.stop="collectPrompt(prompt)"
              >
                <a-icon type="star" />
                收藏
              </a-button>
              <a-button 
                type="text" 
                size="small"
                @click.stop="copyPrompt(prompt)"
              >
                <a-icon type="copy" />
                复制
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <a-pagination
          v-model="currentPage"
          :total="totalPrompts"
          :page-size="pageSize"
          show-size-changer
          show-quick-jumper
          @change="handlePageChange"
          @showSizeChange="handlePageSizeChange"
        />
      </div>

      <!-- 空状态 -->
      <div v-if="filteredPrompts.length === 0" class="empty-state">
        <a-icon type="inbox" class="empty-icon" />
        <h3>暂无提示词</h3>
        <p>还没有找到相关的提示词，试试其他分类或关键词</p>
        <a-button type="primary" @click="$router.push('/collect/add')">
          创建第一个提示词
        </a-button>
      </div>
    </div>

    <!-- 快速操作浮动按钮 -->
    <div class="floating-actions">
      <a-button 
        type="primary" 
        shape="circle" 
        size="large"
        @click="$router.push('/collect/add')"
        class="add-float-btn"
      >
        <a-icon type="plus" />
      </a-button>
      
      <a-button 
        shape="circle" 
        size="large"
        @click="$router.push('/collect/my')"
        class="my-float-btn"
      >
        <a-icon type="user" />
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collect',
  data() {
    return {
      searchKeyword: '',
      activeCategory: 'all',
      currentPage: 1,
      pageSize: 12,
      totalPrompts: 0,
      categories: [
        { key: 'all', name: '全部', icon: 'appstore', count: 156 },
        { key: 'ai-painting', name: 'AI绘画', icon: 'picture', count: 68 },
        { key: 'copywriting', name: '文案创作', icon: 'edit', count: 45 },
        { key: 'code-generation', name: '代码生成', icon: 'code', count: 43 }
      ],
      prompts: [
        {
          id: 1,
          title: 'AI绘画风景提示词',
          content: '一个美丽的风景画，包含山脉、湖泊和森林，使用温暖的色调，画面要充满生机和活力。',
          categoryName: 'AI绘画',
          author: 'AI艺术家',
          createdAt: new Date(),
          category: 'ai-painting'
        },
        {
          id: 2,
          title: '文案创作助手',
          content: '为产品写一个吸引人的广告文案，突出产品特色和用户价值，语言要简洁有力。',
          categoryName: '文案创作',
          author: '文案达人',
          createdAt: new Date(),
          category: 'copywriting'
        },
        {
          id: 3,
          title: '代码生成模板',
          content: '生成一个完整的React组件，包含状态管理、事件处理和样式，代码要规范清晰。',
          categoryName: '代码生成',
          author: '代码专家',
          createdAt: new Date(),
          category: 'code-generation'
        },
        {
          id: 4,
          title: '人物肖像绘画',
          content: '高质量的人物肖像，注重面部细节和表情，使用柔和的光影效果。',
          categoryName: 'AI绘画',
          author: '画师小王',
          createdAt: new Date(),
          category: 'ai-painting'
        }
      ]
    }
  },
  computed: {
    filteredPrompts() {
      let filtered = this.prompts
      
      // 分类筛选
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === this.activeCategory)
      }
      
      // 关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(keyword) ||
          p.content.toLowerCase().includes(keyword) ||
          p.author.toLowerCase().includes(keyword)
        )
      }
      
      this.totalPrompts = filtered.length
      return filtered
    }
  },
  methods: {
    selectCategory(categoryKey) {
      this.activeCategory = categoryKey
      this.currentPage = 1
    },
    
    handleSearch(value) {
      this.searchKeyword = value
      this.currentPage = 1
    },
    
    handleCategoryFilter({ key }) {
      this.activeCategory = key
      this.currentPage = 1
    },
    
    handlePageChange(page) {
      this.currentPage = page
    },
    
    handlePageSizeChange(current, size) {
      this.pageSize = size
      this.currentPage = 1
    },
    
    viewPrompt(prompt) {
      this.$router.push(`/collect/preview/${prompt.id}`)
    },
    
    collectPrompt(prompt) {
      this.$message.success(`已收藏: ${prompt.title}`)
    },
    
    copyPrompt(prompt) {
      navigator.clipboard.writeText(prompt.content).then(() => {
        this.$message.success('提示词已复制到剪贴板')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    },
    
    formatTime(time) {
      return new Date(time).toLocaleDateString()
    }
  }
}
</script>

<style lang="scss" scoped>
.collect-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  padding: 20px 24px;
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

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .search-box {
    .search-input {
      width: 300px;
      
      .ant-input {
        border-radius: 20px;
      }
    }
  }
  
  .filter-dropdown {
    .ant-btn {
      border-radius: 20px;
      height: 36px;
      padding: 0 16px;
    }
  }
  
  .add-btn {
    border-radius: 20px;
    height: 36px;
    padding: 0 20px;
    font-weight: 500;
  }
}

.main-content {
  flex: 1;
  padding: 24px;
}

.category-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  background: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .category-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 24px;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;
    
    &:hover {
      background: #f0f8ff;
      border-color: #91d5ff;
    }
    
    &.active {
      background: #e6f7ff;
      border-color: #1890ff;
      color: #1890ff;
    }
    
    .anticon {
      font-size: 16px;
    }
    
    span {
      font-size: 14px;
      font-weight: 500;
    }
    
    .count {
      font-size: 12px;
      opacity: 0.7;
    }
  }
}

.prompt-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.prompt-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-color: #1890ff;
  }
}

.prompt-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  
  .prompt-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
    flex: 1;
    margin-right: 12px;
  }
  
  .prompt-category {
    background: #e6f7ff;
    color: #1890ff;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    white-space: nowrap;
  }
}

.prompt-content {
  margin-bottom: 16px;
  
  p {
    color: #666;
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.prompt-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .prompt-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #999;
    
    .author {
      color: #1890ff;
    }
  }
  
  .prompt-actions {
    display: flex;
    gap: 8px;
    
    .ant-btn {
      padding: 0 8px;
      height: 28px;
      font-size: 12px;
      
      .anticon {
        margin-right: 4px;
      }
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 24px;
  
  .empty-icon {
    font-size: 64px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }
  
  h3 {
    font-size: 20px;
    color: #666;
    margin-bottom: 8px;
  }
  
  p {
    color: #999;
    margin-bottom: 24px;
  }
  
  .ant-btn {
    border-radius: 20px;
    height: 40px;
    padding: 0 24px;
  }
}

.floating-actions {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1000;
  
  .add-float-btn {
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  }
  
  .my-float-btn {
    background: #52c41a;
    border-color: #52c41a;
    color: white;
    box-shadow: 0 4px 12px rgba(82, 196, 26, 0.4);
    
    &:hover {
      background: #73d13d;
      border-color: #73d13d;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .header {
    padding: 16px;
    flex-direction: column;
    gap: 16px;
    
    .header-right {
      width: 100%;
      justify-content: space-between;
      
      .search-box {
        .search-input {
          width: 200px;
        }
      }
    }
  }
  
  .main-content {
    padding: 16px;
  }
  
  .category-tabs {
    padding: 12px 16px;
    overflow-x: auto;
    
    .category-tab {
      padding: 8px 16px;
      white-space: nowrap;
    }
  }
  
  .prompt-list {
    grid-template-columns: 1fr;
  }
  
  .floating-actions {
    right: 16px;
    bottom: 16px;
  }
}
</style>
