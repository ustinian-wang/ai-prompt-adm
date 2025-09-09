<template>
  <div class="client-register-container">
    <div class="register-left">
      <div class="illustration">
        <div class="panel panel-back"></div>
        <div class="panel panel-front">
          <span class="letter-r">R</span>
        </div>
      </div>
    </div>

    <div class="register-right">
      <div class="register-form-container">
        <div class="form-header">
          <h1 class="title">会员注册</h1>
          <p class="subtitle">Create a new account</p>
        </div>

        <a-form
          :form="form"
          @submit="handleSubmit"
          class="register-form"
          layout="vertical"
        >
          <a-form-item label="账号">
            <a-input
              v-model="form.account"
              placeholder="请输入账号"
              class="custom-input"
            />
          </a-form-item>

          <a-form-item label="密码">
            <a-input-password
              v-model="form.password"
              placeholder="请输入密码"
              class="custom-input"
            />
          </a-form-item>

          <a-form-item label="确认密码">
            <a-input-password
              v-model="form.confirmPassword"
              placeholder="请再次输入密码"
              class="custom-input"
            />
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              class="submit-btn"
              :loading="loading"
            >
              注册
            </a-button>
          </a-form-item>
        </a-form>

        <div class="register-options">
          <a href="#" class="option-link">微信注册</a>
          <span class="separator">|</span>
          <router-link to="/login" class="option-link">已有账号登录</router-link>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-left">
        <span class="progress">会员注册</span>
        <a-icon type="appstore" class="footer-icon" />
        <a-icon type="reload" class="footer-icon" />
      </div>
      <div class="footer-center">
        <span class="copyright">© 2019 智能汇集有限公司 版权所有</span>
      </div>
      <div class="footer-right">
        <a-icon type="question-circle" class="help-icon" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { registerMember } from '../api/memberApi'

export default {
  name: 'ClientReg',
  data() {
    return {
      loading: false,
      form: {
        account: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    ...mapActions('auth', ['register']),
    
    async handleSubmit(e) {
      e.preventDefault()
      this.loading = true
      
      try {
        
        await this.handleRegister(this.form)
      } catch (error) {
        console.log(error)
        this.$message.error(error.message || '注册失败')
      } finally {
        this.loading = false
      }
    },

    async handleRegister(values) {
      try {
        const response = await registerMember({
          mem_username: values.account,
          mem_password: values.password
        })
        
        if (response.data.success) {
          this.$message.success('注册成功，请登录')
          this.$router.push('/login')
        } else {
          this.$message.error(response.data.msg || '注册失败')
        }
      } catch (error) {
        this.$message.error('注册失败')
      }
    },

    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.client-register-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  position: relative;
  background: #ffffff;
}

.register-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.illustration {
  position: relative;
  width: 400px;
  height: 400px;
}

.panel {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-back {
  width: 200px;
  height: 150px;
  top: 50px;
  left: 100px;
  transform: rotateY(-15deg) rotateX(5deg);
}

.panel-front {
  width: 180px;
  height: 130px;
  top: 70px;
  left: 110px;
  transform: rotateY(-10deg) rotateX(3deg);
  background: rgba(255, 255, 255, 0.4);
}

.letter-r {
  font-size: 72px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.register-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.register-form-container {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
  
  .title {
    font-size: 28px;
    font-weight: bold;
    color: #000;
    margin: 0 0 8px 0;
  }
  
  .subtitle {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.custom-input {
  height: 48px;
  border-radius: 8px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: #52c41a;
  border-color: #52c41a;
  font-size: 16px;
  font-weight: 500;
}

.register-options {
  text-align: center;
  margin-top: 24px;
  
  .option-link {
    color: #1890ff;
    text-decoration: none;
    font-size: 14px;
  }
  
  .separator {
    margin: 0 12px;
    color: #d9d9d9;
  }
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-top: 1px solid #e8e8e8;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .progress {
    font-size: 14px;
    color: #666;
  }
  
  .footer-icon {
    color: #999;
    font-size: 16px;
    cursor: pointer;
  }
}

.footer-center {
  .copyright {
    font-size: 12px;
    color: #999;
  }
}

.footer-right {
  .help-icon {
    color: #999;
    font-size: 16px;
    cursor: pointer;
  }
}

@media (max-width: 768px) {
  .client-register-container {
    flex-direction: column;
  }
  
  .register-left {
    display: none;
  }
  
  .register-right {
    padding: 20px;
  }
  
  .footer {
    padding: 0 20px;
    flex-direction: column;
    gap: 8px;
    height: auto;
    padding: 16px 20px;
  }
}
</style>
