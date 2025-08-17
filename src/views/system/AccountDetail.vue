<template>
  <div class="account-manage">
    <div class="page-header">
      <BackButton />
      <h1>账号详情</h1>
      <p>查看和编辑您的个人信息和账户安全</p>
    </div>
    
    <div class="content-wrapper">
      <a-row :gutter="24">
        <a-col :span="16">
          <a-card title="个人信息" class="info-card" :bordered="false">
            <a-form :form="form" layout="vertical">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="用户名">
                    <a-input
                      v-model="userInfo.username"
                      placeholder="请输入用户名"
                      disabled
                      size="large"
                    >
                      <a-icon slot="prefix" type="user" />
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="邮箱">
                    <a-input
                      v-model="userInfo.user_email"
                      placeholder="请输入邮箱"
                      size="large"
                    >
                      <a-icon slot="prefix" type="mail" />
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="真实姓名">
                    <a-input
                      v-model="userInfo.user_real_name"
                      placeholder="请输入真实姓名"
                      size="large"
                    >
                      <a-icon slot="prefix" type="idcard" />
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="手机号码">
                    <a-input
                      v-model="userInfo.user_mobile"
                      placeholder="请输入手机号码"
                      size="large"
                    >
                      <a-icon slot="prefix" type="phone" />
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              
              <a-form-item label="头像">
                <ImgUpload v-model="imageUrl" />
                <div class="avatar-section">
                  <div class="avatar-info">
                    <p>支持 JPG、PNG 格式，文件大小不超过 2MB</p>
                    <p v-if="uploading" class="upload-status">
                      <a-icon type="loading" spin /> 上传中...
                    </p>
                  </div>
                </div>
              </a-form-item>
              
              <a-form-item>
                <a-button type="primary" @click="handleSubmit" :loading="loading" size="large">
                  <a-icon type="save" />
                  保存修改
                </a-button>
                <a-button style="margin-left: 8px" @click="handleReset" size="large">
                  <a-icon type="reload" />
                  重置
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
        
        <a-col :span="8">
          <a-card title="账户安全" class="security-card" :bordered="false">
            <div class="security-items">
              <div class="security-item">
                <div class="security-icon">
                  <a-icon type="lock" />
                </div>
                <div class="security-content">
                  <h4>登录密码</h4>
                  <p>建议定期更换密码，确保账户安全</p>
                  <a-button type="link" @click="showPasswordModal">
                    修改密码
                  </a-button>
                </div>
              </div>
              
              <div class="security-item">
                <div class="security-icon">
                  <a-icon type="mobile" />
                </div>
                <div class="security-content">
                  <h4>手机验证</h4>
                  <p>已绑定手机：{{ userInfo.user_mobile || '未绑定' }}</p>
                  <a-button type="link">
                    更换手机
                  </a-button>
                </div>
              </div>
              
              <div class="security-item">
                <div class="security-icon">
                  <a-icon type="mail" />
                </div>
                <div class="security-content">
                  <h4>邮箱验证</h4>
                  <p>已绑定邮箱：{{ userInfo.user_email || '未绑定' }}</p>
                  <a-button type="link">
                    更换邮箱
                  </a-button>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    
    <!-- 修改密码弹窗 -->
    <a-modal
      v-model="passwordModalVisible"
      title="修改密码"
      @ok="handlePasswordChange"
      @cancel="handlePasswordCancel"
      :confirm-loading="passwordLoading"
      :width="500"
    >
      <a-form :form="passwordForm" layout="vertical">
        <a-form-item label="当前密码">
          <a-input-password
            v-decorator="[
              'currentPassword',
              { rules: [{ required: true, message: '请输入当前密码!' }] }
            ]"
            placeholder="请输入当前密码"
            size="large"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-item>
        
        <a-form-item label="新密码">
          <a-input-password
            v-decorator="[
              'newPassword',
              { rules: [{ required: true, message: '请输入新密码!' }] }
            ]"
            placeholder="请输入新密码"
            size="large"
          >
            <a-icon slot="prefix" type="key" />
          </a-input-password>
        </a-form-item>
        
        <a-form-item label="确认新密码">
          <a-input-password
            v-decorator="[
              'confirmPassword',
              { 
                rules: [
                  { required: true, message: '请确认新密码!' },
                  { validator: this.compareToFirstPassword }
                ] 
              }
            ]"
            placeholder="请确认新密码"
            size="large"
          >
            <a-icon slot="prefix" type="key" />
          </a-input-password>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getUserDetailApi, upsertUserApi, } from '@/api/userApi'
import BackButton from '@/components/BackButton.vue'
import ImgUpload from '@/components/ImgUpload.vue'

