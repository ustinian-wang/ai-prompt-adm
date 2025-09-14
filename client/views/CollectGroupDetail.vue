<template>
  <div class="collect-my-page">
    <!-- 顶部标题与搜索栏 -->
    <div class="page-header">
      <a-button @click="$router.go(-1)" class="back-btn">
        <a-icon type="arrow-left" />
        返回
      </a-button>
      <h1>{{ groupInfo?.mg_name || '分组详情' }}</h1>
      <div class="actions">
        <a-input-search
          v-model="keyword"
          class="search"
          placeholder="输入关键词搜索"
          @search="onSearch"
          allow-clear
        />
      </div>
    </div>

    <!-- 分类标签与统计 -->
    <div class="sub-header">
      <div class="hash-title"># {{ groupInfo?.mg_name || '分组' }}</div>
      <div class="summary">共 {{ total }} 条结果</div>
    </div>

    <!-- 固定尺寸网格卡片列表 -->
    <div class="card-wrap">
      <a-spin :spinning="loading">
        <div class="grid">
          <a-card
            v-for="item in works"
            :key="item.work_id"
            class="work-card"
            :hoverable="true"
            @click.native="viewWork(item)"
          >
            <div class="cover">
              <img :src="item.work_img_path || defaultCover" alt="preview" />
              <a-tag color="red" class="badge" v-if="item.isNew">新品</a-tag>
            </div>
            <div class="card-body">
              <div class="title" :title="item.work_name">{{ item.work_name }}</div>
              <div class="meta">
                <span class="tags">#{{ item.categoryName }}</span>
                <span class="dot">·</span>
                <span class="time">{{ formatTime(item.work_created_at) }}</span>
              </div>
            </div>
            <div class="card-actions" @click.stop>
              <a-tooltip title="喜欢">
                <a-icon :type="item.liked ? 'heart' : 'heart'" :theme="item.liked ? 'filled' : 'outlined'" class="like" @click="toggleLike(item)" />
              </a-tooltip>
              <span class="like-count">{{ item.likes }}</span>
              <a @click="editWork(item)">编辑</a>
              <a class="delete-btn" @click="deleteWork(item)">删除</a>
            </div>
          </a-card>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && works.length === 0" class="empty-state">
          <a-icon type="inbox" class="empty-icon" />
          <h3>暂无作品</h3>
          <p>该分组还没有作品</p>
        </div>
      </a-spin>
    </div>

    <!-- 分页器 -->
    <div class="pager" v-if="total > 0">
      <a-pagination
        :current="currentPage"
        :page-size="pageSize"
        :total="total"
        size="small"
        @change="onPageChange"
        :show-total="total => `共 ${total} 条`"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectGroupDetail',
  data() {
    return {
      loading: false,
      keyword: '',
      currentPage: 1,
      pageSize: 24,
      defaultCover: 'https://via.placeholder.com/320x200?text=Preview',
      works: [],
      total: 0,
      groupInfo: null
    }
  },
  mounted() {
    this.fetchGroupInfo()
    this.fetchWorks()
  },
  methods: {
    viewWork(work) {
      // 导航到作品详情页面
      this.$router.push(`/detail/${work.work_id}`)
    },
    
    editWork(work) {
      this.$router.push(`/collect/edit/${work.work_id}`)
    },
    
    deleteWork(work) {
      this.$confirm({
        title: '确认删除',
        content: `确定要从分组中移除"${work.work_name}"吗？`,
        onOk: async () => {
          try {
            const groupId = this.$route.params.id || this.$route.query.groupId
            const { default: request } = await import('../../src/utils/request')
            
            // 调用移除作品从分组的API
            const res = await request.post('/api/member/work_group/remove', {
              work_id: work.work_id,
              group_id: groupId
            })
            
            if (res.data && res.data.success) {
              this.works = this.works.filter(w => w.work_id !== work.work_id)
              this.total = Math.max(0, this.total - 1)
              this.$message.success('移除成功')
            } else {
              this.$message.error((res.data && res.data.msg) || '移除失败')
            }
          } catch (e) {
            console.error('移除作品失败:', e)
            this.$message.error('移除失败')
          }
        }
      })
    },
    
    async toggleLike(work) {
      try {
        const { default: request } = await import('../../src/utils/request')
        
        // 调用点赞/取消点赞API
        const res = await request.post('/api/member/work/like', {
          work_id: work.work_id,
          action: work.liked ? 'unlike' : 'like'
        })
        
        if (res.data && res.data.success) {
          work.liked = !work.liked
          work.likes = Math.max(0, (work.likes || 0) + (work.liked ? 1 : -1))
        } else {
          this.$message.error((res.data && res.data.msg) || '操作失败')
        }
      } catch (e) {
        console.error('点赞操作失败:', e)
        this.$message.error('操作失败')
      }
    },

    onSearch() {
      this.currentPage = 1
      this.fetchWorks()
    },

    onPageChange(page) {
      this.currentPage = page
      this.fetchWorks()
    },

    async fetchWorks() {
      try {
        this.loading = true
        const groupId = this.$route.params.id || this.$route.query.groupId
        if (!groupId) {
          this.$message.error('缺少分组ID')
          return
        }

        const { default: request } = await import('../../src/utils/request')
        const res = await request.get(`/api/member/work_group/group/${groupId}/works`, { 
          params: { 
            page: this.currentPage,
            limit: this.pageSize,
            search: this.keyword
          } 
        })
        
        if (res.data && res.data.success) {
          console.log('API返回的完整数据:', res.data)
          
          // 根据API响应结构，works直接在res.data.works中
          const worksData = res.data.works || []
          const paginationData = res.data.pagination || {}
          
          console.log('works数据:', worksData)
          console.log('pagination数据:', paginationData)
          
          // 映射works数据
          this.works = worksData.map(workGroup => {
            console.log('处理workGroup:', workGroup)
            const work = workGroup.work || workGroup
            console.log('提取的work:', work)
            
            return {
              work_id: work.work_id,
              work_name: work.work_name,
              work_desc: work.work_desc,
              work_img_path: work.work_img_path,
              work_created_at: work.work_created_at,
              work_updated_at: work.work_updated_at,
              categoryName: '分组作品', // 可以后续从分组信息获取
              liked: false, // 默认未点赞
              likes: 0 // 默认点赞数为0
            }
          })
          
          console.log('映射后的works:', this.works)
          this.total = paginationData.total || 0
          // 分组信息需要单独获取
          this.groupInfo = { mg_name: '分组详情' }
        } else {
          this.$message.error((res.data && res.data.msg) || '获取作品列表失败')
        }
      } catch (e) {
        console.error('获取分组作品失败:', e)
        this.$message.error('加载失败')
      } finally {
        this.loading = false
      }
    },

    formatTime(time) {
      return new Date(time).toLocaleDateString()
    },

    async fetchGroupInfo() {
      try {
        const groupId = this.$route.params.id || this.$route.query.groupId
        if (!groupId) return

        const { default: request } = await import('../../src/utils/request')
        const res = await request.get('/api/member/mem_group/detail', {
          params: { mg_id: groupId }
        })
        
        if (res.data && res.data.success) {
          this.groupInfo = res.data.data || { mg_name: '分组详情' }
        }
      } catch (e) {
        console.error('获取分组信息失败:', e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.collect-my-page {
  padding: 24px;
  background: #f7f8fa;
  
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

    .actions {
      margin-left: auto;
      display: flex;
      align-items: center;

      .search {
        width: 320px;
      }
    }
  }

  .sub-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .hash-title {
      font-weight: 600;
      color: #333;
    }
    .summary {
      font-size: 12px;
      color: #999;
    }
  }

  .card-wrap {
    .grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
    }

    .work-card {
      border-radius: 10px;
      overflow: hidden;

      .cover {
        position: relative;
        height: 200px;
        background: #fafafa;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .badge {
          position: absolute;
          top: 8px;
          right: 8px;
        }
      }

      .card-body {
        padding: 12px 12px 0 12px;

        .title {
          font-size: 14px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta {
          margin-top: 6px;
          color: #999;
          font-size: 12px;
          display: flex;
          align-items: center;

          .dot {
            margin: 0 6px;
          }
        }
      }

      .card-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px 12px 12px;

        .like {
          color: #ff4d4f;
          cursor: pointer;
        }

        .like-count {
          color: #999;
          margin-right: auto;
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

  .pager {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .empty-state {
    text-align: center;
    padding: 60px 24px;
    
    .empty-icon {
      font-size: 64px;
      color: #d9d9d9;
      margin-bottom: 12px;
    }
    
    h3 {
      font-size: 18px;
      color: #666;
      margin-bottom: 8px;
    }
    
    p {
      color: #999;
      margin: 0;
    }
  }
}
</style>
