<template>
  <div class="work-prompt">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-section">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>作品管理</a-breadcrumb-item>
        <a-breadcrumb-item>提示词配置</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <!-- 页面标题和标签页 -->
    <div class="page-header">
      <div class="header-content">
        <h1>提示词配置</h1>
        <p>为作品 "{{ workTitle }}" 配置AI提示词参数</p>
      </div>
      <div class="header-tabs">
        <a-tabs v-model="activeTab" type="card">
          <a-tab-pane key="prompt" tab="提示词配置">
            <a-icon slot="tabIcon" type="setting" />
          </a-tab-pane>
          <a-tab-pane key="tutorial" tab="教程描述">
            <a-icon slot="tabIcon" type="book" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <a-card :bordered="false" class="form-card">
        <a-form :form="form" layout="vertical" class="prompt-form">
          <!-- 参考图上传区域 -->
          <a-form-item label="参考图:" class="reference-images">
            <div class="image-upload-area">
              <div class="image-upload-item">
                <a-upload
                  name="referenceImage1"
                  list-type="picture-card"
                  class="image-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeImageUpload"
                  @change="handleImageChange"
                  data-key="image1"
                >
                  <div v-if="formData.referenceImage1" class="image-preview">
                    <img :src="formData.referenceImage1" alt="参考图1" />
                    <div class="image-remove" @click.stop="removeImage('image1')">
                      <a-icon type="close" />
                    </div>
                  </div>
                  <div v-else class="upload-placeholder">
                    <a-icon type="picture" />
                    <div class="upload-text">点击上传</div>
                  </div>
                </a-upload>
              </div>
              
              <div class="image-upload-item">
                <a-upload
                  name="referenceImage2"
                  list-type="picture-card"
                  class="image-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeImageUpload"
                  @change="handleImageChange"
                  data-key="image2"
                >
                  <div v-if="formData.referenceImage2" class="image-preview">
                    <img :src="formData.referenceImage2" alt="参考图2" />
                    <div class="image-remove" @click.stop="removeImage('image2')">
                      <a-icon type="close" />
                    </div>
                  </div>
                  <div v-else class="upload-placeholder">
                    <a-icon type="picture" />
                    <div class="upload-text">点击上传</div>
                  </div>
                </a-upload>
              </div>
            </div>
            <div class="upload-tip">支持jpg、png格式</div>
          </a-form-item>

          <!-- 作品名称 -->
          <a-form-item label="作品名称:" class="work-name-item">
            <a-input
              v-decorator="[
                'workName',
                { rules: [{ required: true, message: '请输入作品名称!' }] }
              ]"
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
              v-decorator="['tags']"
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
              v-decorator="[
                'chinesePrompt',
                { rules: [{ required: true, message: '请输入中文提示词!' }] }
              ]"
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
              v-decorator="[
                'englishPrompt',
                { rules: [{ required: true, message: '请输入英文提示词!' }] }
              ]"
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
                v-for="(link, index) in formData.externalLinks" 
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
                  <a v-if="index === formData.externalLinks.length - 1" 
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
            <a-button style="margin-left: 8px" @click="handlePreview" size="large">
              <a-icon type="eye" />
              预览效果
            </a-button>
            <a-button style="margin-left: 8px" @click="handleReset" size="large">
              <a-icon type="reload" />
              重置
            </a-button>
            <a-button style="margin-left: 8px" @click="goBack" size="large">
              <a-icon type="arrow-left" />
              返回
            </a-button>
          </div>
        </a-form>
      </a-card>
    </div>

    <!-- 底部状态栏 -->
    <div class="bottom-status-bar">
      <div class="status-info">
        <span class="progress">3/4 作品管理-新增(提示词配置)</span>
      </div>
      <div class="status-actions">
        <a-button type="link" size="small" class="status-btn">
          <a-icon type="reload" />
        </a-button>
        <a-button type="link" size="small" class="status-btn">
          <a-icon type="close" />
        </a-button>
      </div>
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
export default {
  name: 'WorkPrompt',
  data() {
    return {
      loading: false,
      activeTab: 'prompt',
      workTitle: '示例作品',
      formData: {
        referenceImage1: '',
        referenceImage2: '',
        workName: '',
        tags: '',
        chinesePrompt: '',
        englishPrompt: '',
        externalLinks: [
          { name: '', url: '' }
        ]
      }
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
  methods: {
    loadWorkData(workId) {
      // 这里应该调用API获取作品信息
      this.workTitle = `作品${workId}`
      
      // 设置表单初始值
      this.form.setFieldsValue({
        workName: this.workTitle,
        tags: '#AI设计 #创意',
        chinesePrompt: '请创建一个现代化的UI设计，风格简洁优雅，色彩搭配和谐，布局合理，用户体验良好。',
        englishPrompt: 'Please create a modern UI design with a clean and elegant style, harmonious color matching, reasonable layout, and good user experience.'
      })
    },
    
    beforeImageUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('图片大小不能超过 5MB!')
        return false
      }
      return true
    },
    
    handleImageChange(info, key) {
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        const imageKey = info.file.response?.key || key
        if (imageKey === 'image1') {
          this.formData.referenceImage1 = info.file.response.url || URL.createObjectURL(info.file.originFileObj)
        } else if (imageKey === 'image2') {
          this.formData.referenceImage2 = info.file.response.url || URL.createObjectURL(info.file.originFileObj)
        }
        this.$message.success('图片上传成功!')
      }
    },
    
    removeImage(imageKey) {
      if (imageKey === 'image1') {
        this.formData.referenceImage1 = ''
      } else if (imageKey === 'image2') {
        this.formData.referenceImage2 = ''
      }
      this.$message.info('图片已移除')
    },
    
    addExternalLink() {
      this.formData.externalLinks.push({ name: '', url: '' })
    },
    
    removeExternalLink(index) {
      this.formData.externalLinks.splice(index, 1)
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
      try {
        const values = await new Promise((resolve, reject) => {
          this.form.validateFields((err, values) => {
            if (err) reject(err)
            else resolve(values)
          })
        })
        
        this.loading = true
        
        // 合并表单数据和图片数据
        const submitData = {
          ...values,
          referenceImage1: this.formData.referenceImage1,
          referenceImage2: this.formData.referenceImage2,
          externalLinks: this.formData.externalLinks.filter(link => link.name && link.url)
        }
        
        // 模拟保存
        setTimeout(() => {
          this.$message.success('提示词配置保存成功！')
          this.loading = false
          
          // 这里可以跳转到其他页面或执行其他操作
          console.log('提交的数据:', submitData)
        }, 1000)
      } catch (error) {
        this.$message.error('保存失败，请检查输入信息!')
      }
    },
    
    handlePreview() {
      // 预览功能
      this.$message.info('预览功能开发中...')
    },
    
    handleReset() {
      this.form.resetFields()
      this.formData = {
        referenceImage1: '',
        referenceImage2: '',
        workName: '',
        tags: '',
        chinesePrompt: '',
        englishPrompt: '',
        externalLinks: [{ name: '', url: '' }]
      }
      this.loadWorkData(this.$route.params.id)
      this.$message.info('表单已重置')
    },
    
    goBack() {
      this.$router.go(-1)
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
