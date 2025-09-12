<template>
  <div class="collect-page">
    <!-- 头部：标题 + 搜索 + 创建按钮 -->
    <div class="header">
      <div class="title">
        <a-icon type="appstore" class="logo-icon" />
        <span>AI提示词收集器</span>
      </div>
      <div class="header-right">
        <div class="search-box">
          <a-input-search
            v-model="keyword"
            placeholder="搜索分组..."
            @search="handleSearch"
            class="search-input"
            allow-clear
          />
        </div>
        <a-button type="primary" class="add-btn" @click="goCreate">
          <a-icon type="plus" /> 创建分组
        </a-button>
      </div>
    </div>

    <!-- 主体：宫格列表 -->
    <div class="main-content">
      <a-spin :spinning="loading">
        <div class="group-grid">
          <!-- 创建分组占位卡 -->
          <div class="create-card" @click="goCreate">
            <a-icon type="plus" />
            <div class="text">创建分组</div>
          </div>

          <!-- 分组卡片 -->
          <div
            v-for="group in groups"
            :key="group.mg_id"
            class="group-card"
            @click="openGroup(group)"
          >
            <div class="grid-cover">
              <img v-if="group.mg_cover_url" :src="group.mg_cover_url" alt="cover" />
              <template v-else>
                <div
                  v-for="i in 9"
                  :key="i"
                  :class="['grid-cell', { dark: i % 2 === 0 }]"
                />
              </template>
              <div class="card-tools" @click.stop>
                <a-tooltip title="编辑">
                  <a-button shape="circle" size="small" @click="editGroup(group)">
                    <a-icon type="edit" />
                  </a-button>
                </a-tooltip>
                <a-dropdown :trigger="['click']">
                  <a-button shape="circle" size="small">
                    <a-icon type="more" />
                  </a-button>
                  <a-menu slot="overlay" @click="(e) => moreAction(e, group)">
                    <a-menu-item key="rename">重命名</a-menu-item>
                    <a-menu-item key="delete">删除</a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            </div>
            <div class="card-info">
              <div class="group-name" :title="group.mg_name">{{ group.mg_name }}</div>
              <div class="group-count">{{ group.mg_item_count || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && groups.length === 0" class="empty-state">
          <a-icon type="inbox" class="empty-icon" />
          <h3>暂无分组</h3>
          <p>创建你的第一个提示词分组</p>
          <a-button type="primary" @click="goCreate">创建分组</a-button>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="pagination.total > 0">
          <a-pagination
            :current="pagination.page"
            :page-size="pagination.limit"
            :total="pagination.total"
            show-size-changer
            show-quick-jumper
            @change="handlePageChange"
            @showSizeChange="handlePageSizeChange"
          />
        </div>
      </a-spin>
    </div>
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Collect',
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    ...mapGetters('memGroup', ['groups', 'loading', 'pagination'])
  },
  created() {
    this.fetchList({ page: 1, limit: this.pagination.limit || 12 })
  },
  methods: {
    fetchList(params) {
      this.$store.dispatch('memGroup/fetchGroups', params)
    },
    handleSearch(value) {
      this.keyword = value
      this.fetchList({ page: 1, limit: this.pagination.limit || 12, keyword: value })
    },
    handlePageChange(page) {
      this.fetchList({ page, limit: this.pagination.limit || 12, keyword: this.keyword })
    },
    handlePageSizeChange(current, size) {
      this.fetchList({ page: 1, limit: size, keyword: this.keyword })
    },
    goCreate() {
      this.$router.push('/collect/add')
    },
    openGroup(group) {
      this.$router.push('/collect/my?groupId=' + group.mg_id)
    },
    editGroup(group) {
      this.$router.push('/collect/add?id=' + group.mg_id)
    },
    async moreAction({ key }, group) {
      if (key === 'delete') {
        this.$confirm({
          title: '确认删除该分组？',
          onOk: async () => {
            await this.$store.dispatch('memGroup/deleteGroup', { mg_id: group.mg_id })
            this.$message.success('已删除')
            this.fetchList({ page: 1, limit: this.pagination.limit || 12, keyword: this.keyword })
          }
        })
        return
      }
      if (key === 'rename') {
        this.$message.info('重命名功能待实现')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.collect-page {
  min-height: 100vh;
  background: #f5f6f7;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    color: #222;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  .search-input {
    width: 320px;
    .ant-input { border-radius: 20px; }
  }
  .add-btn { border-radius: 20px; height: 36px; }
}

.main-content { padding: 20px; flex: 1; }

.group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.create-card,
.group-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease;
  cursor: pointer;
  border: 1px solid #f0f0f0;
}

.create-card {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  border: 1px dashed #d9d9d9;
  .text { margin-top: 8px; }
  &:hover { color: #1890ff; border-color: #91d5ff; }
}

.group-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }

.grid-cover {
  position: relative;
  height: 140px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
  background: #fafafa;
}
.grid-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }

.grid-cover .grid-cell {
  width: calc(100% / 3);
  height: calc(100% / 3);
  float: left;
  background: #f2f2f2;
}
.grid-cover .grid-cell.dark { background: #d9d9d9; }

.card-tools {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 6px;
}

.card-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
}
.group-name { font-weight: 600; color: #333; max-width: 80%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.group-count { background: #f5f5f5; border-radius: 12px; padding: 2px 8px; font-size: 12px; color: #666; }

.pagination-wrapper { display: flex; justify-content: center; margin-top: 16px; }

.empty-state {
  text-align: center;
  padding: 60px 24px;
  .empty-icon { font-size: 64px; color: #d9d9d9; margin-bottom: 12px; }
}

@media (max-width: 768px) {
  .header { padding: 12px 16px; flex-direction: column; align-items: stretch; gap: 12px; }
  .header-right { justify-content: space-between; }
  .header-right .search-input { width: 100%; }
}
</style>
