<template>
  <div class="user-list">
    <div class="page-header">
      <div class="header-content">
        <h1>用户管理</h1>
        <p>管理系统用户和权限分配</p>
      </div>
      <a-button type="primary" @click="showCreateModal" size="large">
        <a-icon type="plus" />
        新建用户
      </a-button>
    </div>
    
    <div class="content-wrapper">
      <!-- 搜索筛选区域 -->
      <a-card :bordered="false" class="search-card">
        <a-form layout="inline" :form="searchForm">
          <a-row :gutter="16" style="width: 100%">
            <a-col :span="6">
              <a-form-item label="用户名">
                <a-input
                  v-decorator="['username']"
                  placeholder="请输入用户名"
                  allow-clear
                  size="large"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="邮箱">
                <a-input
                  v-decorator="['email']"
                  placeholder="请输入邮箱"
                  allow-clear
                  size="large"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="角色">
                <a-select
                  v-decorator="['role']"
                  placeholder="请选择角色"
                  allow-clear
                  size="large"
                >
                  <a-select-option value="超级管理员">超级管理员</a-select-option>
                  <a-select-option value="内容管理员">内容管理员</a-select-option>
                  <a-select-option value="用户管理员">用户管理员</a-select-option>
                  <a-select-option value="普通用户">普通用户</a-select-option>
                  <a-select-option value="访客">访客</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="状态">
                <a-select
                  v-decorator="['status']"
                  placeholder="请选择状态"
                  allow-clear
                  size="large"
                >
                  <a-select-option value="active">活跃</a-select-option>
                  <a-select-option value="inactive">非活跃</a-select-option>
                  <a-select-option value="suspended">已暂停</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16" style="margin-top: 16px">
            <a-col :span="24">
              <a-form-item>
                <a-button type="primary" @click="handleSearch" size="large">
                  <a-icon type="search" />
                  搜索
                </a-button>
                <a-button style="margin-left: 8px" @click="handleReset" size="large">
                  <a-icon type="reload" />
                  重置
                </a-button>
                <a-button style="margin-left: 8px" @click="handleExport" size="large">
                  <a-icon type="download" />
                  导出
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      
      <!-- 用户表格 -->
      <a-card :bordered="false" class="table-card">
        <a-table
          :columns="columns"
          :data-source="usersList"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          size="middle"
        >
          <template slot="avatar" slot-scope="avatar, record">
            <div class="user-avatar">
              <a-avatar :src="avatar" :size="40">
                {{ record.username ? record.username.charAt(0).toUpperCase() : 'U' }}
              </a-avatar>
            </div>
          </template>
          
          <template slot="username" slot-scope="username, record">
            <div class="user-info">
              <div class="username">{{ username }}</div>
              <div class="user-id">ID: {{ record.id }}</div>
            </div>
          </template>
          
          <template slot="role" slot-scope="role">
            <a-tag :color="getRoleColor(role)">{{ role }}</a-tag>
          </template>
          
          <template slot="status" slot-scope="status">
            <a-tag :color="getStatusColor(status)">
              <a-icon :type="getStatusIcon(status)" />
              {{ getStatusText(status) }}
            </a-tag>
          </template>
          
          <template slot="lastLogin" slot-scope="lastLogin">
            <span class="last-login">{{ formatDate(lastLogin) }}</span>
          </template>
          
          <template slot="action" slot-scope="text, record">
            <div class="action-buttons">
              <a-button type="link" @click="editUser(record)" class="action-btn">
                <a-icon type="edit" />
                编辑
              </a-button>
              <a-button type="link" @click="viewUser(record)" class="action-btn">
                <a-icon type="eye" />
                查看
              </a-button>
              <a-dropdown>
                <a-button type="link" class="action-btn">
                  <a-icon type="more" />
                  更多
                </a-button>
                <a-menu slot="overlay">
                  <a-menu-item @click="resetPassword(record.id)">
                    <a-icon type="key" />
                    重置密码
                  </a-menu-item>
                  <a-menu-item @click="toggleUserStatus(record)">
                    <a-icon :type="record.status === 'active' ? 'pause-circle' : 'play-circle'" />
                    {{ record.status === 'active' ? '暂停用户' : '启用用户' }}
                  </a-menu-item>
                  <a-menu-item @click="assignRole(record)">
                    <a-icon type="team" />
                    分配角色
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <a-popconfirm
                title="确定要删除这个用户吗？"
                @confirm="deleteUser(record.id)"
                ok-text="确定"
                cancel-text="取消"
              >
                <a-button type="link" class="action-btn delete-btn">
                  <a-icon type="delete" />
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-card>
    </div>

    <!-- 新建/编辑用户弹窗 -->
    <a-modal
      :title="isEdit ? '编辑用户' : '新建用户'"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
      :width="600"
      class="user-modal"
    >
      <a-form-model
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        layout="horizontal"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="用户名" prop="username">
              <a-input 
                v-model="userForm.username" 
                placeholder="请输入用户名"
                size="large"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="邮箱" prop="email">
              <a-input 
                v-model="userForm.email" 
                placeholder="请输入邮箱"
                size="large"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="真实姓名" prop="realName">
              <a-input 
                v-model="userForm.realName" 
                placeholder="请输入真实姓名"
                size="large"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="手机号码" prop="phone">
              <a-input 
                v-model="userForm.phone" 
                placeholder="请输入手机号码"
                size="large"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="角色" prop="role">
              <a-select 
                v-model="userForm.role" 
                placeholder="请选择角色"
                size="large"
              >
                <a-select-option value="超级管理员">超级管理员</a-select-option>
                <a-select-option value="内容管理员">内容管理员</a-select-option>
                <a-select-option value="用户管理员">用户管理员</a-select-option>
                <a-select-option value="普通用户">普通用户</a-select-option>
                <a-select-option value="访客">访客</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="状态" prop="status">
              <a-select 
                v-model="userForm.status" 
                placeholder="请选择状态"
                size="large"
              >
                <a-select-option value="active">活跃</a-select-option>
                <a-select-option value="inactive">非活跃</a-select-option>
                <a-select-option value="suspended">已暂停</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        
        <a-form-model-item v-if="!isEdit" label="密码" prop="password">
          <a-input-password 
            v-model="userForm.password" 
            placeholder="请输入密码"
            size="large"
          />
        </a-form-model-item>
        
        <a-form-model-item label="备注" prop="remark">
          <a-textarea
            v-model="userForm.remark"
            :rows="3"
            placeholder="请输入备注信息"
            size="large"
          />
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
          width: 120,
          scopedSlots: { customRender: 'username' }
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
          width: 120,
          scopedSlots: { customRender: 'role' }
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
          width: 150,
          scopedSlots: { customRender: 'lastLogin' }
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
        inactive: '#d9d9d9',
        suspended: '#faad14' // 新增状态颜色
      }
      return statusMap[status] || '#d9d9d9'
    },
    
    getStatusText(status) {
      const statusMap = {
        active: '活跃',
        inactive: '非活跃',
        suspended: '已暂停' // 新增状态文本
      }
      return statusMap[status] || '未知'
    },

    getStatusIcon(status) {
      const iconMap = {
        active: 'check-circle',
        inactive: 'close-circle',
        suspended: 'pause-circle'
      }
      return iconMap[status] || 'question'
    },

    getRoleColor(role) {
      const roleMap = {
        '超级管理员': '#1890ff',
        '内容管理员': '#faad14',
        '用户管理员': '#52c41a',
        '普通用户': '#722ed1',
        '访客': '#f5222d'
      }
      return roleMap[role] || '#d9d9d9'
    },

    formatDate(timestamp) {
      if (!timestamp) return 'N/A'
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
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
    },

    handleSearch() {
      this.getUsersList({
        username: this.searchForm.getFieldValue('username'),
        email: this.searchForm.getFieldValue('email'),
        role: this.searchForm.getFieldValue('role'),
        status: this.searchForm.getFieldValue('status')
      })
    },

    handleReset() {
      this.searchForm.resetFields()
      this.getUsersList()
    },

    handleExport() {
      // 导出功能待实现
      this.$message.info('导出功能待实现')
    },

    viewUser(user) {
      // 查看用户详情功能待实现
      this.$message.info(`查看用户 ${user.username} 详情`)
    },

    resetPassword(id) {
      // 重置密码功能待实现
      this.$message.info(`重置用户 ${id} 的密码`)
    },

    toggleUserStatus(user) {
      // 切换用户状态功能待实现
      this.$message.info(`切换用户 ${user.username} 状态为 ${user.status === 'active' ? '非活跃' : '活跃'}`)
    },

    assignRole(user) {
      // 分配角色功能待实现
      this.$message.info(`分配角色给用户 ${user.username}`)
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
    
    h1 {
      margin: 0;
      color: #333;
    }
    p {
      color: #666;
      font-size: 14px;
    }
  }

  .content-wrapper {
    .search-card {
      margin-bottom: 24px;
      .ant-form-item {
        margin-bottom: 0;
      }
    }
    .table-card {
      .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #f0f0f0;
      }
      .user-info {
        .username {
          font-weight: bold;
          color: #333;
        }
        .user-id {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
      }
      .action-buttons {
        display: flex;
        align-items: center;
        .action-btn {
          margin-right: 8px;
          &:last-child {
            margin-right: 0;
          }
        }
        .delete-btn {
          color: #ff4d4f;
        }
      }
      .last-login {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .user-modal {
    .ant-form-item {
      margin-bottom: 16px;
    }
    .ant-form-item-label {
      font-weight: bold;
    }
    .ant-input-password {
      width: 100%;
    }
    .ant-textarea {
      width: 100%;
    }
  }
}
</style>
