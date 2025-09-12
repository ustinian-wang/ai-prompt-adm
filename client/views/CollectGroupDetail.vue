<template>
  <div class="collect-my-page">
    <!-- 顶部标题与搜索栏 -->
    <div class="page-header">
      <a-button @click="$router.go(-1)" class="back-btn">
        <a-icon type="arrow-left" />
        返回
      </a-button>
      <h1>我的提示词</h1>
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
      <div class="hash-title"># {{ currentCategory }}</div>
      <div class="summary">共 {{ filteredTotal }} 条结果</div>
    </div>

    <!-- 固定尺寸网格卡片列表 -->
    <div class="card-wrap">
      <div class="grid">
        <a-card
          v-for="item in pagedWorks"
          :key="item.id"
          class="work-card"
          :hoverable="true"
          @click.native="viewWork(item)"
        >
          <div class="cover">
            <img :src="item.cover || defaultCover" alt="preview" />
            <a-tag color="red" class="badge" v-if="item.isNew">新品</a-tag>
          </div>
          <div class="card-body">
            <div class="title" :title="item.title">{{ item.title }}</div>
            <div class="meta">
              <span class="tags">#{{ item.categoryName }}</span>
              <span class="dot">·</span>
              <span class="time">{{ formatTime(item.createdAt) }}</span>
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
    </div>

    <!-- 分页器 -->
    <div class="pager">
      <a-pagination
        :current="currentPage"
        :page-size="pageSize"
        :total="filteredTotal"
        size="small"
        @change="onPageChange"
        :show-total="total => `共 ${total} 条`"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectMy',
  data() {
    return {
      loading: false,
      keyword: '',
      currentCategory: '3D图标设计',
      currentPage: 1,
      pageSize: 24,
      defaultCover: 'https://via.placeholder.com/320x200?text=Preview',
      allWorks: []
    }
  },
  computed: {
    filteredList() {
      const text = (this.keyword || '').trim().toLowerCase()
      if (!text) return this.allWorks
      return this.allWorks.filter(w =>
        (w.title || '').toLowerCase().includes(text) ||
        (w.content || '').toLowerCase().includes(text)
      )
    },
    filteredTotal() {
      return this.filteredList.length
    },
    pagedWorks() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredList.slice(start, start + this.pageSize)
    }
  },
  mounted() {
    this.fetchWorks()
  },
  methods: {
    viewWork(work) {
      this.$router.push(`/collect/preview/${work.id}`)
    },
    
    editWork(work) {
      this.$router.push(`/collect/edit/${work.id}`)
    },
    
    deleteWork(work) {
      this.$confirm({
        title: '确认删除',
        content: `确定要删除"${work.title}"吗？`,
        onOk: () => {
          this.allWorks = this.allWorks.filter(w => w.id !== work.id)
          this.$message.success('删除成功')
        }
      })
    },
    
    toggleLike(work) {
      work.liked = !work.liked
      work.likes = Math.max(0, (work.likes || 0) + (work.liked ? 1 : -1))
    },

    onSearch() {
      this.currentPage = 1
    },

    onPageChange(page) {
      this.currentPage = page
    },

    async fetchWorks() {
      try {
        this.loading = true
        // 复用 src/utils/request；此处只拉取较多数据用于本地分页
        const { default: request } = await import('../../src/utils/request')
        const res = await request.get('/api/member/works/getWorksPublicList', { params: { page: 1, limit: 200 } })
        const list = (res && (res.data?.works || res.data?.data?.works)) || res?.data?.data?.works || []
        this.allWorks = list.map(this.mapWork)
      } catch (e) {
        console.error(e)
        this.$message.error('加载失败')
      } finally {
        this.loading = false
      }
    },

    formatTime(time) {
      return new Date(time).toLocaleDateString()
    },

    mapWork(dto) {
      const id = dto.work_id || dto.id
      return {
        id,
        title: dto.work_name || dto.title || '-',
        content: dto.work_desc || dto.content || '',
        categoryName: (dto.categoryName || 'AI提示词'),
        cover: dto.work_img_path || this.defaultCover,
        createdAt: dto.work_created_at || dto.createdAt || Date.now(),
        likes: dto.likes || Math.floor(Math.random() * 20),
        liked: false,
        isNew: !!dto.isNew
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
}
</style>
