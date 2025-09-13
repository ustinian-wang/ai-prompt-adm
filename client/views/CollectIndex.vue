<template>
  <div class="content-wrapper">

<!-- 主要内容区域 -->
<div class="main-content">
  <!-- 搜索区域 -->
  <div class="search-header">
    
    <div class="search-bar">
      <a-input-search
        placeholder="请输入行业关键词搜索"
        enter-button
        size="large"
      />
    </div>
    
  </div>

  <!-- 分类标签 -->
  <div class="category-tabs">
    <div 
      v-for="category in categories" 
      :key="category"
      class="category-tab"
      :class="{ active: selectedCategory === category }"
      @click="selectCategory(category)"
    >
      {{ category }}
    </div>
  </div>

  <!-- 内容网格 -->
  <div class="content-grid">
    <div 
      v-for="(item, index) in contentItems" 
      :key="index"
      class="content-item"
      @mouseenter="hoveredItem = index"
      @mouseleave="hoveredItem = null"
      @click="goDetail(item)"
    >
      <div class="item-image">
        <img v-if="item.cover" :src="item.cover" alt="cover" class="item-cover" />
        <div v-else class="icon-3d">
          <div class="card-stack">
            <div class="card red-card"></div>
            <div class="card white-card"></div>
            <div class="card white-card"></div>
          </div>
          <div class="base-circle"></div>
          <div class="orbit-line"></div>
        </div>
        <div v-if="hoveredItem === index" class="collect-btn" @click.stop="collectPrompt(item)">
          采集
        </div>
      </div>
      <div class="item-info">
        <div class="item-title">
          <span>{{ item.title }}</span>
          <div class="item-stats">
            <span class="count">{{ formatCount(item.count) }}</span>
            <a-icon 
              type="heart" 
              :class="{ liked: item.liked }"
            />
          </div>
        </div>
        <div class="item-tags">
          <span class="tag" v-for="(t, ti) in (item.tags || []).slice(0, 3)" :key="ti">#{{ t }}</span>
        </div>
      </div>
    </div>
  </div>
  </div>

  <!-- 作品详情模态框 -->
  <WorkDetailModal
    :visible="modalVisible"
    :work-id="selectedWorkId"
    @close="closeModal"
  />
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getWorksPublicListApi } from '../../src/api/worksApi'
import WorkDetailModal from '../components/WorkDetailModal.vue'

