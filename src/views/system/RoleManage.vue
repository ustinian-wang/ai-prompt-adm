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
      <template slot="permissions" slot-scope="permissions">
        <a-tag v-if="permissions && permissions.includes('*')" color="red">全部权限</a-tag>
        <template v-else>
          <a-tag v-for="perm in permissions" :key="perm" color="blue">{{ perm }}</a-tag>
        </template>
      </template>
      
      <template slot="userCount" slot-scope="count">
        <a-tag color="green">{{ count }}</a-tag>
      </template>
      
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

    <!-- 新建/编辑角色弹窗 -->
    <a-modal
      :title="isEdit ? '编辑角色' : '新建角色'"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
    >
      <a-form-model
        ref="roleForm"
        :model="roleForm"
        :rules="roleRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="角色名称" prop="name">
          <a-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </a-form-model-item>
        
        <a-form-model-item label="角色描述" prop="description">
          <a-textarea
            v-model="roleForm.description"
            :rows="4"
            placeholder="请输入角色描述"
          />
        </a-form-model-item>
        
        <a-form-model-item label="权限配置" prop="permissions">
          <a-select
            v-model="roleForm.permissions"
            mode="multiple"
            placeholder="请选择权限"
            style="width: 100%"
          >
            <a-select-option value="*">全部权限</a-select-option>
            <a-select-option value="works:read">作品查看</a-select-option>
            <a-select-option value="works:write">作品编辑</a-select-option>
            <a-select-option value="works:delete">作品删除</a-select-option>
            <a-select-option value="categories:read">分类查看</a-select-option>
            <a-select-option value="categories:write">分类编辑</a-select-option>
            <a-select-option value="users:read">用户查看</a-select-option>
            <a-select-option value="users:write">用户编辑</a-select-option>
            <a-select-option value="users:delete">用户删除</a-select-option>
            <a-select-option value="roles:read">角色查看</a-select-option>
            <a-select-option value="roles:write">角色编辑</a-select-option>
          </a-select>
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
        permissions: []
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
      }
    }
  },
  computed: {
    ...mapGetters('system', ['rolesList', 'loading']),
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
        permissions: []
      }
      this.modalVisible = true
    },
    
    editRole(role) {
      this.isEdit = true
      this.roleForm = {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: [...role.permissions]
      }
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
