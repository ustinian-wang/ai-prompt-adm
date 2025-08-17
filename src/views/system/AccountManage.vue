<template>
  <div class="account-manage">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-section">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="search-section">
      <a-form layout="inline" :form="searchForm">
        <a-form-item label="账户列表">
          <a-select
            v-decorator="['accountType']"
            placeholder="请选择账户类型"
            style="width: 120px"
          >
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="ID">
          <a-input
            v-decorator="['id']"
            placeholder="请输入ID"
            style="width: 120px"
          />
        </a-form-item>
        
        <a-form-item label="账户">
          <a-input
            v-decorator="['username']"
            placeholder="请输入账户"
            style="width: 120px"
          />
        </a-form-item>
        
        <a-form-item label="真实姓名">
          <a-input
            v-decorator="['user_real_name']"
            placeholder="请输入真实姓名"
            style="width: 120px"
          />
        </a-form-item>
        
        <a-form-item label="角色">
          <a-select
            v-decorator="['user_role']"
            placeholder="请选择角色"
            style="width: 120px"
          >
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="admin">总后台管理员</a-select-option>
            <a-select-option value="sales">业务员</a-select-option>
            <a-select-option value="manager">客户经理</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="手机号码">
          <a-input
            v-decorator="['user_mobile']"
            placeholder="请输入手机号码"
            style="width: 120px"
          />
        </a-form-item>
        
        <a-form-item label="状态">
          <a-select
            v-decorator="['user_status']"
            placeholder="请选择状态"
            style="width: 120px"
          >
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="active">正常</a-select-option>
            <a-select-option value="inactive">冻结</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="开始日期">
          <a-date-picker
            v-decorator="['startDate']"
            style="width: 120px"
            placeholder="开始日期"
          />
        </a-form-item>
        
        <a-form-item label="结束日期">
          <a-date-picker
            v-decorator="['endDate']"
            style="width: 120px"
            placeholder="结束日期"
          />
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" @click="handleSearch" icon="search">
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset" icon="reload">
            重置
          </a-button>
          <a-button style="margin-left: 8px" @click="handleExport" icon="download">
            导出
          </a-button>
          <a-button type="primary" style="margin-left: 8px" @click="showCreateModal" icon="plus">
            新增用户
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 账号列表表格 -->
    <div class="table-section">
      <a-table
        :columns="columns"
        :data-source="accountList"
        :pagination="false"
        :loading="tableLoading"
        :row-key="record => record.id"
        :row-selection="rowSelection"
        size="middle"
      >
        <template slot="status" slot-scope="text">
          <a-tag :color="text === '正常' ? 'green' : 'red'">
            {{ text }}
          </a-tag>
        </template>
        
        <template slot="operation" slot-scope="text, record">
          <a-button
            type="primary"
            size="small"
            style="margin-right: 8px"
            @click="handleEdit(record)"
          >
            编辑
          </a-button>
          <a-button
            type="primary"
            size="small"
            @click="handleToggleStatus(record)"
          >
            {{ record.status === '正常' ? '冻结' : '解冻' }}
          </a-button>
        </template>
      </a-table>
      
      <!-- 分页 -->
      <div class="pagination-section">
        <a-pagination
          :current="pagination.current"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :show-total="total => `共${total}条`"
          @change="handlePageChange"
          @showSizeChange="handlePageSizeChange"
        />
      </div>
    </div>

    <!-- 新增/编辑用户弹窗 -->
    <a-modal
      v-model="userModalVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      @ok="handleUserSubmit"
      @cancel="handleUserCancel"
      :confirm-loading="userLoading"
      :width="600"
    >
      <a-form :form="userForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="账户">
              <a-input
                v-decorator="[
                  'username',
                  { 
                    rules: [
                      { required: true, message: '请输入账户!' },
                      { min: 2, max: 50, message: '账户长度在2-50个字符!' }
                    ] 
                  }
                ]"
                placeholder="请输入账户"
                :disabled="isEdit"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色">
              <a-select
                v-decorator="[
                  'user_role',
                  { rules: [{ required: true, message: '请选择角色!' }] }
                ]"
                placeholder="请选择角色"
              >
                <a-select-option value="admin">总后台管理员</a-select-option>
                <a-select-option value="sales">业务员</a-select-option>
                <a-select-option value="manager">客户经理</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="真实姓名">
              <a-input
                v-decorator="[
                  'user_real_name',
                  { rules: [{ required: true, message: '请输入真实姓名!' }] }
                ]"
                placeholder="请输入真实姓名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号码">
              <a-input
                v-decorator="[
                  'user_mobile',
                  { rules: [{ required: true, message: '请输入手机号码!' }] }
                ]"
                placeholder="请输入手机号码"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="邮箱">
              <a-input
                v-decorator="[
                  'user_email',
                  { 
                    rules: [
                      { required: true, message: '请输入邮箱!' },
                      { type: 'email', message: '请输入正确的邮箱格式!' }
                    ] 
                  }
                ]"
                placeholder="请输入邮箱"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态">
              <a-select
                v-decorator="[
                  'user_status',
                  { rules: [{ required: true, message: '请选择状态!' }] }
                ]"
                placeholder="请选择状态"
              >
                <a-select-option value="active">正常</a-select-option>
                <a-select-option value="inactive">冻结</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item v-if="!isEdit" label="密码">
          <a-input-password
            v-decorator="[
              'password',
              { 
                rules: [
                  { required: true, message: '请输入密码!' },
                  { min: 6, message: '密码长度不能少于6位!' }
                ] 
              }
            ]"
            placeholder="请输入密码"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getUserListApi, updateUserApi, createUserApi, deleteUserApi, toggleUserStatusApi, exportUsersApi } from '@/api/userApi'

