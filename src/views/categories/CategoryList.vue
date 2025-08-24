<template>
  <div class="category-list page-container fade-in">
    <PageHeader
      title="分类管理"
      description="管理系统分类，组织内容结构"
      :actions="[
        {
          key: 'create',
          text: '+ 新建',
          type: 'primary',
          icon: 'plus',
          onClick: showCreateModal
        }
      ]"
    />
    
    <div class="category-content">
      <div class="category-layout">
        <!-- 左侧分类列表 -->
        <div class="category-sidebar">
          <div class="category-title">分类设置</div>
          <div class="category-list-wrapper">
            <div 
              v-for="category in categoriesList" 
              :key="category.category_id"
              :class="['category-item', { active: selectedCategory && selectedCategory.category_id === category.category_id }]"
              @click="selectCategory(category)"
            >
              <span class="category-icon" v-if="category.icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
              <a-tag v-if="!category.enabled" color="red" size="small">禁用</a-tag>
            </div>
          </div>
        </div>

        <!-- 右侧编辑区域 -->
        <div class="category-editor">
          <div v-if="!selectedCategory" class="empty-state">
            <a-icon type="folder-open" style="font-size: 48px; color: #d9d9d9;" />
            <div class="empty-text">选择一个分类进行编辑，或创建新分类</div>
          </div>
          
          <div v-else class="editor-form">
            <div class="editor-header">
              <h3>{{ isEdit ? '编辑分类' : '新建分类' }}</h3>
            </div>
            
            <a-form-model
              ref="categoryForm"
              :model="categoryForm"
              :rules="categoryRules"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              layout="horizontal"
            >
              <a-form-model-item label="分类名称" prop="name">
                <a-input 
                  v-model="categoryForm.name" 
                  placeholder="请输入分类名称"
                />
              </a-form-model-item>

              <a-form-model-item label="分类描述" prop="description">
                <a-textarea
                  v-model="categoryForm.description"
                  :rows="3"
                  placeholder="请输入分类描述"
                />
              </a-form-model-item>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-model-item label="分类图标" prop="icon" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                    <a-input 
                      v-model="categoryForm.icon" 
                      placeholder="图标或emoji"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="排序值" prop="sort_order" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                    <a-input-number 
                      v-model="categoryForm.sort_order" 
                      style="width: 100%"
                      :min="1"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-model-item label="状态" prop="enabled" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                    <a-switch 
                      v-model="categoryForm.enabled"
                      checked-children="启用"
                      un-checked-children="禁用"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="导航显示" prop="show_in_nav" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                    <a-switch 
                      v-model="categoryForm.show_in_nav"
                      checked-children="显示"
                      un-checked-children="隐藏"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>

              <div class="form-actions">
                <a-button type="primary" @click="handleSubmit" :loading="submitLoading">
                  保存
                </a-button>
                <a-button @click="handleCancel" style="margin-left: 8px">
                  取消
                </a-button>
                <a-popconfirm
                  v-if="isEdit"
                  title="确定要删除这个分类吗？"
                  @confirm="handleDelete"
                  ok-text="确定"
                  cancel-text="取消"
                >
                  <a-button type="danger" style="margin-left: 8px">
                    删除
                  </a-button>
                </a-popconfirm>
              </div>
            </a-form-model>
          </div>
        </div>
      </div>
    </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'CategoryList',
  components: {
    PageHeader
  },
  data() {
    return {
      selectedCategory: null,
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
    ...mapGetters('categories', ['categoriesList', 'loading'])
  },
  mounted() {
    this.getCategoriesList()
  },
  methods: {
    ...mapActions('categories', ['getCategoriesList', 'createCategory', 'updateCategory', 'deleteCategory']),
    
    selectCategory(category) {
      this.selectedCategory = category
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
    },
    
    showCreateModal() {
      this.isEdit = false
      this.selectedCategory = {}
      this.categoryForm = {
        name: '',
        description: '',
        sort_order: 1,
        icon: '',
        enabled: true,
        show_in_nav: true
      }
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
        
        await this.getCategoriesList() // 刷新列表
        
        // 如果是编辑，更新选中项
        if (this.isEdit) {
          const updated = this.categoriesList.find(c => c.category_id === this.categoryForm.category_id)
          if (updated) {
            this.selectedCategory = updated
          }
        } else {
          // 新建后清空选择
          this.selectedCategory = null
        }
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error(error.message || '操作失败')
      } finally {
        this.submitLoading = false
      }
    },
    
    handleCancel() {
      this.selectedCategory = null
      this.categoryForm = {
        name: '',
        description: '',
        sort_order: 1,
        icon: '',
        enabled: true,
        show_in_nav: true
      }
    },
    
    async handleDelete() {
      try {
        await this.deleteCategory(this.selectedCategory.category_id)
        this.$message.success('删除分类成功')
        this.selectedCategory = null
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
  .category-content {
    margin-top: var(--spacing-lg);
  }
  
  .category-layout {
    display: flex;
    gap: var(--spacing-lg);
    height: calc(100vh - 180px);
    min-height: 600px;
  }
  
  .category-sidebar {
    width: 280px;
    background: var(--background-color);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-light);
    overflow: hidden;
    
    .category-title {
      padding: var(--spacing-lg);
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      background: var(--background-light);
      border-bottom: 1px solid var(--border-light);
    }
    
    .category-list-wrapper {
      padding: var(--spacing-sm);
      max-height: calc(100% - 60px);
      overflow-y: auto;
    }
    
    .category-item {
      display: flex;
      align-items: center;
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-xs);
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: all 0.3s ease;
      gap: var(--spacing-sm);
      
      &:hover {
        background: var(--primary-light);
      }
      
      &.active {
        background: var(--primary-color);
        color: white;
        
        .category-name {
          color: white;
        }
      }
      
      .category-icon {
        font-size: 16px;
        min-width: 20px;
        text-align: center;
      }
      
      .category-name {
        flex: 1;
        color: var(--text-primary);
        font-weight: 500;
      }
      
      .ant-tag {
        margin-left: auto;
      }
    }
  }
  
  .category-editor {
    flex: 1;
    background: var(--background-color);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-light);
    overflow: hidden;
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--text-tertiary);
      
      .empty-text {
        margin-top: var(--spacing-md);
        font-size: 14px;
      }
    }
    
    .editor-form {
      height: 100%;
      display: flex;
      flex-direction: column;
      
      .editor-header {
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--border-light);
        background: var(--background-light);
        
        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }
      }
      
      .ant-form-model {
        flex: 1;
        padding: var(--spacing-lg);
        overflow-y: auto;
        
        .ant-form-model-item {
          margin-bottom: var(--spacing-lg);
        }
        
        .ant-input,
        .ant-input-number {
          border-radius: var(--border-radius-sm);
        }
        
        .ant-switch {
          background: var(--border-color);
        }
      }
      
      .form-actions {
        margin-top: var(--spacing-xl);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--border-light);
        
        .ant-btn {
          border-radius: var(--border-radius-sm);
          min-width: 80px;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .category-list {
    .category-layout {
      flex-direction: column;
      height: auto;
      
      .category-sidebar {
        width: 100%;
        height: 200px;
        
        .category-list-wrapper {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          
          .category-item {
            min-width: 120px;
            margin-right: var(--spacing-sm);
            margin-bottom: 0;
          }
        }
      }
      
      .category-editor {
        min-height: 400px;
      }
    }
  }
}
</style>
