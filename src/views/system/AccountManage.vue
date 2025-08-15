<template>
  <div class="account-manage">
    <h2>账号管理</h2>
    
    <a-card title="个人信息" class="info-card">
      <a-form :form="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户名">
              <a-input
                v-decorator="['username']"
                placeholder="请输入用户名"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮箱">
              <a-input
                v-decorator="['email']"
                placeholder="请输入邮箱"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="头像">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" @click="handleSubmit" :loading="loading">
            保存修改
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    
    <a-card title="修改密码" class="password-card">
      <a-form :form="passwordForm" layout="vertical">
        <a-form-item label="当前密码">
          <a-input-password
            v-decorator="[
              'currentPassword',
              { rules: [{ required: true, message: '请输入当前密码!' }] }
            ]"
            placeholder="请输入当前密码"
          />
        </a-form-item>
        
        <a-form-item label="新密码">
          <a-input-password
            v-decorator="[
              'newPassword',
              { rules: [{ required: true, message: '请输入新密码!' }] }
            ]"
            placeholder="请输入新密码"
          />
        </a-form-item>
        
        <a-form-item label="确认新密码">
          <a-input-password
            v-decorator="[
              'confirmPassword',
              { rules: [{ required: true, message: '请确认新密码!' }] }
            ]"
            placeholder="请确认新密码"
          />
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" @click="handlePasswordChange" :loading="passwordLoading">
            修改密码
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'AccountManage',
  data() {
    return {
      loading: false,
      passwordLoading: false,
      imageUrl: ''
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.passwordForm = this.$form.createForm(this)
  },
  mounted() {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo() {
      // 模拟加载用户信息
      this.form.setFieldsValue({
        username: 'admin',
        email: 'admin@example.com'
      })
    },
    
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          setTimeout(() => {
            this.$message.success('个人信息保存成功！')
            this.loading = false
          }, 1000)
        }
      })
    },
    
    handlePasswordChange() {
      this.passwordForm.validateFields((err, values) => {
        if (!err) {
          if (values.newPassword !== values.confirmPassword) {
            this.$message.error('两次输入的新密码不一致！')
            return
          }
          
          this.passwordLoading = true
          setTimeout(() => {
            this.$message.success('密码修改成功！')
            this.passwordLoading = false
            this.passwordForm.resetFields()
          }, 1000)
        }
      })
    },
    
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传JPG/PNG格式的图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    
    handleChange(info) {
      if (info.file.status === 'done') {
        this.imageUrl = info.file.response.url
        this.$message.success('头像上传成功！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.account-manage {
  h2 {
    margin-bottom: 24px;
    color: #333;
  }
  
  .info-card {
    margin-bottom: 24px;
  }
  
  .password-card {
    margin-bottom: 24px;
  }
  
  .avatar-uploader {
    .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }
  }
}
</style>
