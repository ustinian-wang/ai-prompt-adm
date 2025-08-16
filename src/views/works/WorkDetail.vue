<template>
  <div class="work-prompt">
    <!-- 面包屑导航 -->

    <div class="breadcrumb-section">    
      <BackButton />
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
let default_work_form_info = {
  work_img_id: '',
  work_img_path: '',
  work_name: '',
  work_tag_list: '',
  work_prompt_cn: '',
  work_prompt_en: '',
  work_outer_link_list: [{ name: '', url: '' }]
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
        }else{
          this.$message.error(res.data.msg)
        }
      }

      this.work_form_info = work_form_info;

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

                 // 处理图片数据，转换为后端期望的格式
         const submitData = {
           ...this.work_form_info,
           work_img_path: this.work_form_info.work_img_path.length > 0 ? this.work_form_info.work_img_path[0].url : ''
         };
        
        let res = await upsertWorkApi(submitData);
        this.$message.destroy()
        if(res.data.success){
          this.$message.success('保存成功')
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
    
    handleReset() {
      this.form.resetFields()
      this.work_form_info = {
        ...default_work_form_info,
        work_outer_link_list: [{ name: '', url: '' }]
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
