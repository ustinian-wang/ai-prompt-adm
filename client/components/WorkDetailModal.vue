<template>
  <a-modal
    :visible="visible"
    :width="1200"
    :footer="null"
    :closable="true"
    :mask-closable="true"
    :destroy-on-close="true"
    @cancel="handleCancel"
    class="work-detail-modal"
  >
    <div class="modal-content">
      <!-- 左侧作品详情 -->
      <div class="left-content">
        <!-- 3D图标展示区 -->
        <div class="work-icon-section">
          <div class="icon-3d">
            <div class="card-stack">
              <div class="card red-card">
                <div class="card-lines"></div>
              </div>
              <div class="card white-card"></div>
              <div class="card white-card"></div>
            </div>
            <div class="base-circle"></div>
            <div class="orbit-line"></div>
          </div>
        </div>

        <!-- 作品信息 -->
        <div class="work-info-section">
          <h2 class="work-title">{{ work ? work.work_name : '3D图标设计' }}</h2>
          <div class="work-tags">
            <span 
              v-for="(tag, index) in (work && work.metadata && (work.metadata.tags || work.metadata.keywords)) || ['#UI', '#3D', '#icon']" 
              :key="index"
              class="tag"
            >
              {{ tag.startsWith('#') ? tag : '#' + tag }}
            </span>
          </div>
          <div class="work-stats">
            <span class="views">{{ work ? formatCount(work.metadata && (work.metadata.views || work.metadata.favs) || 0) : '1.2w' }}</span>
            <a-icon type="heart" class="heart-icon" />
          </div>
        </div>

        <!-- 提示词描述 -->
        <div class="prompt-sections">
          <div class="prompt-section" v-if="work && work.work_prompt_cn">
            <h4>中文提示词:</h4>
            <div class="prompt-content">
              <p>{{ work.work_prompt_cn }}</p>
              <a-button type="link" class="copy-btn" @click="copyPrompt(work.work_prompt_cn)">复制</a-button>
            </div>
          </div>
          
          <div class="prompt-section" v-if="work && work.work_prompt_en">
            <h4>英文提示词:</h4>
            <div class="prompt-content">
              <p>{{ work.work_prompt_en }}</p>
              <a-button type="link" class="copy-btn" @click="copyPrompt(work.work_prompt_en)">复制</a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧收集区域 -->
      <div class="right-sidebar">
        <div class="sidebar-header">
          <h3>我的收集</h3>
        </div>
        
        <div class="sidebar-content">
          <!-- 新增分组状态 - 当没有分组数据时显示 -->
          <div v-if="!hasGroups" class="add-group-section">
            <div class="add-group-icon">
              <a-icon type="plus" />
            </div>
            <div class="add-group-text">新增分组</div>
          </div>

          <!-- 分组列表状态 - 当有分组数据时显示 -->
          <div v-else class="group-list-section">
            <div class="group-options">
              <div 
                v-for="group in groupOptions" 
                :key="group.id"
                class="group-option"
                :class="{ selected: selectedGroupId === group.id }"
                @click="selectGroup(group.id)"
              >
                <span class="group-name">{{ group.name }}</span>
                <div class="radio-button" :class="{ selected: selectedGroupId === group.id }">
                  <div class="radio-dot" v-if="selectedGroupId === group.id"></div>
                </div>
              </div>
            </div>
            
            <!-- 新增分组选项 -->
            <div class="add-group-option" @click="showAddGroup">
              <div class="add-group-icon-small">
                <a-icon type="plus" />
              </div>
              <span class="add-group-text-small">新增分组</span>
            </div>
          </div>
        </div>
        
        <div class="sidebar-footer">
          <a-button class="cancel-btn" @click="handleCancel">取消</a-button>
          <a-button type="primary" class="collect-btn" @click="handleCollect">采集</a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getWorkDetailPublicApi } from '../../src/api/worksApi'