export default {
  name: 'AccountManage',
  data() {
    return {
      activeTab: '1',
      searchForm: null,
      userForm: null,
      tableLoading: false,
      userLoading: false,
      userModalVisible: false,
      isEdit: false,
      currentRecord: null,
      selectedRowKeys: [],
      
      // 分页配置
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      
      // 表格列配置
      columns: [
        {
          title: 'ID',
          dataIndex: 'user_id',
          key: 'user_id',
          width: 80
        },
        {
          title: '账户',
          dataIndex: 'username',
          key: 'username',
          width: 120
        },
        {
          title: '角色',
          dataIndex: 'user_role',
          key: 'user_role',
          width: 150
        },
        {
          title: '真实姓名',
          dataIndex: 'user_real_name',
          key: 'user_real_name',
          width: 120
        },
        {
          title: '手机号码',
          dataIndex: 'user_mobile',
          key: 'user_mobile',
          width: 130
        },
        {
          title: '邮箱',
          dataIndex: 'user_email',
          key: 'user_email',
          width: 150
        },
        {
          title: '状态',
          dataIndex: 'user_status',
          key: 'user_status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'user_created_at',
          key: 'user_created_at',
          width: 180
        },
        {
          title: '操作',
          key: 'operation',
          width: 200,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      
      // 账号列表数据
      accountList: []
    }
  },
  
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          disabled: record.role === '总后台管理员'
        })
      }
    }
  },
  
  beforeCreate() {
    this.searchForm = this.$form.createForm(this)
    this.userForm = this.$form.createForm(this)
  },
  
  mounted() {
    this.loadAccountList()
  },
  
  methods: {
    // 加载账号列表
    async loadAccountList() {
      try {
        this.tableLoading = true
        const params = this.getSearchParams()
        const res = await getUserListApi(params)
        console.log('jser loadAccountList res', res);
        if (res.data.success) {
          this.accountList = res.data.list
          this.pagination.total = res.data.total
          this.pagination.current = res.data.page
          this.pagination.pageSize = res.data.pageSize
        } else {
          this.$message.error(res.data.message || '获取用户列表失败')
        }
      } catch (error) {
        console.error('加载用户列表失败:', error)
        this.$message.error('获取用户列表失败')
      } finally {
        this.tableLoading = false
      }
    },
    
    // 获取搜索参数
    getSearchParams() {
      // const values = this.searchForm.getFieldsValue()
      return {
        // ...values,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
    },
    
    // 搜索
    handleSearch() {
      this.pagination.current = 1
      this.loadAccountList()
    },
    
    // 重置搜索
    handleReset() {
      this.searchForm.resetFields()
      this.pagination.current = 1
      this.loadAccountList()
    },
    
    // 导出
    async handleExport() {
      try {
        const params = this.getSearchParams()
        const res = await exportUsersApi(params)
        console.log('jser exportUsersApi res', res);
        if (res.data.success) {
          // 这里可以实现Excel导出逻辑
          this.$message.success('导出成功')
        } else {
          this.$message.error(res.data.message || '导出失败')
        }
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败')
      }
    },
    
    // 显示新增用户弹窗
    showCreateModal() {
      this.isEdit = false
      this.currentRecord = null
      this.userModalVisible = true
      this.$nextTick(() => {
        this.userForm.resetFields()
      })
    },
    
    // 编辑账号
    handleEdit(record) {
      // 跳转到账户详情页面
      this.$router.push({ 
        name: 'AccountDetail', 
        params: { id: record.user_id } 
      })
    },
    
    // 用户提交
    async handleUserSubmit() {
      try {
        const values = await new Promise((resolve, reject) => {
          this.userForm.validateFields((err, values) => {
            if (err) reject(err)
            else resolve(values)
          })
        })
        
        this.userLoading = true
        
        if (this.isEdit) {
          // 编辑用户
          const res = await updateUserApi(this.currentRecord.id, values)
          if (res.data.success) {
            this.$message.success('编辑成功!')
            this.userModalVisible = false
            this.loadAccountList()
          } else {
            this.$message.error(res.data.message || '编辑失败')
          }
        } else {
          // 新增用户
          const res = await createUserApi(values)
          if (res.data.success) {
            this.$message.success('创建成功!')
            this.userModalVisible = false
            this.loadAccountList()
          } else {
            this.$message.error(response.message || '创建失败')
          }
        }
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('操作失败，请检查输入信息!')
      } finally {
        this.userLoading = false
      }
    },
    
    // 用户取消
    handleUserCancel() {
      this.userModalVisible = false
      this.userForm.resetFields()
    },
    
    // 删除用户
    handleDelete(record) {
      if (record.role === '总后台管理员') {
        this.$message.warning('不能删除管理员用户')
        return
      }
      
      this.$confirm({
        title: '确认删除',
        content: `确定要删除用户 "${record.account}" 吗？`,
        onOk: async () => {
          try {
            const res = await deleteUserApi(record.id)
            if (res.data.success) {
              this.$message.success('删除成功!')
              this.loadAccountList()
            } else {
              this.$message.error(response.message || '删除失败')
            }
          } catch (error) {
            console.error('删除失败:', error)
            this.$message.error('删除失败')
          }
        }
      })
    },
    
    // 切换状态（冻结/解冻）
    async handleToggleStatus(record) {
      const action = record.status === '正常' ? '冻结' : '解冻'
      const status = record.status === '正常' ? 'inactive' : 'active'
      
      this.$confirm({
        title: `确认${action}`,
        content: `确定要${action}用户 "${record.account}" 吗？`,
        onOk: async () => {
          try {
            const res = await toggleUserStatusApi(record.id, status)
            if (res.data.success) {
              this.$message.success(`${action}成功!`)
              this.loadAccountList()
            } else {
              this.$message.error(response.message || `${action}失败`)
            }
          } catch (error) {
            console.error(`${action}失败:`, error)
            this.$message.error(`${action}失败`)
          }
        }
      })
    },
    
    // 分页变化
    handlePageChange(page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.loadAccountList()
    },
    
    // 每页条数变化
    handlePageSizeChange(current, size) {
      this.pagination.current = 1
      this.pagination.pageSize = size
      this.loadAccountList()
    },
    
    // 标签页编辑
    onTabEdit(targetKey, action) {
      if (action === 'remove') {
        // 移除标签页逻辑
      }
    },
    
    // 行选择变化
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    
    // 获取角色值
    getRoleValue(roleText) {
      const roleMap = {
        '总后台管理员': 'admin',
        '业务员': 'sales',
        '客户经理': 'manager'
      }
      return roleMap[roleText] || 'sales'
    },
    
    // 获取状态值
    getStatusValue(statusText) {
      const statusMap = {
        '正常': 'active',
        '冻结': 'inactive'
      }
      return statusMap[statusText] || 'active'
    }
  }
}
</script>

