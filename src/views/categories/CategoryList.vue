<template>
  <div class="category-list page-container fade-in">
    <PageHeader
      title="分类管理"
      description="管理系统分类，组织内容结构"
      :actions="[
        {
          key: 'create',
          text: '新建分类',
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
              <a-form-item label="分类名称">
                <a-input
                  v-decorator="['name']"
                  placeholder="请输入分类名称"
                  allow-clear
                  
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="状态">
                <a-select
                  v-decorator="['enabled']"
                  placeholder="请选择状态"
                  allow-clear
                  
                >
                  <a-select-option value="true">启用</a-select-option>
                  <a-select-option value="false">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="导航显示">
                <a-select
                  v-decorator="['showInNav']"
                  placeholder="请选择显示状态"
                  allow-clear
                  
                >
                  <a-select-option value="true">显示</a-select-option>
                  <a-select-option value="false">隐藏</a-select-option>
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
      
      <!-- 分类表格 -->
      <a-card :bordered="false" class="table-card">
        <a-table
          :columns="columns"
          :data-source="categoriesList"
          :loading="loading"
          row-key="category_id"
          class="data-table"
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
            <div class="action-buttons">
              <a-button type="link" @click="editCategory(record)" class="action-btn">
                <a-icon type="edit" />
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除这个分类吗？"
                @confirm="deleteCategory(record.category_id)"
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

    <!-- 新建/编辑分类弹窗 -->
    <a-modal
      :title="isEdit ? '编辑分类' : '新建分类'"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
      :width="600"
      class="category-modal"
    >
      <a-form-model
        ref="categoryForm"
        :model="categoryForm"
        :rules="categoryRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        layout="horizontal"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="分类名称" prop="name">
              <a-input 
                v-model="categoryForm.name" 
                placeholder="请输入分类名称"
                
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="排序值" prop="sort_order">
              <a-input-number 
                v-model="categoryForm.sort_order" 
                placeholder="请输入排序值"
                
                style="width: 100%"
                :min="1"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        
        <a-form-model-item label="分类描述" prop="description">
          <a-textarea
            v-model="categoryForm.description"
            :rows="3"
            placeholder="请输入分类描述"
            
          />
        </a-form-model-item>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="分类图标" prop="icon">
              <a-input 
                v-model="categoryForm.icon" 
                placeholder="请输入图标名称或emoji"
                
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="状态" prop="enabled">
              <a-switch 
                v-model="categoryForm.enabled"
                checked-children="启用"
                un-checked-children="禁用"
                
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        
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
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'CategoryList',
  components: {
    PageHeader
  },
  data() {
    return {
      modalVisible: false,
      isEdit: false,
      submitLoading: false,
      searchForm: null,
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
          title: '图标',
          dataIndex: 'icon',
          key: 'icon',
          width: 80,
          customRender: (text) => text || '-'
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
          width: 100,
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
  // 使用统一的布局样式，无需重复定义
}
</style>
