<template>
  <div class="collect-my-page">
    <div class="page-header">
      <a-button @click="$router.go(-1)" class="back-btn">
        <a-icon type="arrow-left" />
        返回
      </a-button>
      <h1>我的提示词</h1>
    </div>
    
    <div class="content">
      <a-list
        :data-source="myWorks"
        :loading="loading"
        class="works-list"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <template slot="title">
              <a @click="viewWork(item)">{{ item.title }}</a>
            </template>
            <template slot="description">
              <p class="work-content">{{ item.content }}</p>
              <div class="work-meta">
                <span class="category">{{ item.categoryName }}</span>
                <span class="time">{{ formatTime(item.createdAt) }}</span>
              </div>
            </template>
          </a-list-item-meta>
          <template slot="actions">
            <a @click="editWork(item)">编辑</a>
            <a @click="deleteWork(item)" class="delete-btn">删除</a>
          </template>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectMy',
  data() {
    return {
      loading: false,
      myWorks: [
        {
          id: 1,
          title: 'AI绘画提示词示例',
          content: '一个美丽的风景画，包含山脉、湖泊和森林...',
          categoryName: 'AI绘画',
          createdAt: new Date()
        },
        {
          id: 2,
          title: '文案创作提示词',
          content: '为产品写一个吸引人的广告文案...',
          categoryName: '文案创作',
          createdAt: new Date()
        }
      ]
    }
  },
  methods: {
    viewWork(work) {
      this.$router.push(`/collect/preview/${work.id}`)
    },
    
    editWork(work) {
      // 跳转到编辑页面
      console.log('编辑作品:', work)
    },
    
    deleteWork(work) {
      this.$confirm({
        title: '确认删除',
        content: `确定要删除"${work.title}"吗？`,
        onOk: () => {
          this.myWorks = this.myWorks.filter(w => w.id !== work.id)
          this.$message.success('删除成功')
        }
      })
    },
    
    formatTime(time) {
      return new Date(time).toLocaleDateString()
    }
  }
}
</script>

<style lang="scss" scoped>
.collect-my-page {
  padding: 24px;
  
  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    
    .back-btn {
      margin-right: 16px;
    }
    
    h1 {
      margin: 0;
      color: #333;
    }
  }
  
  .content {
    .works-list {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .work-content {
        margin: 8px 0;
        color: #666;
        line-height: 1.5;
      }
      
      .work-meta {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: #999;
        
        .category {
          background: #f0f0f0;
          padding: 2px 8px;
          border-radius: 4px;
        }
      }
      
      .delete-btn {
        color: #ff4d4f;
        
        &:hover {
          color: #ff7875;
        }
      }
    }
  }
}
</style>
