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
    
    <!-- 创建分组 Modal -->
    <a-modal
      :visible="createVisible"
      title="新增分组"
      :confirm-loading="creating"
      @ok="submitCreate"
      @cancel="createVisible = false"
      ok-text="创建"
      cancel-text="取消"
    >
      <a-input
        v-model="newGroupName"
        placeholder="请输入分组名称"
        :max-length="50"
      />
    </a-modal>

    <!-- 编辑分组 Modal -->
    <a-modal
      :visible="editVisible"
      title="编辑分组"
      :confirm-loading="updating"
      @ok="submitUpdate"
      @cancel="editVisible = false"
      ok-text="保存"
      cancel-text="取消"
      width="500px"
    >
      <a-form layout="vertical">
        <a-form-item label="分组名称" required>
          <a-input
            v-model="editGroupData.mg_name"
            placeholder="请输入分组名称"
            :max-length="50"
          />
        </a-form-item>
        <a-form-item label="分组描述">
          <a-textarea
            v-model="editGroupData.mg_desc"
            placeholder="请输入分组描述（可选）"
            :max-length="255"
            :rows="3"
          />
        </a-form-item>
        <a-form-item label="封面URL">
          <a-input
            v-model="editGroupData.mg_cover_url"
            placeholder="请输入封面图片URL（可选）"
            :max-length="255"
          />
        </a-form-item>
        <a-form-item label="分组颜色">
          <a-input
            v-model="editGroupData.mg_color"
            placeholder="请输入颜色代码，如：#1890ff（可选）"
            :max-length="32"
          />
        </a-form-item>
        <a-form-item label="是否私有">
          <a-radio-group v-model="editGroupData.mg_is_private">
            <a-radio :value="1">私有</a-radio>
            <a-radio :value="0">公开</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Collect',
  data() {
    return {
      keyword: '',
      createVisible: false,
      newGroupName: '',
      creating: false,
      editVisible: false,
      updating: false,
      editGroupData: {
        mg_id: null,
        mg_name: '',
        mg_desc: '',
        mg_cover_url: '',
        mg_color: '',
        mg_is_private: 1
      }
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
      // 从JWT携带，后端通过 memberAuthMiddleware 解析，无需显式传 mem_id
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
      // 打开创建分组弹窗
      this.newGroupName = ''
      this.createVisible = true
    },
    openGroup(group) {
      this.$router.push('/collect/groupDetail/' + group.mg_id)
    },
    editGroup(group) {
      // 打开编辑分组弹窗
      this.editGroupData = {
        mg_id: group.mg_id,
        mg_name: group.mg_name || '',
        mg_desc: group.mg_desc || '',
        mg_cover_url: group.mg_cover_url || '',
        mg_color: group.mg_color || '',
        mg_is_private: group.mg_is_private !== undefined ? group.mg_is_private : 1
      }
      this.editVisible = true
    },
    async submitCreate() {
      if (!this.newGroupName || !this.newGroupName.trim()) {
        this.$message.warning('请输入分组名称')
        return
      }
      this.creating = true
      try {
        // 后端从JWT解析会员身份，无需显式传 mem_id
        const hasToken = this.$store.getters['auth/token']
        if (!hasToken) {
          this.$message.error('请先登录')
          this.creating = false
          return
        }
        await this.$store.dispatch('memGroup/createGroup', { name: this.newGroupName.trim() })
        this.$message.success('分组创建成功')
        this.createVisible = false
        this.fetchList({ page: 1, limit: this.pagination.limit || 12, keyword: this.keyword })
      } catch (e) {
        this.$message.error('创建失败，请重试')
      } finally {
        this.creating = false
      }
    },
    async submitUpdate() {
      if (!this.editGroupData.mg_name || !this.editGroupData.mg_name.trim()) {
        this.$message.warning('请输入分组名称')
        return
      }
      this.updating = true
      try {
        const hasToken = this.$store.getters['auth/token']
        if (!hasToken) {
          this.$message.error('请先登录')
          this.updating = false
          return
        }
        await this.$store.dispatch('memGroup/updateGroup', {
          mg_id: this.editGroupData.mg_id,
          name: this.editGroupData.mg_name.trim(),
          desc: this.editGroupData.mg_desc.trim(),
          cover_url: this.editGroupData.mg_cover_url.trim(),
          color: this.editGroupData.mg_color.trim(),
          is_private: this.editGroupData.mg_is_private
        })
        this.$message.success('分组更新成功')
        this.editVisible = false
        this.fetchList({ page: 1, limit: this.pagination.limit || 12, keyword: this.keyword })
      } catch (e) {
        this.$message.error('更新失败，请重试')
      } finally {
        this.updating = false
      }
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
