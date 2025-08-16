<template>
  <div class="quill-editor-container">
    <div class="editor-toolbar">
      <a-button-group>
        <a-button size="small" @click="formatText('bold')" title="粗体">
          <a-icon type="bold" />
        </a-button>
        <a-button size="small" @click="formatText('italic')" title="斜体">
          <a-icon type="italic" />
        </a-button>
        <a-button size="small" @click="formatText('underline')" title="下划线">
          <a-icon type="underline" />
        </a-button>
      </a-button-group>
      
      <a-divider type="vertical" />
      
      <a-button size="small" @click="insertImage" title="插入图片">
        <a-icon type="picture" />
      </a-button>
      
      <a-divider type="vertical" />
      
      <a-button size="small" @click="undo" title="撤销">
        <a-icon type="undo" />
      </a-button>
      <a-button size="small" @click="redo" title="重做">
        <a-icon type="redo" />
      </a-button>
    </div>

    <div ref="editor" class="quill-editor"></div>

    <div class="editor-status-bar">
      <a-button type="text" size="small" @click="saveContent">
        <a-icon type="save" /> 保存
      </a-button>
      <span v-if="contentChanged" class="content-changed-indicator">
        <a-icon type="edit" /> 内容已修改
      </span>
    </div>

    <a-modal
      :visible="imageModalVisible"
      title="插入图片"
      @ok="handleImageUpload"
      @cancel="imageModalVisible = false"
      :confirmLoading="imageUploading"
      width="500px"
    >
      <div class="image-upload-content">
        <a-upload
          :file-list="imageFileList"
          :before-upload="beforeImageUpload"
          :custom-request="customImageUpload"
          accept="image/*"
          :multiple="false"
          list-type="picture-card"
        >
          <div v-if="imageFileList.length < 1" class="upload-trigger">
            <a-icon type="plus" />
            <div class="upload-text">选择图片</div>
          </div>
        </a-upload>
        <div class="upload-tip">支持 JPG、PNG、GIF、WebP 格式，最大 5MB</div>
      </div>
    </a-modal>
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
    placeholder: {
      type: String,
      default: '请输入内容...'
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      quill: null,
      contentChanged: false,
      imageModalVisible: false,
      imageFileList: [],
      imageUploading: false
    }
  },
  mounted() {
    this.initQuill()
  },
  beforeDestroy() {
    if (this.quill) {
      this.quill = null
    }
  },
  watch: {
    value(newVal) {
      if (this.quill && newVal !== this.quill.root.innerHTML) {
        this.quill.root.innerHTML = newVal
        this.contentChanged = false
      }
    }
  },
  methods: {
    initQuill() {
      const options = {
        theme: 'snow',
        placeholder: this.placeholder,
        modules: {
          toolbar: false,
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
          }
        }
      }

      this.quill = new Quill(this.$refs.editor, options)
      
      if (this.value) {
        this.quill.root.innerHTML = this.value
      }

      this.quill.on('text-change', () => {
        this.contentChanged = true
        this.$emit('input', this.quill.root.innerHTML)
        this.$emit('change', this.quill.root.innerHTML)
      })
    },

    formatText(format) {
      if (this.quill) {
        this.quill.format(format, !this.quill.getFormat(format)[format])
        this.quill.focus()
      }
    },

    undo() {
      if (this.quill) {
        this.quill.history.undo()
      }
    },

    redo() {
      if (this.quill) {
        this.quill.history.redo()
      }
    },

    insertImage() {
      this.imageModalVisible = true
      this.imageFileList = []
    },

    beforeImageUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('图片大小不能超过 5MB!')
        return false
      }
      return true
    },

    async customImageUpload({ file, onSuccess, onError }) {
      try {
        this.imageUploading = true
        
        const imageUrl = await uploadRichTextImage(file, {
          userId: this.$store.state.user.userInfo?.id,
          workId: this.$route.params?.id
        })

        if (this.quill) {
          const range = this.quill.getSelection()
          this.quill.insertEmbed(range.index, 'image', imageUrl)
          this.quill.setSelection(range.index + 1)
        }

        this.$message.success('图片插入成功')
        this.imageModalVisible = false
        onSuccess()
      } catch (error) {
        this.$message.error(error.message || '图片上传失败')
        onError(error)
      } finally {
        this.imageUploading = false
      }
    },

    handleImageUpload() {
      // 弹窗关闭时会自动处理
    },

    saveContent() {
      this.$emit('save', this.quill.root.innerHTML)
      this.contentChanged = false
      this.$message.success('内容已保存')
    },

    getContent() {
      return this.quill ? this.quill.root.innerHTML : ''
    },

    setContent(content) {
      if (this.quill) {
        this.quill.root.innerHTML = content
        this.contentChanged = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.quill-editor-container {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  
  .editor-toolbar {
    padding: 8px;
    background: #fafafa;
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
    min-height: v-bind(height);
    
    .ql-editor {
      font-family: 'Arial', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      padding: 16px;
      
      &:focus {
        outline: none;
      }
      
      img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        margin: 8px 0;
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
    
    .content-changed-indicator {
      color: #1890ff;
      font-weight: 600;
      
      .anticon {
        margin-right: 4px;
      }
    }
  }
}

.image-upload-content {
  .upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: #8c8c8c;
    
    .anticon {
      font-size: 24px;
      margin-bottom: 8px;
    }
    
    .upload-text {
      font-size: 12px;
    }
  }
  
  .upload-tip {
    color: #8c8c8c;
    font-size: 12px;
    margin-top: 8px;
  }
}
</style>