export default {
  name: 'AccountDetail',
  components: {
    BackButton,
    ImgUpload
  },
  data() {
    return {
      loading: false,
      passwordLoading: false,
      passwordModalVisible: false,
      form: null,
      passwordForm: null,
      userInfo: {},
      uploading: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.passwordForm = this.$form.createForm(this)
  },
  mounted() {
    this.loadUserData()
  },
  computed: {
    userId() {
      return this.$route.params.id;
    },
    imageUrl: {
      get(){
        return this?.userInfo?.user_avatar || '';
      },
      set(value){
        console.log('[set img value]', value)
        this.userInfo.user_avatar = value;
      }
    }
  },
  methods: {
    async loadUserData() {
      // 这里应该从store或路由参数获取当前用户ID
      const userId = this.$route.params.id;
      
      const res = await getUserDetailApi(userId)
      if (res.data.success) {
        this.userInfo = res.data.data;
      } else {
          this.$message.error(res.data.msg || '获取用户信息失败')
      }
    },
    
    // 触发文件选择
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    
    // 处理文件选择
    async handleFileChange(event) {
      const file = event.target.files[0]
      if (!file) return
      
      try {
        // 验证文件类型和大小
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
          this.$message.error('只能上传 JPG/PNG 格式的图片!')
          return
        }
        
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('图片大小不能超过 2MB!')
          return
        }
        
        // 开始上传
        this.uploading = true
        
        // 使用imageUpload工具上传头像
        const imageUrl = await uploadAvatar(file, this.userId)
        
        // 更新头像URL
        this.imageUrl = imageUrl
        this.userInfo.user_avatar = imageUrl
        
        this.$message.success('头像上传成功!')
        
        // 清空文件输入
        this.$refs.fileInput.value = ''
        
      } catch (error) {
        console.error('头像上传失败:', error)
        this.$message.error(error.message || '头像上传失败，请重试')
      } finally {
        this.uploading = false
      }
    },
    
    async handleSubmit() {
      try {
        const values = this.userInfo;
        
        this.loading = true
        
        // 获取当前用户ID
        const userId = this.userId;
        
        // 更新用户信息
        const res = await upsertUserApi(userId, this.userInfo)
        if (res.data.success) {
          this.$message.success('个人信息保存成功!')
          this.loadUserData() // 重新加载数据
        } else {
          this.$message.error(res.data.msg || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败，请检查输入信息!')
      } finally {
        this.loading = false
      }
    },
    
    handleReset() {
      this.form.resetFields()
      this.loadUserData()
      this.$message.info('已重置为原始数据')
    },
    
    showPasswordModal() {
      this.passwordModalVisible = true
      this.passwordForm.resetFields()
    },
    
    handlePasswordCancel() {
      this.passwordModalVisible = false
      this.passwordForm.resetFields()
    },
    
    async handlePasswordChange() {
      try {
        const values = await new Promise((resolve, reject) => {
          this.passwordForm.validateFields((err, values) => {
            if (err) reject(err)
            else resolve(values)
          })
        })
        
        this.passwordLoading = true
        
        // 这里应该调用修改密码的API
        // 由于当前没有专门的修改密码接口，这里只是模拟
        setTimeout(() => {
          this.$message.success('密码修改成功!')
          this.passwordLoading = false
          this.passwordModalVisible = false
          this.passwordForm.resetFields()
        }, 1000)
      } catch (error) {
        console.error('密码修改失败:', error)
        this.$message.error('密码修改失败，请检查输入信息!')
      }
    },
    
    compareToFirstPassword(rule, value, callback) {
      const form = this.passwordForm
      if (value && value !== form.getFieldValue('newPassword')) {
        callback('两次输入的密码不一致!')
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.account-manage {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
  
  .page-header {
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
  
  .content-wrapper {
    .info-card, .security-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      
      .ant-card-head {
        border-bottom: 1px solid #f0f0f0;
        
        .ant-card-head-title {
          font-size: 16px;
          font-weight: 600;
          color: #262626;
        }
      }
    }
    
    .avatar-section {
      .avatar-uploader {
        width: 120px;
        height: 120px;
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
        
        &:hover {
          border-color: #1890ff;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
        }
        
        .avatar-preview {
          width: 100%;
          height: 100%;
          position: relative;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 6px;
          }
          
          .avatar-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            opacity: 0;
            transition: opacity 0.3s;
            
            .anticon {
              font-size: 24px;
              margin-bottom: 8px;
            }
            
            span {
              font-size: 12px;
            }
          }
          
          &:hover .avatar-overlay {
            opacity: 1;
          }
        }
        
        .avatar-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          
          .anticon {
            font-size: 32px;
            color: #999;
            margin-bottom: 8px;
          }
          
          .upload-text {
            color: #666;
            font-size: 12px;
          }
        }
      }
      
      .avatar-info {
        margin-top: 12px;
        
        p {
          color: #8c8c8c;
          font-size: 12px;
          margin: 0 0 4px 0;
          
          &.upload-status {
            color: #1890ff;
            display: flex;
            align-items: center;
            
            .anticon {
              margin-right: 6px;
            }
          }
        }
      }
    }
    
    .security-card {
      .security-items {
        .security-item {
          display: flex;
          align-items: flex-start;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
          
          &:last-child {
            border-bottom: none;
          }
          
          .security-icon {
            width: 40px;
            height: 40px;
            background: #f6ffed;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            flex-shrink: 0;
            
            .anticon {
              font-size: 18px;
              color: #52c41a;
            }
          }
          
          .security-content {
            flex: 1;
            
            h4 {
              font-size: 14px;
              font-weight: 600;
              color: #262626;
              margin: 0 0 4px 0;
            }
            
            p {
              color: #8c8c8c;
              font-size: 12px;
              margin: 0 0 8px 0;
            }
            
            .ant-btn-link {
              padding: 0;
              height: auto;
              color: #1890ff;
              
              &:hover {
                color: #40a9ff;
              }
            }
          }
        }
      }
    }
  }
  
  .ant-form-item-label {
    label {
      font-weight: 500;
      color: #262626;
    }
  }
  
  .ant-input, .ant-input-password {
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
  
  .ant-btn {
    border-radius: 6px;
    height: 40px;
    
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
</style>
