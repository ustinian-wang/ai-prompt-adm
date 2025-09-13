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
      <!-- 中央内容区 -->
      <div class="center-content">
        <!-- 搜索栏 -->
        <div class="search-bar" style="display: flex; align-items: center; gap: 16px;">
          <a-button type="default" @click="handleCancel">&lt; 关闭</a-button>
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
            <span class="views">{{ work ? (work.metadata && (work.metadata.views || work.metadata.favs) || 0) : 0 }}</span>
            <a-icon type="heart" class="heart-icon" />
          </div>
        </div>

        <!-- 提示词描述区 -->
        <div class="prompt-description">
          <div class="prompt-section" v-if="work && work.work_prompt_cn">
            <h4>中文提示词:</h4>
            <div class="prompt-content">
              <span class="prompt-text">{{ work.work_prompt_cn }}</span>
              <a-button type="link" class="copy-btn" @click="copyPrompt(work.work_prompt_cn)">复制</a-button>
            </div>
          </div>
          
          <div class="prompt-section" v-if="work && work.work_prompt_en">
            <h4>英文提示词:</h4>
            <div class="prompt-content">
              <span class="prompt-text">{{ work.work_prompt_en }}</span>
              <a-button type="link" class="copy-btn" @click="copyPrompt(work.work_prompt_en)">复制</a-button>
            </div>
          </div>
        </div>

        <!-- 教程区域（富文本渲染） -->
        <div class="tutorials-section" v-if="work && work.work_guide_desc">
          <div class="tutorial-header">
            <div class="red-bar"></div>
            <h3>教程</h3>
          </div>
          <div class="tutorial-content rich-text" v-html="work.work_guide_desc"></div>
        </div>
      </div>

      <!-- 右侧边栏 -->
      <div class="right-sidebar">
        <div class="sidebar-actions">
          <a-button class="copy-link-btn" @click="copyLink">复制链接分享</a-button>
          <a-button type="danger" class="collect-btn" @click="collectPrompt">采集</a-button>
        </div>
        <div class="external-links" v-if="work && Array.isArray(work.work_outer_link_list) && work.work_outer_link_list.length">
          <h4>打开外链</h4>
          <a-button 
            class="link-btn"
            v-for="(lk, li) in work.work_outer_link_list"
            :key="li"
            :disabled="!lk || !lk.url"
            @click="openExternal(lk)"
          >
            <span>{{ (lk && lk.name) || (lk && lk.url) || '外链' }}</span>
            <a-icon type="play-circle" />
          </a-button>
        </div>

        <div class="help-icon">
          <a-icon type="question-circle" />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getWorkDetailPublicApi } from '@/api/worksApi'

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
      loading: false
    }
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'userInfo'])
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
      
      this.loading = true
      try {
        const res = await getWorkDetailPublicApi(this.workId)
        if (res.data && res.data.success) {
          this.work = this.normalizeWork(res.data)
        } else {
          this.$message.error((res.data && res.data.msg) || '获取详情失败')
        }
      } catch (e) {
        this.$message.error('获取详情失败')
      } finally {
        this.loading = false
      }
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

    // 采集提示词
    collectPrompt() {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }
      
      this.$message.success('采集成功')
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
    
    // 关闭模态框
    handleCancel() {
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
  .rich-text {
    background: #fff;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    line-height: 1.8;
    color: #333;
    
    img { max-width: 100%; border-radius: 8px; }
    h1, h2, h3, h4, h5, h6 { margin: 12px 0; }
    p { margin: 8px 0; }
    ul, ol { padding-left: 20px; }
    blockquote { border-left: 3px solid #ff4d4f; padding-left: 12px; color: #666; background: #fff7f7; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
    pre { background: #2d2d2d; color: #f8f8f2; padding: 12px; border-radius: 8px; overflow: auto; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    table th, table td { border: 1px solid #eee; padding: 8px; }
  }
  
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
  .right-sidebar {
    width: 240px;
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
  
  .center-content {
    order: 1;
  }
}
</style>
