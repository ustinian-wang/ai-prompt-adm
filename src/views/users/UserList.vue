<template>
  <div class="user-list">
    <div class="page-header">
      <h2>用户列表</h2>
      <a-button type="primary" @click="showCreateModal">
        <a-icon type="plus" />
        新建用户
      </a-button>
    </div>
    
    <a-table
      :columns="columns"
      :data-source="usersList"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
    >
      <template slot="action" slot-scope="text, record">
        <a-button type="link" @click="editUser(record)">编辑</a-button>
        <a-popconfirm
          title="确定要删除这个用户吗？"
          @confirm="deleteUser(record.id)"
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
  name: 'UserList',
  data() {
    return {
      columns: [
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: '角色',
          dataIndex: 'role',
          key: 'role'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          customRender: (text) => {
            const statusMap = {
              active: { text: '活跃', color: '#52c41a' },
              inactive: { text: '非活跃', color: '#d9d9d9' }
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
    ...mapGetters('users', ['usersList', 'loading', 'pagination'])
  },
  mounted() {
    this.getUsersList()
  },
  methods: {
    ...mapActions('users', ['getUsersList']),
    
    showCreateModal() {
      this.$message.info('新建用户功能开发中...')
    },
    
    editUser(user) {
      this.$message.info(`编辑用户: ${user.username}`)
    },
    
    deleteUser(id) {
      this.$message.success(`删除用户成功，ID: ${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list {
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
