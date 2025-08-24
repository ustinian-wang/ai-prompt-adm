<template>
  <div class="role-manage page-container fade-in">
    <PageHeader
      title="角色管理"
      description="管理系统角色和权限配置"
      :actions="[
        {
          key: 'create',
          text: '新建角色',
          type: 'primary',
          icon: 'plus',
          onClick: showCreateModal
        }
      ]"
    />
    
    <div class="content-wrapper">
      <!-- 搜索筛选区域 -->
      <a-card :bordered="false" class="search-card">
        <a-form layout="inline" :form="searchForm" class="unified-form">
          <a-row :gutter="16" style="width: 100%">
            <a-col :span="6">
              <a-form-item label="角色名称">
                <a-input
                  v-decorator="['name']"
                  placeholder="请输入角色名称"
                  allow-clear
                  
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="角色状态">
                <a-select
                  v-decorator="['status']"
                  placeholder="请选择状态"
                  allow-clear
                  
                >
                  <a-select-option value="active">启用</a-select-option>
                  <a-select-option value="inactive">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="权限类型">
                <a-select
                  v-decorator="['permissionType']"
                  placeholder="请选择权限类型"
                  allow-clear
                  
                >
                  <a-select-option value="works">作品管理</a-select-option>
                  <a-select-option value="categories">分类管理</a-select-option>
                  <a-select-option value="users">用户管理</a-select-option>
                  <a-select-option value="system">系统管理</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-button type="primary" @click="handleSearch" >
                  <a-icon type="search" />
                  搜索
                </a-button>
                <a-button style="margin-left: 8px" @click="handleReset" >
                  <a-icon type="reload" />
                  重置
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      
      <!-- 角色表格 -->
      <a-card :bordered="false" class="table-card">
        <a-table
          :columns="columns"
          :data-source="rolesList"
          :loading="loading"
          row-key="id"
          :pagination="pagination"
          size="middle"
          class="data-table"
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
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="角色名称" prop="name">
              <a-input 
                v-model="roleForm.name" 
                placeholder="请输入角色名称"
                
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="角色状态" prop="status">
              <a-radio-group v-model="roleForm.status" >
                <a-radio value="active">启用</a-radio>
                <a-radio value="inactive">禁用</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        
        <a-form-model-item label="角色描述" prop="description">
          <a-textarea
            v-model="roleForm.description"
            :rows="4"
            placeholder="请输入角色描述"
            
          />
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
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'RoleManage',
  components: {
    PageHeader
  },
  data() {
    return {
      modalVisible: false,
      isEdit: false,
      submitLoading: false,
      searchForm: null,
      roleForm: {
        name: '',
        description: '',
        permissions: [],
        status: 'active'
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
      indeterminate: false,
      checkAll: false,
      permissionsOptions: [
        'works:read', 'works:write', 'works:delete', 'works:publish',
        'categories:read', 'categories:write', 'categories:delete',
        'users:read', 'users:write', 'users:delete',
        'roles:read', 'roles:write', 'system:config'
      ]
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
    
    handleSearch() {
      // 搜索功能待实现
      this.$message.info('搜索功能待实现')
    },
    
    handleReset() {
      // 重置功能待实现
      this.$message.info('重置功能待实现')
    },
    
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
      this.isEdit = false
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

  .content-wrapper {
    .table-card {
      .permissions-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
      }
    }
  }

  .role-modal {
    .permissions-section {
      .permissions-header {
        display: flex;
        align-items: center;
        margin-bottom: var(--spacing-md);
        .ant-checkbox {
          margin-right: var(--spacing-sm);
        }
      }
      
      .permissions-groups {
        .permission-group {
          margin-bottom: var(--spacing-lg);
          
          h4 {
            margin-bottom: var(--spacing-sm);
            color: var(--text-primary);
            font-weight: 500;
          }
          
          .ant-checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-sm);
          }
        }
      }
    }
  }
}
</style>
