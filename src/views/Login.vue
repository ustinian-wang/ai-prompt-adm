<template>
  <div class="login-container">
    <div class="login-background">
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
    
    <div class="login-content">
      <div class="login-box">
        <div class="login-header">
          <div class="logo">
            <a-icon type="robot" class="logo-icon" />
            <h1>AI提示词管理系统</h1>
          </div>
          <p class="subtitle">智能管理，高效创作</p>
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
              class="custom-input"
            >
              <a-icon slot="prefix" type="user" class="input-icon" />
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
              class="custom-input"
            >
              <a-icon slot="prefix" type="lock" class="input-icon" />
            </a-input-password>
          </a-form-item>
          
          <a-form-item class="form-options">
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
              <a-icon type="login" />
              登录
            </a-button>
          </a-form-item>
          
          <div class="login-options">
            <a-button type="link" @click="showRegister" class="register-btn">
              <a-icon type="user-add" />
              还没有账号？立即注册
            </a-button>
          </div>
        </a-form>
      </div>
    </div>
    
    <!-- 注册弹窗 -->
    <a-modal
      v-model="registerVisible"
      title="用户注册"
      @ok="handleRegister"
      :confirmLoading="registerLoading"
      class="register-modal"
      :width="500"
    >
      <a-form :form="registerForm" layout="vertical">
        <a-form-item label="用户名">
          <a-input
            v-decorator="[
              'username',
              { rules: [{ required: true, message: '请输入用户名!' }] }
            ]"
            placeholder="请输入用户名"
            size="large"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
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
            size="large"
          >
            <a-icon slot="prefix" type="mail" />
          </a-input>
        </a-form-item>
        
        <a-form-item label="密码">
          <a-input-password
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入密码!' }] }
            ]"
            placeholder="请输入密码"
            size="large"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
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
            size="large"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { registerApi } from '@/api/authApi'

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
    ...mapActions('auth', ['login']),
    
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
        await registerApi(values)
        
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

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.background-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 10s infinite ease-in-out;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  left: -50px;
  animation-delay: -2s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  bottom: 100px;
  right: 100px;
  animation-delay: -5s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 200px;
  left: 300px;
  animation-delay: -8s;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.7;
  }
  25% {
    transform: translateY(-20px) translateX(20px) scale(1.1);
    opacity: 0.9;
  }
  50% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.7;
  }
  75% {
    transform: translateY(20px) translateX(-20px) scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.7;
  }
}

.login-content {
  position: relative;
  z-index: 1;
  width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    
    .logo-icon {
      font-size: 48px;
      color: #667eea;
      margin-right: 10px;
    }
    
    h1 {
      font-size: 24px;
      color: #333;
      margin: 0;
    }
  }
  
  .subtitle {
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
    display: flex;
    align-items: center;
    justify-content: center;
    
    .anticon {
      margin-right: 8px;
    }
  }
}

.login-options {
  text-align: center;
  margin-top: 16px;
  
  .register-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    
    .anticon {
      margin-right: 8px;
    }
  }
}

.custom-input {
  .input-icon {
    color: #999;
  }
}

.register-modal {
  .ant-modal-header {
    background: #667eea;
    color: white;
    border-radius: 8px 8px 0 0;
  }
  
  .ant-modal-title {
    color: white;
  }
  
  .ant-modal-body {
    padding: 30px;
  }
  
  .ant-form-item-label {
    color: #333;
  }
  
  .ant-input, .ant-input-password {
    border-radius: 8px;
    border-color: #eee;
    padding-left: 40px;
    
    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px #667eea;
    }
  }
  
  .ant-form-item-control-input-content {
    .ant-input-password {
      .ant-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }
}
</style>
