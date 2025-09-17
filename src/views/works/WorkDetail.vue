<template>
  <div class="work-prompt">
    <!-- 面包屑导航 -->

    <div class="breadcrumb-section">    
      <BackButton text="返回作品列表" to="/works/list" />
    </div>

    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>作品管理</h1>
        <p>为作品 "{{ workTitle }}" 配置AI提示词参数</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <a-card :bordered="false" class="form-card">
        <!-- 标签页 -->
        <a-tabs v-model="activeTab" type="card" class="main-tabs">
          <a-tab-pane key="prompt" tab="提示词配置">
            <a-form :form="form" layout="vertical" class="prompt-form">
              <!-- 参考图上传区域 -->
              <a-form-item label="参考图:" class="reference-images">
                <ImgUpload
                  v-model="work_form_info.work_img_path"
                  :accept-types="'image/jpeg,image/jpg,image/png,image/gif,image/webp'"
                  @change-file-id="onCoverFileIdChange"
                />
                <div class="upload-tip">支持 JPG、PNG、GIF、WebP 格式，单张图片最大 2MB</div>
              </a-form-item>

              <!-- 作品名称 -->
              <a-form-item label="作品名称:" class="work-name-item">
                <a-input
                  v-model="work_form_info.work_name"
                  placeholder="请输入作品名称"
                  
                  class="work-name-input"
                >
                  <a-icon slot="prefix" type="edit" />
                </a-input>
              </a-form-item>

              <!-- 标签 -->
              <a-form-item label="标签:" class="tags-item">
                <a-select
                  v-model="work_form_info.work_category_list"
                  mode="multiple"
                  placeholder="请选择标签"
                  
                  class="tags-select"
                  :loading="categoriesLoading"
                  :filter-option="filterOption"
                  show-search
                  allow-clear
                  :not-found-content="categoriesLoading ? '加载中...' : '没有找到匹配的分类'"
                >
                  <a-icon slot="prefix" type="tags" />
                  <a-select-option 
                    v-for="category in categoriesList" 
                    :key="category.category_id" 
                    :value="category.category_id"
                  >
                    <div class="category-option">
                      <a-icon :type="category.icon || 'tag'" class="category-icon" />
                      <span class="category-name">{{ category.name }}</span>
                      <span v-if="category.description" class="category-description">
                        {{ category.description }}
                      </span>
                      <a-tag v-if="category.show_in_nav" size="small" color="blue" class="nav-tag">
                        导航
                      </a-tag>
                    </div>
                  </a-select-option>
                </a-select>
                <div class="tags-tip">
                  支持多选，可搜索。已选择 {{ work_form_info.work_category_list ? work_form_info.work_category_list.length : 0 }} 个标签
                  <span v-if="selectedCategoryNames.length > 0" class="selected-categories">
                    ：{{ selectedCategoryNames.join('、') }}
                  </span>
                  <a @click="showAddCategoryModal" class="add-category-link">
                    <a-icon type="plus" /> 添加新分类
                  </a>
                </div>
              </a-form-item>

              <!-- 中文提示词 -->
              <a-form-item label="中文提示词:" class="prompt-item">
                <a-textarea
                  v-model="work_form_info.work_prompt_cn"
                  :rows="6"
                  placeholder="请输入提示词"
                  
                  class="prompt-textarea"
                />
                <div class="prompt-tip">详细描述您想要的设计效果和风格</div>
              </a-form-item>

              <!-- 英文提示词 -->
              <a-form-item label="英文提示词:" class="prompt-item">
                <a-textarea
                  v-model="work_form_info.work_prompt_en"
                  :rows="6"
                  placeholder="请输入提示词"
                  
                  class="prompt-textarea"
                />
                <div class="prompt-tip">English prompt for better AI understanding</div>
              </a-form-item>

              <!-- 外链配置 -->
              <a-form-item label="外链:" class="external-links-item">
                <div class="external-links-container">
                  <div 
                    v-for="(link, index) in work_form_info.work_outer_link_list" 
                    :key="index"
                    class="link-row"
                  >
                    <a-button 
                      type="primary" 
                      size="small" 
                      class="copy-open-btn"
                      @click="copyAndOpenLink(link)"
                    >
                      <a-icon type="copy" />
                      复制并打开
                    </a-button>
                    
                    <a-input
                      v-model="link.name"
                      placeholder="请输入外链名称"
                      
                      class="link-name-input"
                    />
                    
                    <a-input
                      v-model="link.url"
                      placeholder="请输入URL"
                      
                      class="link-url-input"
                    />
                    
                    <div class="link-actions">
                      <a v-if="index === work_form_info.work_outer_link_list.length - 1" 
                         @click="addExternalLink" 
                         class="add-link">
                        添加
                      </a>
                      <a v-else 
                         @click="removeExternalLink(index)" 
                         class="remove-link">
                        删除
                      </a>
                    </div>
                  </div>
                </div>
              </a-form-item>

              <!-- 表单操作按钮 -->
              <div class="form-actions">
                <a-button type="primary" @click="handleSubmit" :loading="loading" >
                  <a-icon type="save" />
                  保存配置
                </a-button>
                <a-button style="margin-left: 8px" @click="goBack" >
                  <a-icon type="arrow-left" />
                  取消
                </a-button>
              </div>
            </a-form>
          </a-tab-pane>

          <a-tab-pane key="tutorial" tab="教程描述">
            <div class="tutorial-editor-container">
                               <!-- Quill.js 富文本编辑器 -->
                <QuillEditor
                  v-model="work_form_info.work_guide_desc"
                  :height="500"
                  title="教程编辑器"
                  :upload-params="{
                    userId: work_form_info.user_id,
                    workId: work_form_info.work_id
                  }"
                  @change="handleEditorChange"
                  @save="handleUESubmit"
                />
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>

    <!-- 右侧导航箭头 -->
    <div class="right-nav-arrow">
      <a-icon type="right" />
    </div>

    <!-- 右下角帮助按钮 -->
    <div class="help-button">
      <a-icon type="question-circle" />
    </div>
    
    <!-- 添加分类模态框 -->
    <a-modal
      v-model="addCategoryModalVisible"
      title="添加新分类"
      @ok="handleAddCategory"
      @cancel="addCategoryModalVisible = false"
      :confirm-loading="addCategoryLoading"
    >
      <a-form :form="categoryForm" layout="vertical">
        <a-form-item label="分类名称" required>
          <a-input
            v-decorator="[
              'name',
              { 
                rules: [{ required: true, message: '请输入分类名称' }],
                initialValue: ''
              }
            ]"
            placeholder="请输入分类名称"
          />
        </a-form-item>
        <a-form-item label="分类描述">
          <a-textarea
            v-decorator="[
              'description',
              { initialValue: '' }
            ]"
            placeholder="请输入分类描述（可选）"
            :rows="3"
          />
        </a-form-item>
        <a-form-item label="图标">
          <a-input
            v-decorator="[
              'icon',
              { initialValue: 'tag' }
            ]"
            placeholder="请输入图标名称（可选）"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue'
