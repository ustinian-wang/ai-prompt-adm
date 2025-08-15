<template>
  <div class="role-manage">
    <div class="page-header">
      <h2>角色管理</h2>
      <a-button type="primary" @click="showCreateModal">
        <a-icon type="plus" />
        新建角色
      </a-button>
    </div>
    
    <a-table
      :columns="columns"
      :data-source="rolesList"
      :loading="loading"
      row-key="id"
    >
      <template slot="action" slot-scope="text, record">
        <a-button type="link" @click="editRole(record)">编辑</a-button>
        <a-popconfirm
          title="确定要删除这个角色吗？"
          @confirm="deleteRole(record.id)"
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
  name: 'RoleManage',
  data() {
    return {
      columns: [
        {
          title: '角色名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '权限',
          dataIndex: 'permissions',
          key: 'permissions',
          customRender: (permissions) => {
            if (permissions && permissions.includes('*')) {
              return h('a-tag', { props: { color: 'red' } }, '全部权限')
            }
            return permissions ? permissions.join(', ') : '无权限'
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
    ...mapGetters('system', ['rolesList', 'loading'])
  },
  mounted() {
    this.getRolesList()
  },
  methods: {
    ...mapActions('system', ['getRolesList']),
    
    showCreateModal() {
      this.$message.info('新建角色功能开发中...')
    },
    
    editRole(role) {
      this.$message.info(`编辑角色: ${role.name}`)
    },
    
    deleteRole(id) {
      this.$message.success(`删除角色成功，ID: ${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.role-manage {
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