export default {
  name: 'Index',
  components: {
    WorkDetailModal
  },
  data() {
    return {
      selectedCategory: '全部',
      hoveredItem: null,
      categories: [
        '全部', '广告设计', '室内设计', '产品设计', '开发编程', 
        '短视频', '影视电影', '电商设计', 'UI设计', '金融', 
        '化工配方', '生物', '法律法规', '食物'
      ],
      contentItems: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0
      },
      loading: false,
      // 模态框相关状态
      modalVisible: false,
      selectedWorkId: null
    }
  },
  created() {
    this.fetchWorks()
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'userInfo'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    
    selectCategory(category) {
      this.selectedCategory = category
      this.pagination.page = 1
      this.fetchWorks()
    },
    
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
    
    goDetail(item){
      if(!item || !item.id){
        return
      }
      // 打开模态框而不是页面跳转
      this.selectedWorkId = item.id
      this.modalVisible = true
    },
    
    // 关闭模态框
    closeModal() {
      this.modalVisible = false
      this.selectedWorkId = null
    },
    
    // 采集提示词
    collectPrompt(item) {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }
      
      console.log('点击采集，作品数据:', item)
      // 打开采集模态框
      this.selectedWorkId = item.id
      this.modalVisible = true
      console.log('设置selectedWorkId:', this.selectedWorkId)
    },
    
    async fetchWorks() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          work_name: '',
          // 可在此映射 selectedCategory 到后端 category_id，如果有对照表
        }
        const res = await getWorksPublicListApi(params)
        if (res.data && res.data.success) {
          const works = res.data.works || []
          const pagination = res.data.pagination || null
          // 将后端数据映射到展示结构
          this.contentItems = (works || []).map(w => ({
            id: w.work_id,
            title: w.work_name || '未命名作品',
            liked: false,
            cover: w.work_img_path || (w.metadata && w.metadata.cover) || '',
            tags: (w.metadata && (w.metadata.tags || w.metadata.keywords)) || [],
            count: (w.metadata && (w.metadata.views || w.metadata.favs)) || 0
          }))
          if (pagination) {
            this.pagination.page = pagination.page
            this.pagination.limit = pagination.limit
            this.pagination.total = pagination.total
          }
        } else {
          this.$message.error((res.data && res.data.msg) || '获取作品失败')
        }
      } catch (e) {
        this.$message.error('获取作品失败')
      } finally {
        this.loading = false
      }
    },

    formatCount(num) {
      if (!num) return 0
      if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
      return num
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

.content-wrapper {
  display: flex;
  flex: 1;
}


.main-content {
  flex: 1;
  background: #f5f5f5;
}

.search-header {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  .search-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    
    .info-icon {
      width: 24px;
      height: 24px;
      background: #ff4d4f;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
    
    .info-text {
      h1 {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
      
      p {
        font-size: 12px;
        color: #666;
        margin: 0;
      }
    }
  }
  
  .search-bar {
    margin-bottom: 16px;
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #666;
    font-size: 14px;
    
    .anticon {
      font-size: 12px;
    }
  }
}

.category-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  .category-tab {
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
    font-size: 14px;
    color: #666;
    background: #fff;
    border: 1px solid #f0f0f0;
    
    &:hover {
      background: #f0f0f0;
    }
    
    &.active {
      background: #ff4d4f;
      color: white;
      border-color: #ff4d4f;
    }
  }
}

.content-grid {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  .content-item {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    width: 240px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .item-image {
      position: relative;
      height: 120px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      
      .item-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      
      .icon-3d {
        position: relative;
        width: 60px;
        height: 60px;
        
        .card-stack {
          position: relative;
          width: 100%;
          height: 100%;
          
          .card {
            position: absolute;
            width: 30px;
            height: 20px;
            border-radius: 2px;
            
            &.red-card {
              background: #ff4d4f;
              top: 10px;
              left: 15px;
              z-index: 3;
              
              &::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 12px;
                height: 2px;
                background: white;
                box-shadow: 0 2px 0 white, 0 4px 0 white;
              }
            }
            
            &.white-card {
              background: rgba(255, 255, 255, 0.8);
              top: 15px;
              left: 12px;
              z-index: 2;
              
              &:nth-child(3) {
                top: 20px;
                left: 9px;
                z-index: 1;
              }
            }
          }
        }
        
        .base-circle {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #ff4d4f, #ff7875);
          border-radius: 50%;
          z-index: 0;
        }
        
        .orbit-line {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 60px;
          border: 1px solid white;
          border-radius: 50%;
          z-index: 0;
        }
      }
      
      .collect-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #ff4d4f;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
      }
    }
    
    .item-info {
      padding: 12px;
      
      .item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        span {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        
        .item-stats {
          display: flex;
          align-items: center;
          gap: 4px;
          
          .count {
            font-size: 12px;
            color: #666;
          }
          
          .anticon {
            font-size: 12px;
            color: #d9d9d9;
            
            &.liked {
              color: #ff4d4f;
            }
          }
        }
      }
      
      .item-tags {
        display: flex;
        gap: 4px;
        
        .tag {
          font-size: 10px;
          color: #666;
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 2px;
        }
      }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  
  .page-info {
    font-size: 14px;
    color: #666;
  }
  
  .pagination-controls {
    display: flex;
    gap: 8px;
    
    .anticon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
      color: #666;
      
      &:hover {
        background: #f0f0f0;
      }
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
      }
    }
  }
  
  .content-wrapper {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    order: 2;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .content-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .category-tabs {
    gap: 8px;
    
    .category-tab {
      padding: 6px 12px;
      font-size: 12px;
    }
  }
}
</style>
