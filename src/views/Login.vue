<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>AI提示词管理系统</h1>
        <p>欢迎使用，请登录您的账号</p>
      </div>
      
      <a-form
        :form="form"
        @submit="handleSubmit"
        class="login-form"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'username',
              {
                rules: [{ required: true, message: '请输入用户名!' }],
                validateTrigger: 'blur'
              }
            ]"
            size="large"
            placeholder="用户名"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        
        <a-form-item>
          <a-input-password
            v-decorator="[
              'password',
              {
                rules: [{ required: true, message: '请输入密码!' }],
                validateTrigger: 'blur'
              }
            ]"
            size="large"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-checkbox
            v-decorator="[
              'remember',
              {
                valuePropName: 'checked',
                initialValue: true
              }
            ]"
          >
            记住我
          </a-checkbox>
          <a class="login-form-forgot" href="">
            忘记密码?
          </a>
        </a-form-item>
        
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            class="login-form-button"
          >
            登录
          </a-button>
        </a-form-item>
        
        <div class="login-options">
          <a-button type="link" @click="showRegister">
            还没有账号？立即注册
          </a-button>
        </div>
      </a-form>
    </div>
    
    <!-- 注册弹窗 -->
    <a-modal
      v-model="registerVisible"
      title="用户注册"
      @ok="handleRegister"
      :confirmLoading="registerLoading"
    >
      <a-form :form="registerForm" layout="vertical">
        <a-form-item label="用户名">
          <a-input
            v-decorator="[
              'username',
              { rules: [{ required: true, message: '请输入用户名!' }] }
            ]"
            placeholder="请输入用户名"
          />
        </a-form-item>
        
        <a-form-item label="邮箱">
          <a-input
            v-decorator="[
              'email',
              { 
                rules: [
                  { required: true, message: '请输入邮箱!' },
                  { type: 'email', message: '请输入有效的邮箱地址!' }
                ] 
              }
            ]"
            placeholder="请输入邮箱"
          />
        </a-form-item>
        
        <a-form-item label="密码">
          <a-input-password
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入密码!' }] }
            ]"
            placeholder="请输入密码"
          />
        </a-form-item>
        
        <a-form-item label="确认密码">
          <a-input-password
            v-decorator="[
              'confirmPassword',
              { 
                rules: [
                  { required: true, message: '请确认密码!' },
                  { validator: this.compareToFirstPassword }
                ] 
              }
            ]"
            placeholder="请确认密码"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      registerVisible: false,
      registerLoading: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.registerForm = this.$form.createForm(this)
  },
  methods: {
    ...mapActions('user', ['login']),
    
    async handleSubmit(e) {
      e.preventDefault()
      this.loading = true
      
      try {
        const values = await new Promise((resolve, reject) => {
          this.form.validateFields((err, values) => {
            if (err) reject(err)
            else resolve(values)
          })
        })
        
        await this.login(values)
        this.$message.success('登录成功')
        this.$router.push('/')
      } catch (error) {
        this.$message.error(error.message || '登录失败')
      } finally {
        this.loading = false
      }
    },
    
    showRegister() {
      this.registerVisible = true
    },
    
    async handleRegister() {
      try {
        const values = await new Promise((resolve, reject) => {
          this.registerForm.validateFields((err, values) => {
            if (err) reject(err)
            else resolve(values)
          })
        })
        
        this.registerLoading = true
        // 这里调用注册API
        await this.$api.user.register(values)
        
        this.$message.success('注册成功，请登录')
        this.registerVisible = false
        this.registerForm.resetFields()
      } catch (error) {
        this.$message.error(error.message || '注册失败')
      } finally {
        this.registerLoading = false
      }
    },
    
    compareToFirstPassword(rule, value, callback) {
      const form = this.registerForm
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一致!')
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 8px;
  }
  
  p {
    color: #666;
    margin: 0;
  }
}

.login-form {
  .login-form-forgot {
    float: right;
  }
  
  .login-form-button {
    width: 100%;
  }
}

.login-options {
  text-align: center;
  margin-top: 16px;
}
</style>