export default {
  name: 'WorkDetailModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    workId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      work: null,
      loading: false,
      // 分组相关状态
      selectedGroupId: null,
      groupOptions: [
        { id: 1, name: '广告设计' },
        { id: 2, name: 'UI设计' },
        { id: 3, name: '开发编程' },
        { id: 4, name: '金融' }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'userInfo']),
    
    // 判断是否有分组数据
    hasGroups() {
      return this.groupOptions && this.groupOptions.length > 0
    }
  },
  watch: {
    visible(newVal) {
      if (newVal && this.workId) {
        this.fetchDetail()
      }
    },
    workId(newVal) {
      if (newVal && this.visible) {
        this.fetchDetail()
      }
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    
    normalizeWork(payload) {
      if (!payload) return null
      // 支持 { data: {...} } 或 { dataValues: {...} } 或 直接对象
      const maybe = payload.data || payload
      const values = maybe.dataValues || maybe
      return values
    },
    
    async fetchDetail() {
      if (!this.workId) {
        this.$message.error('无效的作品ID')
        return
      }
      
      console.log('正在获取作品详情，ID:', this.workId)
      this.loading = true
      try {
        const res = await getWorkDetailPublicApi(this.workId)
        console.log('API响应:', res)
        if (res.data && res.data.success) {
          this.work = this.normalizeWork(res.data)
          console.log('处理后的作品数据:', this.work)
        } else {
          this.$message.error((res.data && res.data.msg) || '获取详情失败')
        }
      } catch (e) {
        console.error('获取作品详情失败:', e)
        this.$message.error('获取详情失败')
      } finally {
        this.loading = false
      }
    },
    
    // 格式化数字
    formatCount(num) {
      if (!num) return 0
      if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
      return num
    },
    
    // 复制提示词
    copyPrompt(promptText) {
      navigator.clipboard.writeText(promptText).then(() => {
        this.$message.success('提示词已复制到剪贴板')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    },
    
    openExternal(link) {
      if (!link || !link.url) {
        return
      }
      const url = link.url
      navigator.clipboard.writeText(url).catch(() => {})
      window.open(url, '_blank')
    },
    
    // 复制链接
    copyLink() {
      const currentUrl = window.location.href
      navigator.clipboard.writeText(currentUrl).then(() => {
        this.$message.success('链接已复制到剪贴板')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    },
    
    // 选择分组
    selectGroup(groupId) {
      this.selectedGroupId = groupId
    },
    
    // 显示新增分组
    showAddGroup() {
      // 这里可以触发新增分组的逻辑
      this.$message.info('新增分组功能开发中...')
    },
    
    // 处理采集
    handleCollect() {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }
      
      if (this.hasGroups && !this.selectedGroupId) {
        this.$message.warning('请选择一个分组')
        return
      }
      
      // 执行采集操作
      this.$message.success('采集成功')
      this.$emit('collect', {
        workId: this.workId,
        groupId: this.selectedGroupId
      })
      this.handleCancel()
    },
    
    // 关闭模态框
    handleCancel() {
      this.selectedGroupId = null
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.work-detail-modal {
  .modal-content {
    display: flex;
    min-height: 600px;
  }
}

.left-content {
  flex: 1;
  padding: 24px;
  background: #fff;
  overflow-y: auto;
  max-height: 80vh;
}

.work-icon-section {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  
  .icon-3d {
    width: 200px;
    height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .card-stack {
      position: relative;
      width: 120px;
      height: 80px;
      
      .card {
        position: absolute;
        width: 80px;
        height: 50px;
        border-radius: 8px;
        
        &.red-card {
          background: #ff4d4f;
          top: 0;
          left: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .card-lines {
            width: 24px;
            height: 20px;
            background: white;
            border-radius: 2px;
            position: relative;
            
            &::before,
            &::after {
              content: '';
              position: absolute;
              left: 2px;
              right: 2px;
              height: 2px;
              background: #ff4d4f;
              border-radius: 1px;
            }
            
            &::before {
              top: 4px;
            }
            
            &::after {
              top: 8px;
            }
          }
        }
        
        &.white-card {
          background: rgba(255, 255, 255, 0.8);
          top: 10px;
          left: 10px;
          z-index: 2;
          
          &:nth-child(3) {
            top: 20px;
            left: 20px;
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
      width: 160px;
      height: 160px;
      background: linear-gradient(45deg, #ff4d4f, #ff7875);
      border-radius: 50%;
      z-index: 0;
    }
    
    .orbit-line {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 200px;
      border: 1px solid rgba(255, 77, 79, 0.3);
      border-radius: 50%;
      z-index: 0;
    }
  }
}

.work-info-section {
  text-align: center;
  margin-bottom: 32px;
  
  .work-title {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
  }
  
  .work-tags {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
    
    .tag {
      background: #f0f0f0;
      color: #666;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
    }
  }
  
  .work-stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    .views {
      font-size: 16px;
      color: #666;
      font-weight: 500;
    }
    
    .heart-icon {
      color: #ff4d4f;
      font-size: 18px;
    }
  }
}

.prompt-sections {
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
      align-items: flex-start;
      justify-content: space-between;
      
      p {
        flex: 1;
        font-size: 14px;
        line-height: 1.6;
        color: #555;
        margin: 0;
        margin-right: 16px;
      }
      
      .copy-btn {
        color: #1890ff;
        padding: 0;
        height: auto;
        font-size: 14px;
        flex-shrink: 0;
      }
    }
  }
}

.right-sidebar {
  width: 300px;
  background: #fafafa;
  border-left: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    text-align: center;
  }
}

.sidebar-content {
  flex: 1;
  padding: 24px;
}

// 新增分组状态
.add-group-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  
  .add-group-icon {
    width: 80px;
    height: 80px;
    background: #ff4d4f;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    
    .anticon {
      font-size: 32px;
      color: white;
    }
  }
  
  .add-group-text {
    font-size: 16px;
    font-weight: 500;
    color: #ff4d4f;
  }
}

// 分组列表状态
.group-list-section {
  .group-options {
    margin-bottom: 16px;
  }
  
  .group-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: #f8f9fa;
      margin: 0 -12px;
      padding: 12px;
      border-radius: 6px;
    }
    
    &.selected {
      .group-name {
        color: #ff4d4f;
        font-weight: 500;
      }
    }
    
    .group-name {
      font-size: 14px;
      color: #333;
      transition: color 0.3s;
    }
    
    .radio-button {
      width: 16px;
      height: 16px;
      border: 2px solid #d9d9d9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      
      &.selected {
        border-color: #ff4d4f;
        background: #ff4d4f;
      }
      
      .radio-dot {
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
      }
    }
  }
  
  .add-group-option {
    display: flex;
    align-items: center;
    padding: 12px 0;
    cursor: pointer;
    border-top: 1px solid #f5f5f5;
    margin-top: 8px;
    
    &:hover {
      background: #f8f9fa;
      margin: 8px -12px 0;
      padding: 12px;
      border-radius: 6px;
    }
    
    .add-group-icon-small {
      width: 20px;
      height: 20px;
      background: #ff4d4f;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      
      .anticon {
        font-size: 12px;
        color: white;
      }
    }
    
    .add-group-text-small {
      font-size: 14px;
      color: #ff4d4f;
      font-weight: 500;
    }
  }
}

.sidebar-footer {
  padding: 16px 24px 24px;
  display: flex;
  gap: 12px;
  
  .cancel-btn {
    flex: 1;
    background: white;
    border: 1px solid #d9d9d9;
    color: #666;
    border-radius: 6px;
    height: 36px;
    
    &:hover {
      border-color: #40a9ff;
      color: #40a9ff;
    }
  }
  
  .collect-btn {
    flex: 1;
    background: #ff4d4f;
    border-color: #ff4d4f;
    border-radius: 6px;
    height: 36px;
    
    &:hover {
      background: #ff7875;
      border-color: #ff7875;
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .right-sidebar {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .modal-content {
    flex-direction: column;
  }
  
  .right-sidebar {
    width: 100%;
    order: 2;
  }
  
  .left-content {
    order: 1;
  }
}
</style>

