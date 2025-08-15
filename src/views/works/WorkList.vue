<template>
  <div class="work-list">
    <div class="page-header">
      <h2>作品列表</h2>
      <a-button type="primary" @click="showCreateModal">
        <a-icon type="plus" />
        新建作品
      </a-button>
    </div>
    
    <a-table
      :columns="columns"
      :data-source="worksList"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
    >
      <template slot="status" slot-scope="text">
        <a-tag :color="getStatusColor(text)">{{ getStatusText(text) }}</a-tag>
      </template>
      
      <template slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" :key="tag" color="blue">{{ tag }}</a-tag>
      </template>
      
      <template slot="action" slot-scope="text, record">
        <a-button type="link" @click="viewWork(record)">查看</a-button>
        <a-button type="link" @click="editWork(record)">编辑</a-button>
        <a-button type="link" @click="configurePrompt(record)">配置提示词</a-button>
        <a-popconfirm
          title="确定要删除这个作品吗？"
          @confirm="deleteWork(record.id)"
        >
          <a-button type="link" style="color: #ff4d4f">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>

    <!-- 新建/编辑作品弹窗 -->
    <a-modal
      :title="isEdit ? '编辑作品' : '新建作品'"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
    >
      <a-form-model
        ref="workForm"
        :model="workForm"
        :rules="workRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="作品标题" prop="title">
          <a-input v-model="workForm.title" placeholder="请输入作品标题" />
        </a-form-model-item>
        
        <a-form-model-item label="作品描述" prop="description">
          <a-textarea
            v-model="workForm.description"
            :rows="4"
            placeholder="请输入作品描述"
          />
        </a-form-model-item>
        
        <a-form-model-item label="所属分类" prop="category">
          <a-select v-model="workForm.category" placeholder="请选择分类">
            <a-select-option value="AI写作">AI写作</a-select-option>
            <a-select-option value="AI绘画">AI绘画</a-select-option>
            <a-select-option value="AI编程">AI编程</a-select-option>
            <a-select-option value="AI分析">AI分析</a-select-option>
            <a-select-option value="AI应用">AI应用</a-select-option>
          </a-select>
        </a-form-model-item>
        
        <a-form-model-item label="标签">
          <a-select
            v-model="workForm.tags"
            mode="tags"
            placeholder="请输入标签，按回车确认"
            style="width: 100%"
          />
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
      workForm: {
        title: '',
        description: '',
        category: '',
        tags: []
      },
      workRules: {
        title: [
          { required: true, message: '请输入作品标题', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入作品描述', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择所属分类', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('works', ['worksList', 'loading', 'pagination']),
    columns() {
      return [
        {
          title: '作品标题',
          dataIndex: 'title',
          key: 'title',
          width: 200
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description',
          ellipsis: true
        },
        {
          title: '分类',
          dataIndex: 'category',
          key: 'category',
          width: 100
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '作者',
          dataIndex: 'author',
          key: 'author',
          width: 100
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
          width: 150
        },
        {
          title: '操作',
          key: 'action',
          width: 300,
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
    
    getStatusColor(status) {
      const statusMap = {
        draft: '#faad14',
        published: '#52c41a',
        archived: '#d9d9d9'
      }
      return statusMap[status] || '#d9d9d9'
    },
    
    getStatusText(status) {
      const statusMap = {
        draft: '草稿',
        published: '已发布',
        archived: '已归档'
      }
      return statusMap[status] || '未知'
    },
    
    showCreateModal() {
      this.isEdit = false
      this.workForm = {
        title: '',
        description: '',
        category: '',
        tags: []
      }
      this.modalVisible = true
    },
    
    editWork(work) {
      this.isEdit = true
      this.workForm = {
        id: work.id,
        title: work.title,
        description: work.description,
        category: work.category,
        tags: [...work.tags]
      }
      this.modalVisible = true
    },
    
    viewWork(work) {
      this.$message.info(`查看作品: ${work.title}`)
      // 这里可以跳转到作品详情页
    },
    
    configurePrompt(work) {
      this.$message.info(`配置提示词: ${work.title}`)
      // 这里可以跳转到提示词配置页
    },
    
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
        this.getWorksList() // 刷新列表
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        this.submitLoading = false
      }
    },
    
    handleCancel() {
      this.modalVisible = false
      this.$refs.workForm.resetFields()
    },
    
    async deleteWork(id) {
      try {
        await this.deleteWork(id)
        this.$message.success('删除作品成功')
        this.getWorksList() // 刷新列表
      } catch (error) {
        this.$message.error('删除失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.work-list {
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
