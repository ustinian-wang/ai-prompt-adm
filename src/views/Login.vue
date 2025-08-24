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
          class="login-form unified-form"
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
      <a-form :form="registerForm" layout="vertical" class="unified-form">
        <a-form-item label="用户名">
          <a-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        
        <a-form-item label="邮箱">
          <a-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            
          >
            <a-icon slot="prefix" type="mail" />
          </a-input>
        </a-form-item>
        
        <a-form-item label="密码">
          <a-input-password
            v-model="registerForm.password"
            placeholder="请输入密码"
            
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-item>
        
        <a-form-item label="确认密码">
          <a-input-password
            v-model="registerForm.confirmPassword"
            placeholder="请确认密码"
            
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
      registerLoading: false,
      registerForm: {
        username: '', // 用户名
        email: '', // 邮箱
        password: '', // 密码
        confirmPassword: '' // 确认密码
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    ...mapActions('auth', ['login']),
    async loginProcess(data){
      let res = await this.login(data);
      if(res.success){
        this.$message.success('登录成功')
        this.$router.push('/')
      }else{
        this.$message.error(res.msg)
      }

    },
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
        
        await this.loginProcess(values)
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
        this.registerLoading = true
        alert(JSON.stringify(this.registerForm))
        // 这里调用注册API
        let res = await registerApi(this.registerForm)
        if(res.data.success){
          this.$message.success('注册成功')
          this.registerVisible = false

          await this.loginProcess({
            username: this.registerForm.username,
            password: this.registerForm.password
          });
        }else{
          this.$message.error(res.data.msg)
        }
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
  background: linear-gradient(135deg, var(--primary-color) 0%, #667eea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
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
  background: var(--background-white);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-3);
  padding: var(--spacing-xl);
  
  @media (max-width: 768px) {
    width: 90%;
    padding: var(--spacing-lg);
  }
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-md);
    
    .logo-icon {
      font-size: 48px;
      color: var(--primary-color);
      margin-right: var(--spacing-sm);
    }
    
    h1 {
      font-size: 24px;
      color: var(--text-primary);
      margin: 0;
      font-weight: 600;
    }
  }
  
  .subtitle {
    color: var(--text-secondary);
    margin: 0;
    font-size: 14px;
  }
}

.login-form {
  .login-form-forgot {
    float: right;
    color: var(--primary-color);
    
    &:hover {
      color: var(--primary-hover);
    }
  }
  
  .login-form-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    border-radius: var(--border-radius-md);
    font-weight: 500;
    
    .anticon {
      margin-right: var(--spacing-sm);
    }
  }
  
  .form-options {
    margin-bottom: var(--spacing-lg);
  }
}

.login-options {
  text-align: center;
  margin-top: var(--spacing-md);
  
  .register-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    
    &:hover {
      color: var(--primary-hover);
    }
    
    .anticon {
      margin-right: var(--spacing-sm);
    }
  }
}

.custom-input {
  height: 48px;
  border-radius: var(--border-radius-md);
  
  .input-icon {
    color: var(--text-tertiary);
  }
  
  &:hover {
    border-color: var(--primary-hover);
  }
  
  &:focus,
  &.ant-input-focused {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}

.register-modal {
  .ant-modal-header {
    background: var(--primary-color);
    color: white;
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
    
    .ant-modal-title {
      color: white;
      font-weight: 600;
    }
  }
  
  .ant-modal-body {
    padding: var(--spacing-xl);
  }
  
  .ant-form-item-label > label {
    color: var(--text-primary);
    font-weight: 500;
  }
  
  .ant-input,
  .ant-input-password {
    height: 48px;
    border-radius: var(--border-radius-md);
    border-color: var(--border-color);
    padding-left: 40px;
    
    &:hover {
      border-color: var(--primary-hover);
    }
    
    &:focus,
    &.ant-input-focused {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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
  
  .ant-btn {
    height: 48px;
    border-radius: var(--border-radius-md);
    font-weight: 500;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .login-content {
    width: 90%;
    margin: var(--spacing-md);
  }
  
  .login-header {
    .logo h1 {
      font-size: 20px;
    }
    
    .subtitle {
      font-size: 13px;
    }
  }
}
</style>
