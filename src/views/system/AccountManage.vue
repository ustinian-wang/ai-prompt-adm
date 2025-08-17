<template>
  <div class="account-manage">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-section">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
      </a-breadcrumb>
      
      <!-- 标签页 -->
      <div class="tabs-section">
        <a-tabs v-model="activeTab" type="editable-card" @edit="onTabEdit">
          <a-tab-pane key="1" tab="秒杀合同" closable>
            <div class="tab-content">秒杀合同内容</div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="合同列表" closable>
            <div class="tab-content">合同列表内容</div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="秒杀列表" closable>
            <div class="tab-content">秒杀列表内容</div>
          </a-tab-pane>
        </a-tabs>
      </div>
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
            v-decorator="['account']"
            placeholder="请输入账户"
            style="width: 120px"
          />
        </a-form-item>
        
        <a-form-item label="真实姓名">
          <a-input
            v-decorator="['realName']"
            placeholder="请输入真实姓名"
            style="width: 120px"
          />
        </a-form-item>
        
        <a-form-item label="角色">
          <a-select
            v-decorator="['role']"
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
            v-decorator="['phone']"
            placeholder="请输入手机号码"
            style="width: 120px"
          />
        </a-form-item>
        
        <a-form-item label="状态">
          <a-select
            v-decorator="['status']"
            placeholder="请选择状态"
            style="width: 120px"
          >
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="normal">正常</a-select-option>
            <a-select-option value="frozen">冻结</a-select-option>
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

    <!-- 编辑账号弹窗 -->
    <a-modal
      v-model="editModalVisible"
      title="编辑账号"
      @ok="handleEditSubmit"
      @cancel="handleEditCancel"
      :confirm-loading="editLoading"
      :width="600"
    >
      <a-form :form="editForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="账户">
              <a-input
                v-decorator="[
                  'account',
                  { rules: [{ required: true, message: '请输入账户!' }] }
                ]"
                placeholder="请输入账户"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色">
              <a-select
                v-decorator="[
                  'role',
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
                  'realName',
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
                  'phone',
                  { rules: [{ required: true, message: '请输入手机号码!' }] }
                ]"
                placeholder="请输入手机号码"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="邮箱">
          <a-input
            v-decorator="['email']"
            placeholder="请输入邮箱"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'AccountManage',
  data() {
    return {
      activeTab: '1',
      searchForm: null,
      editForm: null,
      tableLoading: false,
      editLoading: false,
      editModalVisible: false,
      currentRecord: null,
      
      // 分页配置
      pagination: {
        current: 1,
        pageSize: 10,
        total: 800
      },
      
      // 表格列配置
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80
        },
        {
          title: '账户',
          dataIndex: 'account',
          key: 'account',
          width: 120
        },
        {
          title: '角色',
          dataIndex: 'role',
          key: 'role',
          width: 150
        },
        {
          title: '真实姓名',
          dataIndex: 'realName',
          key: 'realName',
          width: 120
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone',
          width: 130
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          width: 150
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
          dataIndex: 'createTime',
          key: 'createTime',
          width: 180
        },
        {
          title: '操作',
          key: 'operation',
          width: 160,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      
      // 账号列表数据
      accountList: [
        {
          id: 52,
          account: 'admin',
          role: '总后台管理员',
          realName: 'admin',
          phone: 'admin',
          email: '0',
          status: '正常',
          createTime: '2024-04-18 21:47:18'
        },
        {
          id: 88,
          account: 'q123123',
          role: '业务员',
          realName: '吴有悠',
          phone: '12312345691',
          email: '-',
          status: '冻结',
          createTime: '2024-04-18 21:47:18'
        },
        {
          id: 31,
          account: 'w45656',
          role: '客户经理',
          realName: '邬啦',
          phone: '12312345691',
          email: '-',
          status: '正常',
          createTime: '2024-04-18 21:47:18'
        },
        {
          id: 18,
          account: 'e789788',
          role: '业务员',
          realName: '金灿灿',
          phone: '12312345691',
          email: '-',
          status: '冻结',
          createTime: '2024-04-18 21:47:18'
        }
      ]
    }
  },
  
  beforeCreate() {
    this.searchForm = this.$form.createForm(this)
    this.editForm = this.$form.createForm(this)
  },
  
  mounted() {
    this.loadAccountList()
  },
  
  methods: {
    // 加载账号列表
    loadAccountList() {
      this.tableLoading = true
      // 模拟API调用
      setTimeout(() => {
        this.tableLoading = false
      }, 500)
    },
    
    // 搜索
    handleSearch() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log('搜索条件:', values)
          this.pagination.current = 1
          this.loadAccountList()
        }
      })
    },
    
    // 重置搜索
    handleReset() {
      this.searchForm.resetFields()
      this.pagination.current = 1
      this.loadAccountList()
    },
    
    // 导出
    handleExport() {
      this.$message.info('导出功能开发中...')
    },
    
    // 编辑账号
    handleEdit(record) {
      this.currentRecord = record
      this.editModalVisible = true
      this.$nextTick(() => {
        this.editForm.setFieldsValue({
          account: record.account,
          role: this.getRoleValue(record.role),
          realName: record.realName,
          phone: record.phone,
          email: record.email === '-' ? '' : record.email
        })
      })
    },
    
    // 编辑提交
    handleEditSubmit() {
      this.editForm.validateFields((err, values) => {
        if (!err) {
          this.editLoading = true
          // 模拟API调用
          setTimeout(() => {
            this.$message.success('编辑成功!')
            this.editLoading = false
            this.editModalVisible = false
            this.loadAccountList()
          }, 1000)
        }
      })
    },
    
    // 编辑取消
    handleEditCancel() {
      this.editModalVisible = false
      this.editForm.resetFields()
    },
    
    // 切换状态（冻结/解冻）
    handleToggleStatus(record) {
      const action = record.status === '正常' ? '冻结' : '解冻'
      this.$confirm({
        title: `确认${action}`,
        content: `确定要${action}账号 "${record.account}" 吗？`,
        onOk: () => {
          // 模拟API调用
          setTimeout(() => {
            record.status = record.status === '正常' ? '冻结' : '正常'
            this.$message.success(`${action}成功!`)
          }, 500)
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
    
    // 获取角色值
    getRoleValue(roleText) {
      const roleMap = {
        '总后台管理员': 'admin',
        '业务员': 'sales',
        '客户经理': 'manager'
      }
      return roleMap[roleText] || 'sales'
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
    overflow: hidden;
    
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
