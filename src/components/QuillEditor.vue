<template>
  <div class="quill-editor-container">
    <!-- 编辑器工具栏 -->
    <div class="editor-toolbar">
      <a-button-group>
        <a-button size="small" @click="execCommand('bold')" title="粗体">
          <a-icon type="bold" />
        </a-button>
        <a-button size="small" @click="execCommand('italic')" title="斜体">
          <a-icon type="italic" />
        </a-button>
        <a-button size="small" @click="execCommand('underline')" title="下划线">
          <a-icon type="underline" />
        </a-button>
        <a-button size="small" @click="execCommand('strikethrough')" title="删除线">
          <a-icon type="strikethrough" />
        </a-button>
      </a-button-group>

      <a-divider type="vertical" />

      <a-button-group>
        <a-button size="small" @click="execCommand('justifyLeft')" title="左对齐">
          <a-icon type="align-left" />
        </a-button>
        <a-button size="small" @click="execCommand('justifyCenter')" title="居中对齐">
          <a-icon type="align-center" />
        </a-button>
        <a-button size="small" @click="execCommand('justifyRight')" title="右对齐">
          <a-icon type="align-right" />
        </a-button>
      </a-button-group>

      <a-divider type="vertical" />

      <a-button size="small" @click="execCommand('insertUnorderedList')" title="无序列表">
        <a-icon type="unordered-list" />
      </a-button>
      <a-button size="small" @click="execCommand('insertOrderedList')" title="有序列表">
        <a-icon type="ordered-list" />
      </a-button>

      <a-divider type="vertical" />

      <a-button size="small" @click="insertImage" title="插入图片">
        <a-icon type="picture" />
      </a-button>

      <a-divider type="vertical" />

      <a-button size="small" @click="execCommand('undo')" title="撤销">
        <a-icon type="undo" />
      </a-button>
      <a-button size="small" @click="execCommand('redo')" title="重做">
        <a-icon type="redo" />
      </a-button>
    </div>

    <!-- Quill 编辑器容器 -->
    <div ref="editor" class="quill-editor"></div>

    <!-- 底部状态栏 -->
    <div class="editor-status-bar">
      <span class="status-info">
        <a-button type="text" size="small" @click="handleSave">
          <a-icon type="save" />
          保存
        </a-button>
        <span v-if="contentChanged" class="content-changed-indicator">
          <a-icon type="edit" /> 内容已修改
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { uploadRichTextImage } from '@/utils/imageUpload'

