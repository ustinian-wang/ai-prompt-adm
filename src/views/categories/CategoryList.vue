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
      row-key="category_id"
    >
      <template slot="status" slot-scope="enabled">
        <a-tag :color="enabled ? 'green' : 'red'">
          {{ enabled ? '启用' : '禁用' }}
        </a-tag>
      </template>
      
      <template slot="nav" slot-scope="showInNav">
        <a-tag :color="showInNav ? 'blue' : 'orange'">
          {{ showInNav ? '显示' : '隐藏' }}
        </a-tag>
      </template>
      
      <template slot="action" slot-scope="text, record">
        <a-button type="link" @click="editCategory(record)">编辑</a-button>
        <a-button 
          type="link" 
          @click="toggleStatus(record)"
          :style="{ color: record.enabled ? '#ff4d4f' : '#52c41a' }"
        >
          {{ record.enabled ? '禁用' : '启用' }}
        </a-button>
        <a-popconfirm
          title="确定要删除这个分类吗？"
          @confirm="deleteCategory(record.category_id)"
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
        
        <a-form-model-item label="排序" prop="sort_order">
          <a-input-number
            v-model="categoryForm.sort_order"
            :min="1"
            :max="100"
            placeholder="请输入排序值"
            style="width: 100%"
          />
        </a-form-model-item>
        
        <a-form-model-item label="图标" prop="icon">
          <a-input v-model="categoryForm.icon" placeholder="请输入图标类名" />
        </a-form-model-item>
        
        <a-form-model-item label="启用状态" prop="enabled">
          <a-switch
            v-model="categoryForm.enabled"
            checked-children="启用"
            un-checked-children="禁用"
          />
        </a-form-model-item>
        
        <a-form-model-item label="导航显示" prop="show_in_nav">
          <a-switch
            v-model="categoryForm.show_in_nav"
            checked-children="显示"
            un-checked-children="隐藏"
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
        sort_order: 1,
        icon: '',
        enabled: true,
        show_in_nav: true
      },
      categoryRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入分类描述', trigger: 'blur' }
        ],
        sort_order: [
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
          dataIndex: 'sort_order',
          key: 'sort_order',
          width: 80
        },
        {
          title: '状态',
          dataIndex: 'enabled',
          key: 'enabled',
          width: 80,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '导航显示',
          dataIndex: 'show_in_nav',
          key: 'show_in_nav',
          width: 100,
          scopedSlots: { customRender: 'nav' }
        },
        {
          title: '创建时间',
          dataIndex: 'category_created_at',
          key: 'category_created_at',
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
    ...mapActions('categories', ['getCategoriesList', 'createCategory', 'updateCategory', 'deleteCategory', 'toggleCategoryStatus']),
    
    showCreateModal() {
      this.isEdit = false
      this.categoryForm = {
        name: '',
        description: '',
        sort_order: 1,
        icon: '',
        enabled: true,
        show_in_nav: true
      }
      this.modalVisible = true
    },
    
    editCategory(category) {
      this.isEdit = true
      this.categoryForm = {
        category_id: category.category_id,
        name: category.name,
        description: category.description,
        sort_order: category.sort_order,
        icon: category.icon || '',
        enabled: category.enabled,
        show_in_nav: category.show_in_nav
      }
      this.modalVisible = true
    },
    
    async handleSubmit() {
      try {
        await this.$refs.categoryForm.validate()
        this.submitLoading = true
        
        if (this.isEdit) {
          await this.updateCategory({
            categoryId: this.categoryForm.category_id,
            updateData: this.categoryForm
          })
          this.$message.success('更新分类成功')
        } else {
          await this.createCategory(this.categoryForm)
          this.$message.success('创建分类成功')
        }
        
        this.modalVisible = false
        this.getCategoriesList() // 刷新列表
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error(error.message || '操作失败')
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
    },
    
    async toggleStatus(category) {
      try {
        const newStatus = !category.enabled
        await this.toggleCategoryStatus({
          categoryId: category.category_id,
          enabled: newStatus
        })
        this.$message.success(newStatus ? '分类已启用' : '分类已禁用')
        this.getCategoriesList() // 刷新列表
      } catch (error) {
        this.$message.error('状态切换失败')
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
