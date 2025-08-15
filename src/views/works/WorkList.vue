<template>
  <div class="work-list">
    <div class="page-header">
      <h2>作品列表</h2>
      <a-button type="primary" @click="showCreateModal">
        <a-icon type="plus" />
        新建作品
      </a-button>
    </div>
    
    <a-table
      :columns="columns"
      :data-source="worksList"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
    >
      <template slot="action" slot-scope="text, record">
        <a-button type="link" @click="viewWork(record)">查看</a-button>
        <a-button type="link" @click="editWork(record)">编辑</a-button>
        <a-button type="link" @click="configurePrompt(record)">配置提示词</a-button>
        <a-popconfirm
          title="确定要删除这个作品吗？"
          @confirm="deleteWork(record.id)"
        >
          <a-button type="link" style="color: #ff4d4f">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'WorkList',
  data() {
    return {
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '分类',
          dataIndex: 'category',
          key: 'category'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          customRender: (text) => {
            const statusMap = {
              draft: { text: '草稿', color: '#faad14' },
              published: { text: '已发布', color: '#52c41a' },
              archived: { text: '已归档', color: '#d9d9d9' }
            }
            return h('a-tag', { props: { color: statusMap[text]?.color } }, statusMap[text]?.text)
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {
    ...mapGetters('works', ['worksList', 'loading', 'pagination'])
  },
  mounted() {
    this.getWorksList()
  },
  methods: {
    ...mapActions('works', ['getWorksList']),
    
    showCreateModal() {
      this.$message.info('新建作品功能开发中...')
    },
    
    viewWork(work) {
      this.$message.info(`查看作品: ${work.title}`)
    },
    
    editWork(work) {
      this.$message.info(`编辑作品: ${work.title}`)
    },
    
    configurePrompt(work) {
      this.$router.push(`/works/prompt/${work.id}`)
    },
    
    deleteWork(id) {
      this.$message.success(`删除作品成功，ID: ${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.work-list {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h2 {
      margin: 0;
      color: #333;
    }
  }
}
</style>