import ImgUpload from '@/components/ImgUpload.vue'
import QuillEditor from '@/components/QuillEditor.vue'
import { getWorkDetailApi, upsertWorkApi } from '@/api/worksApi'
import { mapGetters } from 'vuex'

let default_work_form_info = {
  work_img_id: '',
  work_img_path: '',
  work_name: '',
  work_category_list: [],
  work_prompt_cn: '',
  work_prompt_en: '',
  work_outer_link_list: [{ name: '', url: '' }],
  work_guide_desc: ''
};
export default {
  name: 'WorkDetail',
  components: {
    BackButton,
     ImgUpload,
     QuillEditor
  },
  data() {
    return {
      loading: false,
      activeTab: 'prompt',
      workTitle: '示例作品',
      work_form_info: {
        ...default_work_form_info,
      },
      // 编辑器内容变化检测
      editorContentChanged: false,
      // 分类相关
      categoriesLoading: false,
      // enabledCategories: [],
      addCategoryModalVisible: false,
      addCategoryLoading: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.categoryForm = this.$form.createForm(this)
  },
  mounted() {
    // 获取路由参数中的作品ID
    const workId = this.$route.params.id
    console.log('WorkDetail mounted, workId:', workId);
    
    // 确保组件数据正确初始化
    this.$nextTick(async () => {
      // 先获取分类列表，再加载作品数据
      await this.getCategoriesList()
      this.loadWorkData(workId)
    })
  },
  watch: {
    // 监听路由参数变化，当ID变化时重新加载数据
    '$route.params.id': {
      handler(newId, oldId) {
        if (newId !== oldId) {
          console.log('路由ID变化，重新加载数据:', newId);
          this.loadWorkData(newId);
        }
      },
      immediate: true
    },
    
    async activeTab(newVal) {
      if(newVal === 'tutorial'){
        await this.$nextTick();
        // await this.refreshEditor();
      }
    },
    // 监听编辑器内容变化
    'work_form_info.work_guide_desc': {
      handler(newValue, oldValue) {
        if (newValue !== oldValue && oldValue !== undefined) {
          this.editorContentChanged = true
        }
      },
      deep: true
    },
    
    // 监听分类选择变化
    'work_form_info.work_category_list': {
      handler(newValue, oldValue) {
        if (newValue !== oldValue && oldValue !== undefined) {
          console.log('分类选择已更新:', newValue)
        }
      },
      deep: true
    }
  },
  computed: {
    categoryOptions() {
      return this.categoriesList.map(category => {
        console.log('[jser category]', category)
        return {
          label: category.name,
          value: category.category_id
        }
      })
    },
    ...mapGetters('categories', ['categoriesList', 'loading']),
    // 移除 curr_work_img_path 计算属性，直接使用 work_form_info.work_img_path
    // 获取所有启用的分类
    enabledCategories() {
      return this.categoriesList
        .filter(category => category.enabled === true || category.enabled === 1)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    },
    
    // 获取已选择的分类名称
    selectedCategoryNames() {
      if (!this.work_form_info.work_category_list || !Array.isArray(this.work_form_info.work_category_list)) {
        return []
      }
      return this.work_form_info.work_category_list
        .map(categoryId => {
          const category = this.enabledCategories.find(c => c.category_id === categoryId)
          return category ? category.name : null
        })
        .filter(name => name !== null)
    }
  },
  methods: {
    onCoverFileIdChange(fileId){
      this.work_form_info.work_img_file_id = fileId
    },
    // 将对象键转换为可访问的URL（兼容历史与后端返回对象键场景）
    buildOssUrl(key) {
      if (!key) return ''
      // 已是完整URL或已是以 /api/ossFile/object 开头的相对URL，直接返回
      if (typeof key === 'string' && (key.startsWith('http://') || key.startsWith('https://') || key.startsWith('/api/ossFile/object/'))) {
        return key
      }
      // 将对象键转换为可访问路径（支持包含斜杠的键）
      try {
        return `/api/ossFile/object/${encodeURIComponent(key)}`
      } catch (e) {
        return `/api/ossFile/object/${key}`
      }
    },
    // 获取分类列表
    async getCategoriesList() {
      this.categoriesLoading = true
      try {
        await this.$store.dispatch('categories/getCategoriesList', { limit: 100 })
      } catch (error) {
        console.error('获取分类列表失败:', error)
        this.$message.error('获取分类列表失败')
      } finally {
        this.categoriesLoading = false
      }
    },

    // 搜索过滤选项
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    // 显示添加分类模态框
    showAddCategoryModal() {
      this.addCategoryModalVisible = true
      this.categoryForm.resetFields()
    },

    // 处理添加分类
    async handleAddCategory() {
      try {
        const values = await new Promise((resolve, reject) => {
          this.categoryForm.validateFields((err, values) => {
            if (err) reject(err)
            else resolve(values)
          })
        })

        this.addCategoryLoading = true
        
        // 调用API创建分类
        const response = await this.$store.dispatch('categories/createCategory', {
          name: values.name,
          description: values.description,
          icon: values.icon,
          enabled: true,
          show_in_nav: false,
          sort_order: 0
        })

        if (response.data && response.data.success) {
          this.$message.success('分类创建成功')
          this.addCategoryModalVisible = false
          // 刷新分类列表
          await this.getCategoriesList()
          // 自动选择新创建的分类
          if (response.data.data && response.data.data.category_id) {
            this.work_form_info.work_category_list.push(response.data.data.category_id)
          }
        } else {
          this.$message.error(response.data?.msg || '创建分类失败')
        }
      } catch (error) {
        if (error.errorFields) {
          // 表单验证错误
          return
        }
        console.error('创建分类失败:', error)
        this.$message.error('创建分类失败')
      } finally {
        this.addCategoryLoading = false
      }
    },

    handleEditorChange(html) {
      this.work_form_info.work_guide_desc = html
      this.editorContentChanged = true
    },

    async handleUESubmit() {
      // 保存当前编辑器内容到数据模型
      this.handleSubmit();
    },
    async loadWorkData(workId) {
      let user_id = this.$store.state.user.userInfo.id;
      let work_form_info = {
        user_id,
        work_id: workId,
        ...default_work_form_info,
      };
      if(workId){
        let res = await getWorkDetailApi(workId);
        console.log('[jser res]', res);
        if(res.data.success){
          work_form_info = res.data.data;
          
          // 后端已经处理了JSON到数组的转换，这里只需要确保有默认值
          if (!(work_form_info.work_outer_link_list instanceof Array) || work_form_info.work_outer_link_list.length === 0) {
            work_form_info.work_outer_link_list = [{ name: '', url: '' }];
          }
          
          // 确保work_category_list是数组
          if (!(work_form_info.work_category_list instanceof Array)) {
            work_form_info.work_category_list = [];
          }
          
          // 规范化作品封面路径：如果拿到的是对象键则转成URL
          if (work_form_info.work_img_path) {
            work_form_info.work_img_path = this.buildOssUrl(work_form_info.work_img_path)
          }

          console.log('[jser work_form_info.work_guide_desc]', work_form_info.work_guide_desc);
          // 教程内容会自动通过 v-model 加载到编辑器
        }else{
          this.$message.error(res.data.msg)
        }
      }

      this.work_form_info = work_form_info;
      
      // 重置编辑器内容变化标志
      this.editorContentChanged = false;
    },
    
    addExternalLink() {
      this.work_form_info.work_outer_link_list.push({ name: '', url: '' })
    },
    
    removeExternalLink(index) {
      this.work_form_info.work_outer_link_list.splice(index, 1)
    },
    
    copyAndOpenLink(link) {
      if (link.url) {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(link.url).then(() => {
          this.$message.success('链接已复制到剪贴板')
        })
        
        // 在新窗口打开链接
        window.open(link.url, '_blank')
      } else {
        this.$message.warning('请先输入URL')
      }
    },
    
    async handleSubmit() {
       this.$message.loading('保存中...', 0);
       try {
         if(!this.work_form_info.work_name){
           this.$message.error('作品名称不能为空')
           return
         }

         // 编辑器内容已通过 v-model 自动同步到数据模型
         
         // 检查是否有编辑器内容变化
         if (this.editorContentChanged) {
           console.log('编辑器内容已更新，准备保存...')
           this.$message.info('检测到编辑器内容变化，将一并保存')
         }

         // 后端会自动处理数组到JSON的转换和数据验证
         const submitData = {
           ...this.work_form_info,
           work_guide_desc: this.work_form_info.work_guide_desc
         };
         
         console.log('提交的数据:', submitData);
        
        let res = await upsertWorkApi(submitData);
        this.$message.destroy()
        if(res.data.success){
           const categoryCount = this.work_form_info.work_category_list ? this.work_form_info.work_category_list.length : 0
           let successMessage = '保存成功'
           if (categoryCount > 0) {
             const categoryNames = this.selectedCategoryNames.join('、')
             successMessage += `，已选择 ${categoryCount} 个标签：${categoryNames}`
           }
           this.$message.success(successMessage)
           // 重置编辑器内容变化标志
           this.editorContentChanged = false
          //  this.$router.back()
         }else{
           this.$message.error(res.data.msg)
         }
       } catch (error) {
         console.warn('[jser handleSubmit] error', error)
         this.$message.error('保存失败，请检查输入信息!')
       }
     },
    
    handlePreview() {
      // 预览功能
      this.$message.info('预览功能开发中...')
    },
    
    async handleReset() {
      await this.loadWorkData(this.$route.params.id)
       this.editorContentChanged = false
    },
    
    goBack() {
      this.$router.go(-1)
    },

     // TinyMCE 编辑器已自动处理所有富文本编辑功能
  }
}
</script>

<style lang="scss" scoped>
.work-prompt {
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
  
  .breadcrumb-section {
    padding: 16px 24px 0;
    background: white;
    
    .ant-breadcrumb {
      font-size: 14px;
    }
  }
  
  .page-header {
    background: white;
    padding: 0 24px 24px;
    border-bottom: 1px solid #f0f0f0;
    
    .header-content {
      margin-bottom: 24px;
      
      h1 {
        font-size: 24px;
        font-weight: 600;
        color: #262626;
        margin: 0 0 8px 0;
      }
      
      p {
        color: #8c8c8c;
        margin: 0;
        font-size: 14px;
      }
    }
    
    .header-tabs {
      .ant-tabs-card {
        .ant-tabs-tab {
          border-radius: 6px 6px 0 0;
          border: 1px solid #d9d9d9;
          margin-right: 8px;
          
          &.ant-tabs-tab-active {
            border-color: #1890ff;
            background: #1890ff;
            color: white;
          }
        }
      }
    }
  }
  
  .content-wrapper {
    padding: 24px;
    
    .form-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      
      .main-tabs {
        .ant-tabs-content {
          padding: 24px 0;
        }
      }
      
      .prompt-form {
        .reference-images {
          .image-upload-area {
            display: flex;
            gap: 16px;
            margin-bottom: 8px;
            
            .image-upload-item {
              .image-uploader {
                .ant-upload {
                  width: 120px;
                  height: 120px;
                  border: 2px dashed #d9d9d9;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  transition: all 0.3s;
                  
                  &:hover {
                    border-color: #1890ff;
                  }
                  
                  .image-preview {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    
                    img {
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 6px;
                    }
                    
                    .image-remove {
                      position: absolute;
                      top: -8px;
                      right: -8px;
                      width: 20px;
                      height: 20px;
                      background: rgba(0, 0, 0, 0.6);
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      cursor: pointer;
                      color: white;
                      
                      &:hover {
                        background: rgba(0, 0, 0, 0.8);
                      }
                    }
                  }
                  
                  .upload-placeholder {
                    text-align: center;
                    color: #8c8c8c;
                    
                    .anticon {
                      font-size: 32px;
                      margin-bottom: 8px;
                    }
                    
                    .upload-text {
                      font-size: 12px;
                    }
                  }
                }
              }
            }
          }
          
          .upload-tip {
            color: #8c8c8c;
            font-size: 12px;
          }
        }
        
        .work-name-item, .tags-item, .prompt-item {
          .work-name-input, .tags-select, .prompt-textarea {
            border-radius: 6px;
            border-color: #d9d9d9;
            
            &:hover {
              border-color: #40a9ff;
            }
            
            &:focus {
              border-color: #1890ff;
              box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            }
          }
          
          .tags-tip, .prompt-tip {
            color: #8c8c8c;
            font-size: 12px;
            margin-top: 4px;
            
            .selected-categories {
              color: #1890ff;
              font-weight: 500;
            }
            
            .add-category-link {
              margin-left: 16px;
              color: #52c41a;
              font-size: 12px;
              
              &:hover {
                color: #73d13d;
              }
              
              .anticon {
                margin-right: 4px;
              }
            }
          }
          
          // 分类选项样式
          .category-option {
            display: flex;
            align-items: center;
            padding: 4px 0;
            
            .category-icon {
              margin-right: 8px;
              color: #1890ff;
              font-size: 14px;
            }
            
            .category-name {
              font-weight: 500;
              color: #262626;
              margin-right: 8px;
            }
            
            .category-description {
              color: #8c8c8c;
              font-size: 12px;
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            .nav-tag {
              margin-left: 8px;
              flex-shrink: 0;
            }
          }
          
          .tags-select {
            .ant-select-selection {
              border-radius: 6px;
              min-height: 40px;
              
              .ant-select-selection__choice {
                background: #f0f8ff;
                border-color: #1890ff;
                color: #1890ff;
                border-radius: 4px;
                margin: 2px 4px 2px 0;
                
                .ant-select-selection__choice__remove {
                  color: #1890ff;
                  
                  &:hover {
                    color: #40a9ff;
                  }
                }
              }
            }
            
            &.ant-select-focused .ant-select-selection {
              border-color: #1890ff;
              box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            }
          }
        }
        
        .external-links-item {
          .external-links-container {
            .link-row {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 16px;
              padding: 16px;
              background: #fafafa;
              border-radius: 6px;
              
              .copy-open-btn {
                flex-shrink: 0;
                border-radius: 6px;
              }
              
              .link-name-input, .link-url-input {
                flex: 1;
                border-radius: 6px;
              }
              
              .link-actions {
                flex-shrink: 0;
                
                .add-link {
                  color: #1890ff;
                  cursor: pointer;
                  
                  &:hover {
                    color: #40a9ff;
                  }
                }
                
                .remove-link {
                  color: #ff4d4f;
                  cursor: pointer;
                  
                  &:hover {
                    color: #ff7875;
                  }
                }
              }
            }
          }
        }
        
        .form-actions {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f0f0f0;
          
          .ant-btn {
            border-radius: 6px;
            height: 40px;
            padding: 0 24px;
            
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
      }
      
      // 富文本编辑器样式
      .tutorial-editor-container {
        .editor-toolbar {
          border: 1px solid #d9d9d9;
          border-radius: 6px 6px 0 0;
          background: #fafafa;
          padding: 8px;
          
          .toolbar-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .ant-btn-group {
              .ant-btn {
                border-radius: 4px;
                height: 28px;
                padding: 0 8px;
                
                &:hover {
                  border-color: #1890ff;
                  color: #1890ff;
                }
              }
            }
            
            .ant-divider-vertical {
              height: 20px;
              margin: 0 4px;
            }
            
            .ant-select {
              .ant-select-selector {
                border-radius: 4px;
                height: 28px;
              }
            }
            
            .toolbar-logo {
              margin-left: auto;
              
              .logo-placeholder {
                width: 40px;
                height: 28px;
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                border-radius: 4px;
                opacity: 0.8;
              }
            }
          }
        }
        
        .editor-content {
          min-height: 400px;
          border: 1px solid #d9d9d9;
          border-top: none;
          border-radius: 0 0 6px 6px;
          padding: 16px;
          background: white;
          outline: none;
          font-family: 'Arial', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          
          &:focus {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
          
          // 编辑器内容样式
          h1, h2, h3, h4, h5, h6 {
            margin: 16px 0 8px 0;
            font-weight: 600;
          }
          
          p {
            margin: 8px 0;
          }
          
          blockquote {
            margin: 16px 0;
            padding: 8px 16px;
            border-left: 4px solid #1890ff;
            background: #f0f8ff;
            color: #666;
          }
          
          pre {
            margin: 16px 0;
            padding: 12px;
            background: #f5f5f5;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
          }
          
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
            
            td, th {
              border: 1px solid #d9d9d9;
              padding: 8px;
              text-align: left;
            }
            
            th {
              background: #fafafa;
              font-weight: 600;
            }
          }
          
          ul, ol {
            margin: 8px 0;
            padding-left: 24px;
          }
          
          img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 8px 0;
          }
          
          a {
            color: #1890ff;
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
        
                 .editor-status-bar {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 8px 16px;
           background: #f5f5f5;
           border: 1px solid #d9d9d9;
           border-top: none;
           border-radius: 0 0 6px 6px;
           font-size: 12px;
           color: #666;
           
           .status-info {
             font-weight: 500;
             
             .content-changed-indicator {
               margin-left: 8px;
               color: #1890ff;
               font-weight: 600;
               
               .anticon {
                 margin-right: 4px;
               }
             }
           }
           
           .status-actions {
             .ant-btn {
               color: #666;
               border: none;
               padding: 0 8px;
               height: 24px;
               
               &:hover {
                 color: #1890ff;
                 background: rgba(24, 144, 255, 0.1);
               }
             }
           }
         }
      }
    }
  }
  
  .bottom-status-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    background: #404040;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    z-index: 1000;
    
    .status-info {
      .progress {
        font-size: 14px;
        color: #d9d9d9;
      }
    }
    
    .status-actions {
      .status-btn {
        color: #d9d9d9;
        margin-left: 8px;
        
        &:hover {
          color: white;
        }
      }
    }
  }
  
  .right-nav-arrow {
    position: fixed;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666;
    z-index: 1000;
    
    &:hover {
      background: rgba(0, 0, 0, 0.2);
      color: #333;
    }
  }
  
  .help-button {
    position: fixed;
    right: 16px;
    bottom: 64px;
    width: 40px;
    height: 40px;
    background: #1890ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
    
    &:hover {
      background: #40a9ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .work-prompt {
    .content-wrapper {
      padding: 16px;
      
      .form-card {
        .prompt-form {
          .reference-images {
            .image-upload-area {
              flex-direction: column;
              
              .image-upload-item {
                .image-uploader {
                  .ant-upload {
                    width: 100%;
                    height: 120px;
                  }
                }
              }
            }
          }
          
          .external-links-item {
            .external-links-container {
              .link-row {
                flex-direction: column;
                align-items: stretch;
                
                .copy-open-btn {
                  align-self: flex-start;
                }
                
                .link-actions {
                  align-self: flex-end;
                }
              }
            }
          }
        }
      }
    }
    
    .right-nav-arrow {
      display: none;
    }
  }
}
</style>
