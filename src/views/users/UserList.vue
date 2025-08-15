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
      <template slot="avatar" slot-scope="avatar">
        <a-avatar :src="avatar" />
      </template>
      
      <template slot="status" slot-scope="text">
        <a-tag :color="getStatusColor(text)">{{ getStatusText(text) }}</a-tag>
      </template>
      
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

    <!-- 新建/编辑用户弹窗 -->
    <a-modal
      :title="isEdit ? '编辑用户' : '新建用户'"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
    >
      <a-form-model
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="用户名" prop="username">
          <a-input v-model="userForm.username" placeholder="请输入用户名" />
        </a-form-model-item>
        
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="userForm.email" placeholder="请输入邮箱" />
        </a-form-model-item>
        
        <a-form-model-item label="角色" prop="role">
          <a-select v-model="userForm.role" placeholder="请选择角色">
            <a-select-option value="超级管理员">超级管理员</a-select-option>
            <a-select-option value="内容管理员">内容管理员</a-select-option>
            <a-select-option value="用户管理员">用户管理员</a-select-option>
            <a-select-option value="普通用户">普通用户</a-select-option>
            <a-select-option value="访客">访客</a-select-option>
          </a-select>
        </a-form-model-item>
        
        <a-form-model-item label="状态" prop="status">
          <a-select v-model="userForm.status" placeholder="请选择状态">
            <a-select-option value="active">活跃</a-select-option>
            <a-select-option value="inactive">非活跃</a-select-option>
          </a-select>
        </a-form-model-item>
        
        <a-form-model-item v-if="!isEdit" label="密码" prop="password">
          <a-input-password v-model="userForm.password" placeholder="请输入密码" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserList',
  data() {
    return {
      modalVisible: false,
      isEdit: false,
      submitLoading: false,
      userForm: {
        username: '',
        email: '',
        role: '',
        status: 'active',
        password: ''
      },
      userRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('users', ['usersList', 'loading', 'pagination']),
    columns() {
      return [
        {
          title: '头像',
          dataIndex: 'avatar',
          key: 'avatar',
          width: 80,
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username',
          width: 120
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          width: 200
        },
        {
          title: '角色',
          dataIndex: 'role',
          key: 'role',
          width: 120
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 150
        },
        {
          title: '最后登录',
          dataIndex: 'lastLogin',
          key: 'lastLogin',
          width: 150
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {
    this.getUsersList()
  },
  methods: {
    ...mapActions('users', ['getUsersList', 'createUser', 'updateUser', 'deleteUser']),
    
    getStatusColor(status) {
      const statusMap = {
        active: '#52c41a',
        inactive: '#d9d9d9'
      }
      return statusMap[status] || '#d9d9d9'
    },
    
    getStatusText(status) {
      const statusMap = {
        active: '活跃',
        inactive: '非活跃'
      }
      return statusMap[status] || '未知'
    },
    
    showCreateModal() {
      this.isEdit = false
      this.userForm = {
        username: '',
        email: '',
        role: '',
        status: 'active',
        password: ''
      }
      this.modalVisible = true
    },
    
    editUser(user) {
      this.isEdit = true
      this.userForm = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      }
      this.modalVisible = true
    },
    
    async handleSubmit() {
      try {
        await this.$refs.userForm.validate()
        this.submitLoading = true
        
        if (this.isEdit) {
          await this.updateUser(this.userForm)
          this.$message.success('更新用户成功')
        } else {
          await this.createUser(this.userForm)
          this.$message.success('创建用户成功')
        }
        
        this.modalVisible = false
        this.getUsersList() // 刷新列表
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        this.submitLoading = false
      }
    },
    
    handleCancel() {
      this.modalVisible = false
      this.$refs.userForm.resetFields()
    },
    
    async deleteUser(id) {
      try {
        await this.deleteUser(id)
        this.$message.success('删除用户成功')
        this.getUsersList() // 刷新列表
      } catch (error) {
        this.$message.error('删除失败')
      }
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
