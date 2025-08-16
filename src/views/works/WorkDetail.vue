<template>
  <div class="work-prompt">
    <!-- 面包屑导航 -->

    <div class="breadcrumb-section">    
      <BackButton />
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
                <ImageUpload
                  v-model="work_form_info.work_img_path"
                  :max-count="1"
                  :multiple="false"
                  :max-size="5"
                  upload-url="/api/upload/image"
                  :upload-params="{
                    userId: work_form_info.user_id,
                    workId: work_form_info.work_id
                  }"
                  upload-text="点击或拖拽上传参考图"
                  @change="handleImagesChange"
                  @remove="handleImageRemove"
                />
                <div class="upload-tip">支持 JPG、PNG、GIF、WebP 格式，单张图片最大 5MB</div>
              </a-form-item>

              <!-- 作品名称 -->
              <a-form-item label="作品名称:" class="work-name-item">
                <a-input
                  v-model="work_form_info.work_name"
                  placeholder="请输入作品名称"
                  size="large"
                  class="work-name-input"
                >
                  <a-icon slot="prefix" type="edit" />
                </a-input>
              </a-form-item>

              <!-- 标签 -->
              <a-form-item label="标签:" class="tags-item">
                <a-input
                  v-model="work_form_info.work_tag_list"
                  placeholder="请打标签 (用#号做区分)"
                  size="large"
                  class="tags-input"
                >
                  <a-icon slot="prefix" type="tags" />
                </a-input>
                <div class="tags-tip">例如：#AI设计 #创意 #现代风格</div>
              </a-form-item>

              <!-- 中文提示词 -->
              <a-form-item label="中文提示词:" class="prompt-item">
                <a-textarea
                  v-model="work_form_info.work_prompt_cn"
                  :rows="6"
                  placeholder="请输入提示词"
                  size="large"
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
                  size="large"
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
                      size="large"
                      class="link-name-input"
                    />
                    
                    <a-input
                      v-model="link.url"
                      placeholder="请输入URL"
                      size="large"
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
                <a-button type="primary" @click="handleSubmit" :loading="loading" size="large">
                  <a-icon type="save" />
                  保存配置
                </a-button>
                <a-button style="margin-left: 8px" @click="goBack" size="large">
                  <a-icon type="arrow-left" />
                  取消
                </a-button>
              </div>
            </a-form>
          </a-tab-pane>

          <a-tab-pane key="tutorial" tab="教程描述">
            <div class="tutorial-editor-container">
              <!-- 富文本编辑器工具栏 -->
              <div class="editor-toolbar">
                <!-- 第一行工具栏 -->
                <div class="toolbar-row">
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
                    <a-button size="small" @click="execCommand('justifyFull')" title="两端对齐">
                      <a-icon type="align-justify" />
                    </a-button>
                  </a-button-group>

                  <a-divider type="vertical" />

                  <a-button size="small" @click="execCommand('formatBlock', '<blockquote>')" title="引用">
                    <a-icon type="quote" />
                  </a-button>

                  <a-divider type="vertical" />

                  <a-button size="small" @click="execCommand('undo')" title="撤销">
                    <a-icon type="undo" />
                  </a-button>
                  <a-button size="small" @click="execCommand('redo')" title="重做">
                    <a-icon type="redo" />
                  </a-button>
                  <a-button size="small" @click="execCommand('removeFormat')" title="清除格式">
                    <a-icon type="clear" />
                  </a-button>

                  <a-divider type="vertical" />

                  <a-button size="small" @click="execCommand('subscript')" title="下标">
                    <a-icon type="sub" />
                  </a-button>
                  <a-button size="small" @click="execCommand('superscript')" title="上标">
                    <a-icon type="sup" />
                  </a-button>

                  <a-divider type="vertical" />

                  <a-select 
                    v-model="lineHeight" 
                    size="small" 
                    style="width: 80px"
                    @change="setLineHeight"
                  >
                    <a-select-option value="1">1.0</a-select-option>
                    <a-select-option value="1.2">1.2</a-select-option>
                    <a-select-option value="1.5">1.5</a-select-option>
                    <a-select-option value="2">2.0</a-select-option>
                  </a-select>
                </div>

                <!-- 第二行工具栏 -->
                <div class="toolbar-row">
                  <a-button-group>
                    <a-button size="small" @click="execCommand('insertUnorderedList')" title="无序列表">
                      <a-icon type="unordered-list" />
                    </a-button>
                    <a-button size="small" @click="execCommand('insertOrderedList')" title="有序列表">
                      <a-icon type="ordered-list" />
                    </a-button>
                    <a-button size="small" @click="execCommand('indent')" title="增加缩进">
                      <a-icon type="indent-left" />
                    </a-button>
                    <a-button size="small" @click="execCommand('outdent')" title="减少缩进">
                      <a-icon type="indent-right" />
                    </a-button>
                  </a-button-group>

                  <a-divider type="vertical" />

                  <a-button size="small" @click="insertLink" title="插入链接">
                    <a-icon type="link" />
                  </a-button>
                  <a-button size="small" @click="removeLink" title="移除链接">
                    <a-icon type="disconnect" />
                  </a-button>

                  <a-divider type="vertical" />

                  <a-button size="small" @click="showImageUpload" title="插入图片">
                    <a-icon type="picture" />
                  </a-button>
                  <a-button size="small" @click="insertTable" title="插入表格">
                    <a-icon type="table" />
                  </a-button>
                  <a-button size="small" @click="execCommand('insertHorizontalRule')" title="分割线">
                    <a-icon type="minus" />
                  </a-button>
                  <a-button size="small" @click="execCommand('formatBlock', '<pre>')" title="代码块">
                    <a-icon type="code" />
                  </a-button>

                  <a-divider type="vertical" />

                  <a-button size="small" @click="insertEmoji" title="插入表情">
                    <a-icon type="smile" />
                  </a-button>

                  <a-divider type="vertical" />

                  <a-color-picker 
                    v-model="textColor" 
                    size="small"
                    @change="setTextColor"
                    title="文字颜色"
                  />

                  <a-color-picker 
                    v-model="backgroundColor" 
                    size="small"
                    @change="setBackgroundColor"
                    title="背景颜色"
                  />

                  <a-divider type="vertical" />

                  <a-select 
                    v-model="fontSize" 
                    size="small" 
                    style="width: 80px"
                    @change="setFontSize"
                  >
                    <a-select-option value="11pt">11pt</a-select-option>
                    <a-select-option value="12pt">12pt</a-select-option>
                    <a-select-option value="14pt">14pt</a-select-option>
                    <a-select-option value="16pt">16pt</a-select-option>
                    <a-select-option value="18pt">18pt</a-select-option>
                    <a-select-option value="24pt">24pt</a-select-option>
                    <a-select-option value="36pt">36pt</a-select-option>
                  </a-select>

                  <a-select 
                    v-model="fontFamily" 
                    size="small" 
                    style="width: 120px"
                    @change="setFontFamily"
                  >
                    <a-select-option value="Arial">Arial</a-select-option>
                    <a-select-option value="Times New Roman">Times New Roman</a-select-option>
                    <a-select-option value="Courier New">Courier New</a-select-option>
                    <a-select-option value="Verdana">Verdana</a-select-option>
                    <a-select-option value="Georgia">Georgia</a-select-option>
                    <a-select-option value="微软雅黑">微软雅黑</a-select-option>
                    <a-select-option value="宋体">宋体</a-select-option>
                  </a-select>

                  <!-- 右侧Logo -->
                  <div class="toolbar-logo">
                    <div class="logo-placeholder"></div>
                  </div>
                </div>
              </div>

              <!-- 富文本编辑器内容区域 -->
              <div 
                ref="editorContent"
                class="editor-content"
                contenteditable="true"
                @input="handleEditorInput"
                @paste="handlePaste"
                @keydown="handleKeydown"
              ></div>

              <!-- 底部状态栏 -->
              <div class="editor-status-bar">
                <span class="status-info">
                  <a-button type="text" size="small" @click="handleUESubmit">
                    <a-icon type="save" />
                    保存
                  </a-button>
                  <a-button type="text" size="small" @click="handleReset">
                    <a-icon type="reload" />
                    重置
                  </a-button>
                  <span v-if="editorContentChanged" class="content-changed-indicator">
                    <a-icon type="edit" /> 内容已修改
                  </span>
                </span>
                <div class="status-actions">
                  <a-button type="text" size="small" @click="toggleGrid" title="网格视图">
                    <a-icon type="appstore" />
                  </a-button>
                  <a-button type="text" size="small" @click="refreshEditor" title="刷新">
                    <a-icon type="reload" />
                  </a-button>
                </div>
              </div>
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
  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { getWorkDetailApi, upsertWorkApi } from '@/api/worksApi'
