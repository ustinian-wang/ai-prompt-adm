<template>
  <div class="category-list">
    <div class="page-header">
      <h2>分类管理</h2>
      <a-button type="primary" @click="showCreateModal">
        <a-icon type="plus" />
        新建分类
      </a-button>
    </div>
    
    <a-table
      :columns="columns"
      :data-source="categoriesList"
      :loading="loading"
      row-key="id"
    >
      <template slot="count" slot-scope="count">
        <a-tag color="blue">{{ count }}</a-tag>
      </template>
      
      <template slot="action" slot-scope="text, record">
        <a-button type="link" @click="editCategory(record)">编辑</a-button>
        <a-popconfirm
          title="确定要删除这个分类吗？"
          @confirm="deleteCategory(record.id)"
        >
          <a-button type="link" style="color: #ff4d4f">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>

    <!-- 新建/编辑分类弹窗 -->
    <a-modal
      :title="isEdit ? '编辑分类' : '新建分类'"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
    >
      <a-form-model
        ref="categoryForm"
        :model="categoryForm"
        :rules="categoryRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="分类名称" prop="name">
          <a-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </a-form-model-item>
        
        <a-form-model-item label="分类描述" prop="description">
          <a-textarea
            v-model="categoryForm.description"
            :rows="4"
            placeholder="请输入分类描述"
          />
        </a-form-model-item>
        
        <a-form-model-item label="排序" prop="sortOrder">
          <a-input-number
            v-model="categoryForm.sortOrder"
            :min="1"
            :max="100"
            placeholder="请输入排序值"
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
  name: 'CategoryList',
  data() {
    return {
      modalVisible: false,
      isEdit: false,
      submitLoading: false,
      categoryForm: {
        name: '',
        description: '',
        sortOrder: 1
      },
      categoryRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入分类描述', trigger: 'blur' }
        ],
        sortOrder: [
          { required: true, message: '请输入排序值', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('categories', ['categoriesList', 'loading']),
    columns() {
      return [
        {
          title: '分类名称',
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
          title: '排序',
          dataIndex: 'sortOrder',
          key: 'sortOrder',
          width: 80
        },
        {
          title: '作品数量',
          dataIndex: 'count',
          key: 'count',
          width: 100,
          scopedSlots: { customRender: 'count' }
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
    this.getCategoriesList()
  },
  methods: {
    ...mapActions('categories', ['getCategoriesList', 'createCategory', 'updateCategory', 'deleteCategory']),
    
    showCreateModal() {
      this.isEdit = false
      this.categoryForm = {
        name: '',
        description: '',
        sortOrder: 1
      }
      this.modalVisible = true
    },
    
    editCategory(category) {
      this.isEdit = true
      this.categoryForm = {
        id: category.id,
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder
      }
      this.modalVisible = true
    },
    
    async handleSubmit() {
      try {
        await this.$refs.categoryForm.validate()
        this.submitLoading = true
        
        if (this.isEdit) {
          await this.updateCategory(this.categoryForm)
          this.$message.success('更新分类成功')
        } else {
          await this.createCategory(this.categoryForm)
          this.$message.success('创建分类成功')
        }
        
        this.modalVisible = false
        this.getCategoriesList() // 刷新列表
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        this.submitLoading = false
      }
    },
    
    handleCancel() {
      this.modalVisible = false
      this.$refs.categoryForm.resetFields()
    },
    
    async deleteCategory(id) {
      try {
        await this.deleteCategory(id)
        this.$message.success('删除分类成功')
        this.getCategoriesList() // 刷新列表
      } catch (error) {
        this.$message.error('删除失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.category-list {
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
