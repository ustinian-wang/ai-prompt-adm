<template>
  <div class="tinymce-editor-container">
    <div class="editor-header">
      <h3>{{ title || '富文本编辑器' }}</h3>
      <div class="editor-actions">
        <a-button type="text" size="small" @click="saveContent" :loading="saving">
          <a-icon type="save" /> 保存
        </a-button>
        <a-button type="text" size="small" @click="previewContent">
          <a-icon type="eye" /> 预览
        </a-button>
        <a-button type="text" size="small" @click="toggleFullscreen">
          <a-icon :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" />
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </a-button>
      </div>
    </div>

    <div class="editor-wrapper" :class="{ 'fullscreen': isFullscreen }">
      <editor
        v-model="editorContent"
        :init="editorInit"
        :disabled="disabled"
        @onChange="handleChange"
        @onBlur="handleBlur"
        @onFocus="handleFocus"
        @onInit="handleInit"
        @onKeyUp="handleKeyUp"
        @onPaste="handlePaste"
        @onDrop="handleDrop"
        @onSubmit="handleSubmit"
      />
    </div>

    <div class="editor-footer">
      <div class="status-info">
        <span v-if="contentChanged" class="content-changed-indicator">
          <a-icon type="edit" /> 内容已修改
        </span>
        <span class="word-count">字数: {{ wordCount }}</span>
      </div>
      <div class="help-tips">
        <a-tooltip title="支持拖拽调整图片尺寸和位置">
          <a-icon type="info-circle" />
        </a-tooltip>
        <span>拖拽图片边缘可调整尺寸，拖拽图片可移动位置</span>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <a-modal
      :visible="previewVisible"
      title="内容预览"
      @cancel="previewVisible = false"
      width="80%"
      :footer="null"
      class="preview-modal"
    >
      <div class="preview-content" v-html="editorContent"></div>
    </a-modal>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import { uploadRichTextImage } from '@/utils/imageUpload'

