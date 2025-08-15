<template>
  <div class="role-manage">
    <div class="page-header">
      <div class="header-content">
        <h1>角色管理</h1>
        <p>管理系统角色和权限配置</p>
      </div>
      <a-button type="primary" @click="showCreateModal" size="large">
        <a-icon type="plus" />
        新建角色
      </a-button>
    </div>
    
    <div class="content-wrapper">
      <a-card :bordered="false" class="table-card">
        <a-table
          :columns="columns"
          :data-source="rolesList"
          :loading="loading"
          row-key="id"
          :pagination="pagination"
          size="middle"
        >
          <template slot="permissions" slot-scope="permissions">
            <div class="permissions-tags">
              <a-tag v-if="permissions && permissions.includes('*')" color="red">
                <a-icon type="safety-certificate" />
                全部权限
              </a-tag>
              <template v-else>
                <a-tag v-for="perm in permissions" :key="perm" color="blue">
                  {{ perm }}
                </a-tag>
              </template>
            </div>
          </template>
          
          <template slot="userCount" slot-scope="count">
            <a-badge :count="count" :number-style="{ backgroundColor: '#52c41a' }" />
          </template>
          
          <template slot="status" slot-scope="status">
            <a-tag :color="status === 'active' ? 'green' : 'default'">
              {{ status === 'active' ? '启用' : '禁用' }}
            </a-tag>
          </template>
          
          <template slot="action" slot-scope="text, record">
            <div class="action-buttons">
              <a-button type="link" @click="editRole(record)" class="action-btn">
                <a-icon type="edit" />
                编辑
              </a-button>
              <a-button type="link" @click="viewRole(record)" class="action-btn">
                <a-icon type="eye" />
                查看
              </a-button>
              <a-popconfirm
                title="确定要删除这个角色吗？"
                @confirm="deleteRole(record.id)"
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

    <!-- 新建/编辑角色弹窗 -->
    <a-modal
      :title="isEdit ? '编辑角色' : '新建角色'"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
      :width="600"
      class="role-modal"
    >
      <a-form-model
        ref="roleForm"
        :model="roleForm"
        :rules="roleRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        layout="horizontal"
      >
        <a-form-model-item label="角色名称" prop="name">
          <a-input 
            v-model="roleForm.name" 
            placeholder="请输入角色名称"
            size="large"
          />
        </a-form-model-item>
        
        <a-form-model-item label="角色描述" prop="description">
          <a-textarea
            v-model="roleForm.description"
            :rows="4"
            placeholder="请输入角色描述"
            size="large"
          />
        </a-form-model-item>
        
        <a-form-model-item label="角色状态" prop="status">
          <a-radio-group v-model="roleForm.status" size="large">
            <a-radio value="active">启用</a-radio>
            <a-radio value="inactive">禁用</a-radio>
          </a-radio-group>
        </a-form-model-item>
        
        <a-form-model-item label="权限配置" prop="permissions">
          <div class="permissions-section">
            <div class="permissions-header">
              <a-checkbox
                :indeterminate="indeterminate"
                :checked="checkAll"
                @change="onCheckAllChange"
              >
                全选
              </a-checkbox>
            </div>
            <a-divider style="margin: 12px 0" />
            <div class="permissions-groups">
              <div class="permission-group">
                <h4>作品管理</h4>
                <a-checkbox-group v-model="roleForm.permissions" @change="onPermissionChange">
                  <a-checkbox value="works:read">作品查看</a-checkbox>
                  <a-checkbox value="works:write">作品编辑</a-checkbox>
                  <a-checkbox value="works:delete">作品删除</a-checkbox>
                  <a-checkbox value="works:publish">作品发布</a-checkbox>
                </a-checkbox-group>
              </div>
              
              <div class="permission-group">
                <h4>分类管理</h4>
                <a-checkbox-group v-model="roleForm.permissions" @change="onPermissionChange">
                  <a-checkbox value="categories:read">分类查看</a-checkbox>
                  <a-checkbox value="categories:write">分类编辑</a-checkbox>
                  <a-checkbox value="categories:delete">分类删除</a-checkbox>
                </a-checkbox-group>
              </div>
              
              <div class="permission-group">
                <h4>用户管理</h4>
                <a-checkbox-group v-model="roleForm.permissions" @change="onPermissionChange">
                  <a-checkbox value="users:read">用户查看</a-checkbox>
                  <a-checkbox value="users:write">用户编辑</a-checkbox>
                  <a-checkbox value="users:delete">用户删除</a-checkbox>
                </a-checkbox-group>
              </div>
              
              <div class="permission-group">
                <h4>系统管理</h4>
                <a-checkbox-group v-model="roleForm.permissions" @change="onPermissionChange">
                  <a-checkbox value="roles:read">角色查看</a-checkbox>
                  <a-checkbox value="roles:write">角色编辑</a-checkbox>
                  <a-checkbox value="system:config">系统配置</a-checkbox>
                </a-checkbox-group>
              </div>
            </div>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'RoleManage',
  data() {
    return {
      modalVisible: false,
      isEdit: false,
      submitLoading: false,
      roleForm: {
        name: '',
        description: '',
        permissions: [],
        status: 'active' // Added status field
      },
      roleRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ],
        permissions: [
          { required: true, message: '请选择权限', trigger: 'change' }
        ]
      },
      indeterminate: false, // Added for indeterminate state of checkbox
      checkAll: false // Added for checkAll state of checkbox
    }
  },
  computed: {
    ...mapGetters('system', ['rolesList', 'loading', 'pagination']),
    columns() {
      return [
        {
          title: '角色名称',
          dataIndex: 'name',
          key: 'name',
          width: 150
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description',
          ellipsis: true
        },
        {
          title: '权限',
          dataIndex: 'permissions',
          key: 'permissions',
          width: 300,
          scopedSlots: { customRender: 'permissions' }
        },
        {
          title: '用户数量',
          dataIndex: 'userCount',
          key: 'userCount',
          width: 100,
          scopedSlots: { customRender: 'userCount' }
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
          title: '操作',
          key: 'action',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {
    this.getRolesList()
  },
  methods: {
    ...mapActions('system', ['getRolesList', 'createRole', 'updateRole', 'deleteRole']),
    
    showCreateModal() {
      this.isEdit = false
      this.roleForm = {
        name: '',
        description: '',
        permissions: [],
        status: 'active'
      }
      this.indeterminate = false
      this.checkAll = false
      this.modalVisible = true
    },
    
    editRole(role) {
      this.isEdit = true
      this.roleForm = {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: [...role.permissions],
        status: role.status
      }
      this.indeterminate = false
      this.checkAll = false
      this.modalVisible = true
    },

    viewRole(role) {
      this.isEdit = false // Treat view as edit for now
      this.roleForm = {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: [...role.permissions],
        status: role.status
      }
      this.indeterminate = false
      this.checkAll = false
      this.modalVisible = true
    },
    
    async handleSubmit() {
      try {
        await this.$refs.roleForm.validate()
        this.submitLoading = true
        
        if (this.isEdit) {
          await this.updateRole(this.roleForm)
          this.$message.success('更新角色成功')
        } else {
          await this.createRole(this.roleForm)
          this.$message.success('创建角色成功')
        }
        
        this.modalVisible = false
        this.getRolesList() // 刷新列表
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        this.submitLoading = false
      }
    },
    
    handleCancel() {
      this.modalVisible = false
      this.$refs.roleForm.resetFields()
    },
    
    async deleteRole(id) {
      try {
        await this.deleteRole(id)
        this.$message.success('删除角色成功')
        this.getRolesList() // 刷新列表
      } catch (error) {
        this.$message.error('删除失败')
      }
    },

    // New methods for checkbox group
    onCheckAllChange(e) {
      this.checkAll = e.target.checked;
      this.indeterminate = false;
      this.roleForm.permissions = e.target.checked ? ['*'] : [];
    },

    onPermissionChange(checkedValues) {
      const numChecked = checkedValues.length;
      this.checkAll = numChecked === this.permissionsOptions.length;
      this.indeterminate = numChecked > 0 && numChecked < this.permissionsOptions.length;
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
    
    h1 {
      margin: 0;
      color: #333;
    }
    p {
      color: #666;
      font-size: 14px;
      margin-top: 5px;
    }
  }

  .content-wrapper {
    .table-card {
      .permissions-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .action-buttons {
        display: flex;
        gap: 8px;
        .action-btn {
          padding: 0 8px;
          &:hover {
            color: #1890ff;
          }
        }
        .delete-btn {
          color: #ff4d4f;
          &:hover {
            color: #ff4d4f;
          }
        }
      }
    }
  }

  .role-modal {
    .permissions-section {
      .permissions-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        .ant-checkbox {
          margin-right: 10px;
        }
      }
      .permissions-groups {
        .permission-group {
          margin-bottom: 20px;
          h4 {
            margin-bottom: 10px;
            color: #515a6e;
          }
          .ant-checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
        }
      }
    }
  }
}
</style>
