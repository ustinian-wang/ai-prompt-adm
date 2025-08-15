<template>
  <div class="work-list">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-section">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>作品管理</a-breadcrumb-item>
        <a-breadcrumb-item>作品列表</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <!-- 页面标题 -->
    <div class="page-header">
      <h1>作品发布</h1>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="search-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-input
            v-model="searchForm.workName"
            placeholder="作品名称"
            allow-clear
          />
        </a-col>
        <a-col :span="6">
          <a-select
            v-model="searchForm.workType"
            placeholder="选择类型"
            allow-clear
          >
            <a-select-option value="UI设计">UI设计</a-select-option>
            <a-select-option value="3D设计">3D设计</a-select-option>
            <a-select-option value="图标设计">图标设计</a-select-option>
            <a-select-option value="插画设计">插画设计</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-button type="primary" @click="handleSearch">
            <a-icon type="search" />
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset">
            重置
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-section">
      <a-button type="primary" @click="showCreateModal">
        <a-icon type="plus" />
        新增
      </a-button>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <a-table
        :columns="columns"
        :data-source="worksList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        size="middle"
      >
        <!-- 图片列 -->
        <template slot="image" slot-scope="record">
          <div class="work-image">
            <img 
              v-if="record.image" 
              :src="record.image" 
              :alt="record.workName"
              class="work-thumbnail"
            />
            <div v-else class="image-placeholder">
              <a-icon type="picture" />
            </div>
          </div>
        </template>

        <!-- 标签列 -->
        <template slot="tags" slot-scope="tags">
          <div class="work-tags">
            <a-tag v-for="tag in tags" :key="tag" color="blue">
              {{ tag }}
            </a-tag>
          </div>
        </template>

        <!-- 状态列 -->
        <template slot="status" slot-scope="status">
          <a-tag :color="status === '展示' ? 'green' : 'default'">
            {{ status }}
          </a-tag>
        </template>

        <!-- 操作列 -->
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button type="link" size="small" @click="editWork(record)">
              编辑
            </a-button>
            <a-button 
              type="link" 
              size="small" 
              @click="toggleStatus(record)"
            >
              {{ record.status === '展示' ? '隐藏' : '展示' }}
            </a-button>
            <a-popconfirm
              title="确定要删除这个作品吗？"
              @confirm="deleteWork(record.id)"
            >
              <a-button type="link" size="small" style="color: #ff4d4f">
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 新增/编辑作品弹窗 -->
    <a-modal
      :title="isEdit ? '编辑作品' : '新增作品'"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
      width="600px"
    >
      <a-form-model
        ref="workForm"
        :model="workForm"
        :rules="workRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="作品名称" prop="workName">
          <a-input v-model="workForm.workName" placeholder="请输入作品名称" />
        </a-form-model-item>
        
        <a-form-model-item label="作品类型" prop="workType">
          <a-select v-model="workForm.workType" placeholder="请选择作品类型">
            <a-select-option value="UI设计">UI设计</a-select-option>
            <a-select-option value="3D设计">3D设计</a-select-option>
            <a-select-option value="图标设计">图标设计</a-select-option>
            <a-select-option value="插画设计">插画设计</a-select-option>
          </a-select>
        </a-form-model-item>
        
        <a-form-model-item label="作品描述" prop="description">
          <a-textarea
            v-model="workForm.description"
            :rows="4"
            placeholder="请输入作品描述"
          />
        </a-form-model-item>
        
        <a-form-model-item label="作品标签">
          <a-select
            v-model="workForm.tags"
            mode="tags"
            placeholder="请输入标签，按回车确认"
            style="width: 100%"
          />
        </a-form-model-item>
        
        <a-form-model-item label="作品图片">
          <a-upload
            name="file"
            list-type="picture-card"
            class="work-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="handleImageChange"
          >
            <img v-if="workForm.image" :src="workForm.image" alt="作品图片" />
            <div v-else>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'WorkList',
  data() {
    return {
      modalVisible: false,
      isEdit: false,
      submitLoading: false,
      searchForm: {
        workName: '',
        workType: ''
      },
      workForm: {
        workName: '',
        workType: '',
        description: '',
        tags: [],
        image: ''
      },
      workRules: {
        workName: [
          { required: true, message: '请输入作品名称', trigger: 'blur' }
        ],
        workType: [
          { required: true, message: '请选择作品类型', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入作品描述', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('works', ['worksList', 'loading', 'pagination']),
    columns() {
      return [
        {
          title: '图片',
          dataIndex: 'image',
          key: 'image',
          width: 80,
          scopedSlots: { customRender: 'image' }
        },
        {
          title: '作品名称',
          dataIndex: 'workName',
          key: 'workName',
          width: 200
        },
        {
          title: '类型',
          dataIndex: 'workType',
          key: 'workType',
          width: 120
        },
        {
          title: '标签',
          dataIndex: 'tags',
          key: 'tags',
          width: 200,
          scopedSlots: { customRender: 'tags' }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 180
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {
    this.getWorksList()
  },
  methods: {
    ...mapActions('works', ['getWorksList', 'createWork', 'updateWork', 'deleteWork']),
    
    // 搜索
    handleSearch() {
      this.getWorksList(this.searchForm)
    },
    
    // 重置搜索
    handleReset() {
      this.searchForm = {
        workName: '',
        workType: ''
      }
      this.getWorksList()
    },
    
    // 显示新增弹窗
    showCreateModal() {
      this.isEdit = false
      this.workForm = {
        workName: '',
        workType: '',
        description: '',
        tags: [],
        image: ''
      }
      this.modalVisible = true
    },
    
    // 编辑作品
    editWork(work) {
      this.isEdit = true
      this.workForm = {
        id: work.id,
        workName: work.workName,
        workType: work.workType,
        description: work.description,
        tags: [...work.tags],
        image: work.image
      }
      this.modalVisible = true
    },
    
    // 切换状态
    async toggleStatus(work) {
      try {
        const newStatus = work.status === '展示' ? '隐藏' : '展示'
        await this.updateWork({
          ...work,
          status: newStatus
        })
        this.$message.success(`状态已${newStatus === '展示' ? '展示' : '隐藏'}`)
        this.getWorksList()
      } catch (error) {
        this.$message.error('状态更新失败')
      }
    },
    
    // 删除作品
    async deleteWork(id) {
      try {
        await this.deleteWork(id)
        this.$message.success('删除作品成功')
        this.getWorksList()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    
    // 提交表单
    async handleSubmit() {
      try {
        await this.$refs.workForm.validate()
        this.submitLoading = true
        
        if (this.isEdit) {
          await this.updateWork(this.workForm)
          this.$message.success('更新作品成功')
        } else {
          await this.createWork(this.workForm)
          this.$message.success('创建作品成功')
        }
        
        this.modalVisible = false
        this.getWorksList()
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        this.submitLoading = false
      }
    },
    
    // 取消操作
    handleCancel() {
      this.modalVisible = false
      this.$refs.workForm.resetFields()
    },
    
    // 图片上传前检查
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    
    // 图片上传变化处理
    handleImageChange(info) {
      if (info.file.status === 'done') {
        // 这里应该处理图片上传成功后的逻辑
        this.workForm.image = info.file.response.url || URL.createObjectURL(info.file.originFileObj)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.work-list {
  padding: 24px;
  background: #fff;
  
  .breadcrumb-section {
    margin-bottom: 16px;
  }
  
  .page-header {
    margin-bottom: 24px;
    
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #262626;
    }
  }
  
  .search-section {
    background: #fafafa;
    padding: 24px;
    border-radius: 6px;
    margin-bottom: 24px;
    
    .ant-col {
      display: flex;
      align-items: center;
    }
  }
  
  .action-section {
    margin-bottom: 24px;
  }
  
  .table-section {
    .work-image {
      .work-thumbnail {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 4px;
      }
      
      .image-placeholder {
        width: 50px;
        height: 50px;
        background: #f5f5f5;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
      }
    }
    
    .work-tags {
      .ant-tag {
        margin-bottom: 4px;
      }
    }
  }
  
  .work-uploader {
    .ant-upload-select {
      width: 100px;
      height: 100px;
    }
    
    .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }
  }
}
</style>