export default {
  name: 'TinyMCEEditor',
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    height: {
      type: [String, Number],
      default: 500
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入内容...'
    },
    uploadUrl: {
      type: String,
      default: '/api/upload/image'
    },
    uploadParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      editorContent: this.value,
      contentChanged: false,
      saving: false,
      isFullscreen: false,
      previewVisible: false,
      wordCount: 0,
      editor: null
    }
  },
  watch: {
    value(newVal) {
      if (newVal !== this.editorContent) {
        this.editorContent = newVal
        this.contentChanged = false
      }
    },
    editorContent(newVal) {
      this.$emit('input', newVal)
      this.$emit('change', newVal)
      this.updateWordCount(newVal)
    }
  },
  methods: {
    // 编辑器初始化配置
    editorInit() {
      return {
        // 基础配置
        height: this.height,
        language: 'zh_CN',
        placeholder: this.placeholder,
        menubar: false,
        branding: false,
        elementpath: false,
        statusbar: true,
        resize: true,
        
        // 工具栏配置
        toolbar: [
          'undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
          'bullist numlist outdent indent | link image media table | forecolor backcolor | removeformat | fullscreen'
        ].join(' | '),
        
        // 插件配置
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
          'image imagetools'
        ],
        
        // 图片上传配置
        images_upload_url: this.uploadUrl,
        images_upload_credentials: true,
        images_upload_handler: this.customImageUpload,
        
        // 图片工具配置
        image_advtab: true,
        image_caption: true,
        image_dimensions: true,
        image_class_list: [
          { title: '响应式图片', value: 'img-fluid' },
          { title: '圆角图片', value: 'img-rounded' },
          { title: '阴影图片', value: 'img-shadow' }
        ],
        
        // 表格配置
        table_default_styles: {
          width: '100%'
        },
        table_default_attributes: {
          border: '1'
        },
        
        // 内容样式配置
        content_style: `
          body { 
            font-family: 'Microsoft YaHei', Arial, sans-serif; 
            font-size: 14px; 
            line-height: 1.6; 
            color: #333; 
          }
          img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 4px; 
            margin: 8px 0; 
            cursor: pointer; 
          }
          img:hover { 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
          }
          .img-fluid { 
            max-width: 100%; 
            height: auto; 
          }
          .img-rounded { 
            border-radius: 8px; 
          }
          .img-shadow { 
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 16px 0; 
          }
          td, th { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background: #f5f5f5; 
            font-weight: 600; 
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
        `,
        
        // 自定义配置
        setup: (editor) => {
          this.editor = editor
          
          // 添加自定义按钮
          editor.ui.registry.addButton('customimage', {
            text: '图片',
            tooltip: '插入图片',
            onAction: () => {
              editor.execCommand('mceImage')
            }
          })
          
          // 图片上传完成后的回调
          editor.on('ObjectResized', (e) => {
            if (e.target.nodeName === 'IMG') {
              this.contentChanged = true
            }
          })
          
          // 图片拖拽完成后的回调
          editor.on('ObjectSelected', (e) => {
            if (e.target.nodeName === 'IMG') {
              // 显示图片工具栏
              editor.execCommand('mceImage')
            }
          })
        },
        
        // 文件选择器配置
        file_picker_types: 'image',
        file_picker_callback: this.filePickerCallback,
        
        // 自动保存配置
        auto_save: true,
        auto_save_interval: '30s',
        auto_save_prefix: 'tinymce-autosave-{path}{query}-{id}-',
        auto_save_retention: '1440m',
        
        // 粘贴配置
        paste_data_images: true,
        paste_as_text: false,
        paste_enable_default_filters: true,
        
        // 快捷键配置
        custom_shortcuts: {
          'ctrl+s': {
            cmd: 'mceSave',
            desc: '保存'
          }
        }
      }
    },
    
    // 自定义图片上传处理
    async customImageUpload(blobInfo, success, failure, progress) {
      try {
        const file = blobInfo.blob()
        
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          failure('只能上传图片文件')
          return
        }
        
        // 验证文件大小
        if (file.size > 5 * 1024 * 1024) {
          failure('图片大小不能超过5MB')
          return
        }
        
        // 使用现有的图片上传工具
        const imageUrl = await uploadRichTextImage(file, {
          ...this.uploadParams,
          userId: this.$store.state.user.userInfo?.id,
          workId: this.$route.params?.id
        })
        
        success(imageUrl)
        this.contentChanged = true
        this.$message.success('图片上传成功')
        
      } catch (error) {
        failure(error.message || '图片上传失败')
        this.$message.error(error.message || '图片上传失败')
      }
    },
    
    // 文件选择器回调
    filePickerCallback(callback, value, meta) {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      
      input.onchange = async (e) => {
        const file = e.target.files[0]
        if (file) {
          try {
            const imageUrl = await uploadRichTextImage(file, {
              ...this.uploadParams,
              userId: this.$store.state.user.userInfo?.id,
              workId: this.$route.params?.id
            })
            callback(imageUrl, { title: file.name })
          } catch (error) {
            this.$message.error(error.message || '图片上传失败')
          }
        }
      }
      
      input.click()
    },
    
    // 事件处理
    handleChange(e) {
      this.contentChanged = true
      this.$emit('change', e.target.getContent())
    },
    
    handleBlur(e) {
      this.$emit('blur', e)
    },
    
    handleFocus(e) {
      this.$emit('focus', e)
    },
    
    handleInit(e) {
      this.$emit('init', e)
      this.updateWordCount(this.editorContent)
    },
    
    handleKeyUp(e) {
      this.$emit('keyup', e)
    },
    
    handlePaste(e) {
      this.$emit('paste', e)
    },
    
    handleDrop(e) {
      this.$emit('drop', e)
    },
    
    handleSubmit(e) {
      this.$emit('submit', e)
    },
    
    // 保存内容
    async saveContent() {
      if (!this.editorContent.trim()) {
        this.$message.warning('内容不能为空')
        return
      }
      
      this.saving = true
      try {
        await this.$emit('save', this.editorContent)
        this.contentChanged = false
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error('保存失败')
      } finally {
        this.saving = false
      }
    },
    
    // 预览内容
    previewContent() {
      this.previewVisible = true
    },
    
    // 切换全屏
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen
      if (this.isFullscreen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    
    // 更新字数统计
    updateWordCount(content) {
      if (content) {
        const text = content.replace(/<[^>]*>/g, '')
        this.wordCount = text.length
      } else {
        this.wordCount = 0
      }
    },
    
    // 获取内容
    getContent() {
      return this.editor ? this.editor.getContent() : this.editorContent
    },
    
    // 设置内容
    setContent(content) {
      if (this.editor) {
        this.editor.setContent(content)
      } else {
        this.editorContent = content
      }
      this.contentChanged = false
    },
    
    // 清空内容
    clearContent() {
      if (this.editor) {
        this.editor.setContent('')
      } else {
        this.editorContent = ''
      }
      this.contentChanged = false
    },
    
    // 插入图片
    insertImage(url, alt = '') {
      if (this.editor) {
        this.editor.execCommand('mceInsertContent', false, `<img src="${url}" alt="${alt}" />`)
        this.contentChanged = true
      }
    },
    
    // 插入链接
    insertLink(url, text = '') {
      if (this.editor) {
        this.editor.execCommand('mceInsertLink', false, { href: url, text: text })
        this.contentChanged = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-editor-container {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: white;
  overflow: hidden;
  
  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #fafafa;
    border-bottom: 1px solid #d9d9d9;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #262626;
    }
    
    .editor-actions {
      display: flex;
      gap: 8px;
      
      .ant-btn {
        color: #666;
        border: none;
        padding: 4px 8px;
        height: 28px;
        
        &:hover {
          color: #1890ff;
          background: rgba(24, 144, 255, 0.1);
        }
      }
    }
  }
  
  .editor-wrapper {
    position: relative;
    
    &.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      background: white;
      
      .tox-tinymce {
        height: calc(100vh - 120px) !important;
      }
    }
    
    // TinyMCE 样式覆盖
    :deep(.tox-tinymce) {
      border: none !important;
      border-radius: 0 !important;
    }
    
    :deep(.tox-toolbar) {
      background: #fafafa !important;
      border-bottom: 1px solid #e8e8e8 !important;
    }
    
    :deep(.tox-toolbar__group) {
      border-right: 1px solid #e8e8e8 !important;
    }
    
    :deep(.tox-tbtn) {
      border-radius: 4px !important;
      margin: 2px !important;
      
      &:hover {
        background: rgba(24, 144, 255, 0.1) !important;
      }
    }
    
    :deep(.tox-edit-area) {
      border: none !important;
    }
    
    :deep(.tox-edit-area__iframe) {
      background: white !important;
    }
  }
  
  .editor-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: #f5f5f5;
    border-top: 1px solid #d9d9d9;
    font-size: 12px;
    color: #666;
    
    .status-info {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .content-changed-indicator {
        color: #1890ff;
        font-weight: 600;
        
        .anticon {
          margin-right: 4px;
        }
      }
      
      .word-count {
        color: #8c8c8c;
      }
    }
    
    .help-tips {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #8c8c8c;
      
      .anticon {
        color: #1890ff;
        cursor: help;
      }
    }
  }
}

// 预览弹窗样式
.preview-modal {
  .preview-content {
    max-height: 70vh;
    overflow-y: auto;
    padding: 20px;
    background: white;
    border-radius: 4px;
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      margin: 8px 0;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
      
      td, th {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      
      th {
        background: #fafafa;
        font-weight: 600;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tinymce-editor-container {
    .editor-header {
      flex-direction: column;
      gap: 8px;
      align-items: stretch;
      
      .editor-actions {
        justify-content: center;
      }
    }
    
    .editor-footer {
      flex-direction: column;
      gap: 8px;
      align-items: stretch;
      text-align: center;
    }
  }
}
</style>
