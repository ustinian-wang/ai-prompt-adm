<template>
  <div class="work-list">
    <BackButton text="返回首页" to="/works" />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>作品管理</h1>
        <p>管理您的AI作品，组织内容结构</p>
      </div>
      <div class="header-actions">
        <a-button type="primary" @click="addWork" size="large">
          <a-icon type="plus" />
          新增作品
        </a-button>
        <a-button style="margin-left: 8px" @click="handleBatchOperation" size="large">
          <a-icon type="tool" />
          批量操作
        </a-button>
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <a-card :bordered="false" class="search-card">
      <a-form layout="inline" :form="searchForm">
        <a-row :gutter="16" style="width: 100%">
          <a-col :span="6">
            <a-form-item label="作品名称">
              <a-input
                v-decorator="['workName']"
                placeholder="作品名称"
                allow-clear
                size="large"
              >
                <a-icon slot="prefix" type="search" />
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="作品类型">
              <a-select
                v-decorator="['workType']"
                placeholder="选择类型"
                allow-clear
                size="large"
              >
                <a-select-option value="UI设计">UI设计</a-select-option>
                <a-select-option value="3D设计">3D设计</a-select-option>
                <a-select-option value="图标设计">图标设计</a-select-option>
                <a-select-option value="插画设计">插画设计</a-select-option>
                <a-select-option value="AI写作">AI写作</a-select-option>
                <a-select-option value="AI编程">AI编程</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="分类">
              <a-tree-select
                v-decorator="['category']"
                :tree-data="categoryTree"
                placeholder="选择分类"
                allow-clear
                tree-default-expand-all
                size="large"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="状态">
              <a-select
                v-decorator="['status']"
                placeholder="选择状态"
                allow-clear
                size="large"
              >
                <a-select-option value="draft">草稿</a-select-option>
                <a-select-option value="published">已发布</a-select-option>
                <a-select-option value="archived">已归档</a-select-option>
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

    <!-- 数据表格 -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="worksList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        size="middle"
        :row-selection="rowSelection"
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

        <!-- 作品信息列 -->
        <template slot="workInfo" slot-scope="record">
          <div class="work-info">
            <div class="work-title">{{ record.workName }}</div>
            <div class="work-meta">
              <span class="work-author">作者: {{ record.author }}</span>
              <span class="work-date">{{ formatDate(record.createTime) }}</span>
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
          <a-tag :color="getStatusColor(status)">
            <a-icon :type="getStatusIcon(status)" />
            {{ getStatusText(status) }}
          </a-tag>
        </template>

        <!-- 操作列 -->
        <template slot="action" slot-scope="text, record">
          <div class="action-buttons">
            <a-button type="link" @click="viewWork(record)" class="action-btn">
              <a-icon type="eye" />
              查看
            </a-button>
            <a-button type="link" @click="editWork(record)" class="action-btn">
              <a-icon type="edit" />
              编辑
            </a-button>
            <a-dropdown>
              <a-button type="link" class="action-btn">
                <a-icon type="more" />
                更多
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item @click="duplicateWork(record.id)">
                  <a-icon type="copy" />
                  复制作品
                </a-menu-item>
                <a-menu-item @click="shareWork(record.id)">
                  <a-icon type="share-alt" />
                  分享作品
                </a-menu-item>
                <a-menu-item @click="archiveWork(record.id)">
                  <a-icon type="inbox" />
                  归档作品
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-popconfirm
              title="确定要删除这个作品吗？"
              @confirm="deleteWork(record.id)"
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
        workType: '',
        category: null,
        status: null
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
      },
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedWorks = selectedRows;
        },
        getCheckboxProps: (record) => ({
          disabled: record.status === 'archived', // 禁用已归档的作品
          name: record.id,
        }),
      },
      selectedWorks: [],
      categoryTree: [
        {
          title: 'AI创作',
          value: 'ai_creation',
          key: 'ai_creation',
          children: [
            { title: 'AI绘画', value: 'ai_painting', key: 'ai_painting' },
            { title: 'AI写作', value: 'ai_writing', key: 'ai_writing' },
            { title: 'AI编程', value: 'ai_programming', key: 'ai_programming' },
          ],
        },
        {
          title: 'UI设计',
          value: 'ui_design',
          key: 'ui_design',
          children: [
            { title: '图标设计', value: 'icon_design', key: 'icon_design' },
            { title: '界面设计', value: 'interface_design', key: 'interface_design' },
          ],
        },
        {
          title: '3D设计',
          value: '3d_design',
          key: '3d_design',
          children: [
            { title: '3D模型', value: '3d_model', key: '3d_model' },
            { title: '3D动画', value: '3d_animation', key: '3d_animation' },
          ],
        },
        {
          title: '插画设计',
          value: 'illustration_design',
          key: 'illustration_design',
          children: [
            { title: '手绘插画', value: 'hand_illustration', key: 'hand_illustration' },
            { title: '数字插画', value: 'digital_illustration', key: 'digital_illustration' },
          ],
        },
      ],
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
          title: '作品信息',
          dataIndex: 'workInfo',
          key: 'workInfo',
          width: 250,
          scopedSlots: { customRender: 'workInfo' }
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
      this.$refs.searchForm.resetFields()
      this.getWorksList()
    },

    // 导出
    handleExport() {
      console.log('导出功能待实现')
      // 实际导出逻辑需要调用后端API
    },

    // 批量操作
    handleBatchOperation() {
      console.log('批量操作功能待实现')
      // 实际批量操作逻辑需要调用后端API
    },

    // 查看作品详情
    viewWork(work) {
      console.log('查看作品详情:', work)
      // 跳转到作品详情页面
      this.$router.push({ name: 'WorkDetail', params: { id: work.id } })
    },

    // 显示新增弹窗
    addWork() {
      // this.isEdit = false
      // this.workForm = {
      //   workName: '',
      //   workType: '',
      //   description: '',
      //   tags: [],
      //   image: ''
      // }
      // this.modalVisible = true
      this.$router.push({ name: 'WorkDetail' })
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
    
    // 复制作品
    async duplicateWork(id) {
      try {
        await this.createWork(this.worksList.find(work => work.id === id))
        this.$message.success('作品复制成功')
        this.getWorksList()
      } catch (error) {
        this.$message.error('作品复制失败')
      }
    },

    // 分享作品
    async shareWork(id) {
      try {
        const work = this.worksList.find(work => work.id === id)
        // 模拟分享逻辑，实际需要调用分享API
        this.$message.success(`作品 "${work.workName}" 已分享`)
      } catch (error) {
        this.$message.error('分享失败')
      }
    },

    // 归档作品
    async archiveWork(id) {
      try {
        const work = this.worksList.find(work => work.id === id)
        await this.updateWork({
          ...work,
          status: 'archived'
        })
        this.$message.success('作品已归档')
        this.getWorksList()
      } catch (error) {
        this.$message.error('归档失败')
      }
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
    },

    // 格式化日期
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    // 获取状态颜色
    getStatusColor(status) {
      switch (status) {
        case 'published':
          return 'green';
        case 'archived':
          return 'gray';
        default:
          return 'blue';
      }
    },

    // 获取状态图标
    getStatusIcon(status) {
      switch (status) {
        case 'published':
          return 'check-circle';
        case 'archived':
          return 'inbox';
        default:
          return 'clock-circle';
      }
    },

    // 获取状态文本
    getStatusText(status) {
      switch (status) {
        case 'published':
          return '已发布';
        case 'archived':
          return '已归档';
        default:
          return '草稿';
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
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-content {
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #262626;
      }
      p {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
    }
  }
  
  .search-card {
    margin-bottom: 24px;
    .ant-form-item {
      margin-bottom: 0;
    }
  }
  
  .table-card {
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
    
    .work-info {
      .work-title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }
      .work-meta {
        font-size: 12px;
        color: #999;
      }
    }

    .work-tags {
      .ant-tag {
        margin-bottom: 4px;
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