export default {
  name: 'QuillEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 400
    },
    title: {
      type: String,
      default: '编辑器'
    },
    uploadParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      editor: null,
      contentChanged: false
    }
  },
  mounted() {
    this.initEditor()
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.off('text-change')
    }
  },
  methods: {
    initEditor() {
      // 配置 Quill 编辑器
      const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video']
      ]

      // 创建编辑器实例
      this.editor = new Quill(this.$refs.editor, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
          clipboard: {
            matchVisual: false
          }
        },
        placeholder: '请输入内容...'
      })

      // 设置编辑器高度
      this.$refs.editor.style.height = `${this.height}px`

      // 监听内容变化
      this.editor.on('text-change', () => {
        const html = this.editor.root.innerHTML
        this.$emit('change', html)
        this.contentChanged = true
      })

      // 设置初始内容
      if (this.value) {
        this.editor.root.innerHTML = this.value
      }

      // 自定义图片上传处理
      this.setupImageUpload()
      
      // 添加图片调整功能
      this.setupImageResize()
    },

    setupImageUpload() {
      // 重写 Quill 的图片插入逻辑
      const toolbar = this.editor.getModule('toolbar')
      toolbar.addHandler('image', () => {
        this.insertImage()
      })
    },

    async insertImage() {
      // 创建隐藏的文件输入框
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.style.display = 'none'
      
      input.onchange = async (e) => {
        const file = e.target.files[0]
        if (file) {
          try {
            this.$message.loading('图片上传中...', 0)
            
            // 上传图片
            const imageUrl = await uploadRichTextImage(file, this.uploadParams)
            
            this.$message.destroy()
            this.$message.success('图片上传成功')
            
            // 插入图片到编辑器
            const range = this.editor.getSelection()
            this.editor.insertEmbed(range.index, 'image', imageUrl)
            
          } catch (error) {
            this.$message.destroy()
            this.$message.error(error.message || '图片上传失败')
          }
        }
        
        // 清理DOM
        document.body.removeChild(input)
      }
      
      // 触发文件选择
      document.body.appendChild(input)
      input.click()
    },

    execCommand(command, value = null) {
      if (this.editor) {
        this.editor.focus()
        this.editor.execCommand(command, false, value)
      }
    },

    handleSave() {
      this.$emit('save')
      this.contentChanged = false
    },

    // 获取编辑器内容
    getContent() {
      return this.editor ? this.editor.root.innerHTML : ''
    },

         // 设置编辑器内容
     setContent(html) {
       if (this.editor) {
         this.editor.root.innerHTML = html
       }
     },

     // 设置图片调整功能
     setupImageResize() {
       // 为编辑器中的图片添加调整功能
       this.$nextTick(() => {
         const images = this.editor.root.querySelectorAll('img')
         images.forEach(img => {
           this.makeImageResizable(img)
         })
       })

       // 监听新插入的图片
       this.editor.on('text-change', () => {
         const images = this.editor.root.querySelectorAll('img')
         images.forEach(img => {
           if (!img.dataset.resizable) {
             this.makeImageResizable(img)
           }
         })
       })
     },

     // 使图片可调整大小
     makeImageResizable(img) {
       if (img.dataset.resizable) return
       
       img.dataset.resizable = 'true'
       img.style.cursor = 'pointer'
       img.style.maxWidth = '100%'
       img.style.height = 'auto'
       
       // 添加拖拽调整功能
       let isResizing = false
       let startX, startY, startWidth, startHeight
       
       img.addEventListener('mousedown', (e) => {
         if (e.offsetX > img.offsetWidth - 20 && e.offsetY > img.offsetHeight - 20) {
           isResizing = true
           startX = e.clientX
           startY = e.clientY
           startWidth = img.offsetWidth
           startHeight = img.offsetHeight
           img.style.cursor = 'nw-resize'
           e.preventDefault()
         }
       })
       
       document.addEventListener('mousemove', (e) => {
         if (isResizing) {
           const deltaX = e.clientX - startX
           const deltaY = e.clientY - startY
           const newWidth = Math.max(50, startWidth + deltaX)
           const newHeight = Math.max(50, startHeight + deltaY)
           
           img.style.width = newWidth + 'px'
           img.style.height = newHeight + 'px'
         }
       })
       
       document.addEventListener('mouseup', () => {
         if (isResizing) {
           isResizing = false
           img.style.cursor = 'pointer'
         }
       })
       
       // 添加图片属性编辑
       img.addEventListener('dblclick', () => {
         this.editImageProperties(img)
       })
     },

     // 编辑图片属性
     editImageProperties(img) {
       const alt = prompt('请输入图片描述:', img.alt || '')
       if (alt !== null) {
         img.alt = alt
       }
       
       const width = prompt('请输入图片宽度 (px):', img.offsetWidth)
       if (width && !isNaN(width)) {
         img.style.width = width + 'px'
         img.style.height = 'auto'
       }
     }
  },
  watch: {
    value(newVal) {
      if (this.editor && newVal !== this.editor.root.innerHTML) {
        this.editor.root.innerHTML = newVal
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.quill-editor-container {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  
  .editor-toolbar {
    background: #fafafa;
    padding: 8px;
    border-bottom: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    gap: 8px;
    
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
  }
  
  .quill-editor {
    background: white;
    
    .ql-editor {
      min-height: 300px;
      font-family: 'Arial', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      
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
        cursor: pointer;
        
        &:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }
      
      a {
        color: #1890ff;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  
  .editor-status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: #f5f5f5;
    border-top: 1px solid #d9d9d9;
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
  }
}

// Quill 编辑器全局样式
:global(.ql-snow) {
  border: none !important;
  
  .ql-toolbar {
    border: none !important;
    padding: 0 !important;
  }
  
  .ql-editor {
    border: none !important;
    padding: 16px !important;
  }
}

// 图片样式优化
:global(.ql-editor img) {
  display: block;
  margin: 8px auto;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }
  
  &[data-resizable="true"] {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      background: #1890ff;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover::after {
      opacity: 1;
    }
  }
}
</style>
