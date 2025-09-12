<template>
  <div class="collect-add-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <a-button @click="$router.go(-1)" class="back-btn">
        <a-icon type="arrow-left" />
        返回
      </a-button>
      <h1>新增分组</h1>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="content">
      <div class="modal-container">
        <!-- 左侧：创建分组 -->
        <div class="left-section">
          <h2 class="section-title">创建分组</h2>
          <div class="form-container">
            <a-input
              v-model="newGroupName"
              placeholder="请输入分组名称"
              class="group-input"
              size="large"
            />
            <div class="action-buttons">
              <a-button 
                class="cancel-btn"
                @click="$router.go(-1)"
              >
                取消
              </a-button>
              <a-button 
                type="primary"
                class="create-btn"
                :loading="creating"
                @click="handleCreateGroup"
              >
                创建
              </a-button>
            </div>
          </div>
        </div>
        
        <!-- 右侧：我的收集 -->
        <div class="right-section">
          <h2 class="section-title">我的收集</h2>
          <div class="collections-list">
            <div 
              v-for="collection in collections" 
              :key="collection.id"
              :class="['collection-item', { active: selectedCollectionId === collection.id }]"
              @click="selectCollection(collection.id)"
            >
              <span class="collection-name">{{ collection.name }}</span>
              <div class="collection-indicator">
                <div 
                  :class="['indicator-dot', { active: selectedCollectionId === collection.id }]"
                ></div>
              </div>
            </div>
          </div>
          
          <div class="add-new-group">
            <a-button 
              type="link" 
              class="add-group-link"
              @click="showAddGroupForm = true"
            >
              + 新增分组
            </a-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部导航提示 -->
    <div class="bottom-nav">
      <span class="nav-text">3/4 采集-新增分组</span>
      <div class="nav-icons">
        <a-icon type="appstore" class="nav-icon" />
        <a-icon type="appstore" class="nav-icon" />
        <a-icon type="reload" class="nav-icon" />
      </div>
      <a-icon type="question-circle" class="help-icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectAdd',
  data() {
    return {
      newGroupName: '',
      creating: false,
      selectedCollectionId: null,
      showAddGroupForm: false,
      collections: []
    }
  },
  mounted() {
    this.loadGroups()
  },
  methods: {
    selectCollection(collectionId) {
      this.selectedCollectionId = collectionId
    },
    
    async handleCreateGroup() {
      if (!this.newGroupName.trim()) {
        this.$message.warning('请输入分组名称')
        return
      }
      
      this.creating = true
      
      try {
        const mem_id = this.$store.getters['auth/userInfo']?.mem_id || this.$store.getters['user/currentUser']?.id
        if (!mem_id) {
          this.$message.error('请先登录')
          return
        }
        const { default: request } = await import('../../src/utils/request')
        const res = await request.post('/api/member/mem_group/create', { mem_id, name: this.newGroupName.trim() })
        const data = res?.data?.data || res?.data
        const newCollection = { id: data.mg_id, name: data.mg_name }
        this.collections.push(newCollection)
        this.selectedCollectionId = newCollection.id
        this.newGroupName = ''
        this.$message.success('分组创建成功')
      } catch (error) {
        this.$message.error('创建失败，请重试')
      } finally {
        this.creating = false
      }
    },

    async loadGroups() {
      try {
        const mem_id = this.$store.getters['auth/userInfo']?.mem_id || this.$store.getters['user/currentUser']?.id
        if (!mem_id) return
        const { default: request } = await import('../../src/utils/request')
        const res = await request.get('/api/member/mem_group/list', { params: { mem_id, page: 1, limit: 100 } })
        const list = res?.data?.data?.list || []
        this.collections = list.map(x => ({ id: x.mg_id, name: x.mg_name }))
        if (this.collections.length > 0) this.selectedCollectionId = this.collections[0].id
      } catch (e) {
        // ignore
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.collect-add-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  position: relative;
}

.page-header {
  background: #fff;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  
  .back-btn {
    margin-right: 16px;
    border: none;
    box-shadow: none;
    
    &:hover {
      background: #f0f0f0;
    }
  }
  
  h1 {
    margin: 0;
    color: #333;
    font-size: 20px;
    font-weight: 600;
  }
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
}

.modal-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  max-width: 800px;
  width: 100%;
  overflow: hidden;
}

.left-section {
  flex: 1;
  padding: 32px;
  border-right: 1px solid #f0f0f0;
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 24px 0;
  }
  
  .form-container {
    .group-input {
      margin-bottom: 24px;
      
      :deep(.ant-input) {
        border-radius: 8px;
        border: 1px solid #d9d9d9;
        padding: 12px 16px;
        font-size: 16px;
        
        &:focus {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 12px;
      
      .cancel-btn {
        flex: 1;
        height: 40px;
        border: 1px solid #d9d9d9;
        border-radius: 8px;
        color: #666;
        background: #fff;
        
        &:hover {
          border-color: #40a9ff;
          color: #40a9ff;
        }
      }
      
      .create-btn {
        flex: 1;
        height: 40px;
        border-radius: 8px;
        background: #333;
        border: none;
        color: #fff;
        
        &:hover {
          background: #555;
        }
        
        &:active {
          background: #222;
        }
      }
    }
  }
}

.right-section {
  flex: 1;
  padding: 32px;
  background: #fafafa;
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 24px 0;
  }
  
  .collections-list {
    margin-bottom: 24px;
    
    .collection-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: #f0f0f0;
      }
      
      &.active {
        background: #e6f7ff;
      }
      
      .collection-name {
        color: #333;
        font-size: 14px;
      }
      
      .collection-indicator {
        .indicator-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d9d9d9;
          transition: all 0.2s ease;
          
          &.active {
            background: #ff4d4f;
            transform: scale(1.2);
          }
        }
      }
    }
  }
  
  .add-new-group {
    .add-group-link {
      color: #1890ff;
      font-size: 14px;
      padding: 0;
      height: auto;
      
      &:hover {
        color: #40a9ff;
      }
    }
  }
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .nav-text {
    color: #666;
    font-size: 14px;
  }
  
  .nav-icons {
    display: flex;
    gap: 16px;
    
    .nav-icon {
      color: #999;
      font-size: 16px;
      cursor: pointer;
      
      &:hover {
        color: #666;
      }
    }
  }
  
  .help-icon {
    color: #999;
    font-size: 18px;
    cursor: pointer;
    
    &:hover {
      color: #666;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .modal-container {
    flex-direction: column;
    max-width: 100%;
    margin: 0 16px;
  }
  
  .left-section,
  .right-section {
    padding: 24px;
  }
  
  .left-section {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .content {
    padding: 20px 16px;
  }
  
  .bottom-nav {
    padding: 12px 16px;
    
    .nav-text {
      font-size: 12px;
    }
  }
}
</style>