<style lang="scss" scoped>
.account-manage {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
  
  .breadcrumb-section {
    background: #fff;
    padding: 16px 24px;
    margin-bottom: 16px;
    border-radius: 6px;
    
    .ant-breadcrumb {
      margin-bottom: 16px;
    }
    
    .tabs-section {
      .ant-tabs-tab {
        padding: 8px 16px;
        
        &.ant-tabs-tab-active {
          background: #e6f7ff;
          border-color: #1890ff;
        }
      }
    }
  }
  
  .search-section {
    background: #fff;
    padding: 24px;
    margin-bottom: 16px;
    border-radius: 6px;
    
    .ant-form-item {
      margin-bottom: 16px;
      
      .ant-form-item-label {
        label {
          font-weight: 500;
          color: #262626;
        }
      }
    }
    
    .ant-input, .ant-select {
      border-radius: 4px;
    }
    
    .ant-btn {
      border-radius: 4px;
      height: 32px;
      
      &.ant-btn-primary {
        background: #1890ff;
        border-color: #1890ff;
        
        &:hover {
          background: #40a9ff;
          border-color: #40a9ff;
        }
      }
    }
  }
  
  .table-section {
    background: #fff;
    border-radius: 6px;
    overflow: auto;
    
    .ant-table {
      .ant-table-thead > tr > th {
        background: #fafafa;
        font-weight: 500;
        color: #262626;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .ant-table-tbody > tr > td {
        border-bottom: 1px solid #f0f0f0;
      }
      
      .ant-table-tbody > tr:hover > td {
        background: #f5f5f5;
      }
    }
    
    .pagination-section {
      padding: 16px 24px;
      text-align: right;
      border-top: 1px solid #f0f0f0;
      
      .ant-pagination {
        .ant-pagination-total-text {
          margin-right: 16px;
        }
        
        .ant-pagination-options {
          margin-left: 16px;
        }
      }
    }
  }
  
  .ant-modal {
    .ant-form-item-label {
      label {
        font-weight: 500;
        color: #262626;
      }
    }
    
    .ant-input, .ant-select {
      border-radius: 4px;
    }
  }
  
  .ant-tag {
    border-radius: 4px;
    font-size: 12px;
    padding: 2px 8px;
  }
}
</style>