import { uploadRichTextImage, createImageHtml } from '@/utils/imageUpload'
let default_work_form_info = {
  work_img_id: '',
  work_img_path: '',
  work_name: '',
  work_tag_list: '',
  work_prompt_cn: '',
  work_prompt_en: '',
  work_outer_link_list: [{ name: '', url: '' }],
  work_tutorial_content: ''
};
export default {
  name: 'WorkDetail',
  components: {
    BackButton,
    ImageUpload
  },
  data() {
    return {
      loading: false,
      activeTab: 'prompt',
      workTitle: '示例作品',
      work_form_info: {
        ...default_work_form_info,
      },
      // 富文本编辑器相关数据
      textColor: '#000000',
      backgroundColor: '#ffffff',
      fontSize: '11pt',
      fontFamily: 'Arial',
      lineHeight: '1.5',
      editorContent: '',
      // 编辑器内容变化检测
      editorContentChanged: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
    // 获取路由参数中的作品ID
    const workId = this.$route.params.id
    this.loadWorkData(workId)
  },
  watch: {
    async activeTab(newVal) {
      if(newVal === 'tutorial'){
        await this.$nextTick();
        await this.refreshEditor();
      }
    },
    // 监听编辑器内容变化
    'work_form_info.work_tutorial_content': {
      handler(newValue, oldValue) {
        if (newValue !== oldValue && oldValue !== undefined) {
          this.editorContentChanged = true
        }
      },
      deep: true
    }
  },
  methods: {
    async handleUESubmit() {
      // 保存当前编辑器内容到数据模型
      if (this.$refs.editorContent) {
        this.work_form_info.work_tutorial_content = this.$refs.editorContent.innerHTML
      }
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
          // this.$message.success(res.data.msg)
          work_form_info = res.data.data;
          
                     // 处理图片数据，如果后端返回的是图片路径，转换为数组格式
           if (work_form_info.work_img_path) {
             // 如果 work_img_path 是字符串，转换为数组
             if (typeof work_form_info.work_img_path === 'string') {
               work_form_info.work_img_path = [{
                 uid: 'img1',
                 name: '参考图',
                 url: work_form_info.work_img_path,
                 status: 'done'
               }];
             }
           } else {
             work_form_info.work_img_path = [];
           }
           
           console.log('[jser work_form_info.work_tutorial_content]', work_form_info.work_tutorial_content);
           // 加载教程内容到编辑器
           if (work_form_info.work_tutorial_content) {
             this.$nextTick(() => {
               if (this.$refs.editorContent) {
                 this.$refs.editorContent.innerHTML = work_form_info.work_tutorial_content
               }
             })
           }
        }else{
          this.$message.error(res.data.msg)
        }
      }

      this.work_form_info = work_form_info;
      
      // 重置编辑器内容变化标志
      this.editorContentChanged = false;

    },
    
         // 处理图片变化
     handleImagesChange(images) {
       console.log('图片列表变化:', images)
       this.work_form_info.work_img_path = images
     },
     
     // 处理图片移除
     handleImageRemove(removedImage, index) {
       console.log('移除图片:', removedImage, '索引:', index)
       this.work_form_info.work_img_path.splice(index, 1)
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

         // 保存当前编辑器内容到数据模型
         if (this.$refs.editorContent) {
           this.work_form_info.work_tutorial_content = this.$refs.editorContent.innerHTML
         }
         
         // 检查是否有编辑器内容变化
         if (this.editorContentChanged) {
           console.log('编辑器内容已更新，准备保存...')
           this.$message.info('检测到编辑器内容变化，将一并保存')
         }

         // 处理图片数据，转换为后端期望的格式
         const submitData = {
           ...this.work_form_info,
           work_img_path: this.work_form_info.work_img_path.length > 0 ? this.work_form_info.work_img_path[0].url : '',
           work_tutorial_content: this.work_form_info.work_tutorial_content
         };
        
        let res = await upsertWorkApi(submitData);
        this.$message.destroy()
                 if(res.data.success){
           this.$message.success('保存成功')
           // 重置编辑器内容变化标志
           this.editorContentChanged = false
           this.$router.back()
         }else{
           this.$message.error(res.data.msg)
         }
        
        
        // // 合并表单数据和图片数据
        // const submitData = {
        //   ...values,
        //   referenceImage1: this.work_form_info.referenceImage1,
        //   referenceImage2: this.work_form_info.referenceImage2,
        //   work_outer_link_list: this.work_form_info.work_outer_link_list.filter(link => link.name && link.url)
        // }
        
        // // 模拟保存
        // setTimeout(() => {
        //   this.$message.success('提示词配置保存成功！')
        //   this.loading = false
          
        //   // 这里可以跳转到其他页面或执行其他操作
        //   console.log('提交的数据:', submitData)
        // }, 1000)
      } catch (error) {
        this.$message.error('保存失败，请检查输入信息!')
      }
    },
    
    handlePreview() {
      // 预览功能
      this.$message.info('预览功能开发中...')
    },
    
    async handleReset() {
      await this.loadWorkData(this.$route.params.id)
      this.refreshEditor();
    },
    
    goBack() {
      this.$router.go(-1)
    },

    // 富文本编辑器相关方法
    execCommand(command, value = null) {
      document.execCommand(command, false, value)
      this.$refs.editorContent.focus()
    },

    setTextColor(color) {
      this.execCommand('foreColor', color)
    },

    setBackgroundColor(color) {
      this.execCommand('hiliteColor', color)
    },

    setFontSize(size) {
      this.execCommand('fontSize', size)
    },

    setFontFamily(family) {
      this.execCommand('fontName', family)
    },

    setLineHeight(height) {
      this.execCommand('lineHeight', height)
    },

    insertLink() {
      const url = prompt('请输入链接地址:')
      if (url) {
        this.execCommand('createLink', url)
      }
    },

    removeLink() {
      this.execCommand('unlink')
    },

    showImageUpload() {
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
            const imageUrl = await uploadRichTextImage(file, {
              userId: this.work_form_info.user_id,
              workId: this.work_form_info.work_id
            })
            console.log('[jser imageUrl]', imageUrl);
            
            this.$message.destroy()
            this.$message.success('图片上传成功')
            
            // 创建图片HTML并插入到编辑器
            const imgHtml = createImageHtml(imageUrl, {
              alt: file.name,
              align: 'center'
            })
            
            this.insertImageToEditor(imgHtml)
            
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

    insertImageToEditor(imgHtml) {
      // 将图片HTML插入到编辑器当前光标位置
      if (this.$refs.editorContent) {
        this.execCommand('insertHTML', imgHtml)
        this.editorContentChanged = true
      }
    },

    insertImage() {
      const url = prompt('请输入图片地址:')
      if (url) {
        this.execCommand('insertImage', url)
      }
    },

    insertTable() {
      const rows = prompt('请输入行数:', '3')
      const cols = prompt('请输入列数:', '3')
      if (rows && cols) {
        let table = '<table border="1" style="border-collapse: collapse;">'
        for (let i = 0; i < rows; i++) {
          table += '<tr>'
          for (let j = 0; j < cols; j++) {
            table += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>'
          }
          table += '</tr>'
        }
        table += '</table>'
        this.execCommand('insertHTML', table)
      }
    },

    insertEmoji() {
      const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚']
      const emoji = emojis[Math.floor(Math.random() * emojis.length)]
      this.execCommand('insertText', emoji)
    },

    handleEditorInput() {
      // 实时同步编辑器内容到数据模型
      if (this.$refs.editorContent) {
        this.work_form_info.work_tutorial_content = this.$refs.editorContent.innerHTML
        this.editorContentChanged = true
      }
    },

    handlePaste(e) {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
    },

    handleKeydown(e) {
      // 处理快捷键
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault()
            this.execCommand('bold')
            break
          case 'i':
            e.preventDefault()
            this.execCommand('italic')
            break
          case 'u':
            e.preventDefault()
            this.execCommand('underline')
            break
        }
      }
    },

    toggleGrid() {
      this.$message.info('网格视图功能开发中...')
    },

    refreshEditor() {
      this.$refs.editorContent.innerHTML = this.work_form_info.work_tutorial_content || ''
      this.$message.success('编辑器已刷新')
    }
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
          .work-name-input, .tags-input, .prompt-textarea {
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
