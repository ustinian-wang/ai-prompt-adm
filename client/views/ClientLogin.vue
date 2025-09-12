<template>
  <div class="client-login-container">
    <div class="login-left">
      <div class="illustration">
        <div class="panel panel-back"></div>
        <div class="panel panel-front">
          <span class="letter-a">A</span>
        </div>
      </div>
    </div>

    <div class="login-right">
      <div class="login-form-container">
        <div class="form-header">
          <h1 class="title">会员登录</h1>
          <p class="subtitle">Login to your account</p>
        </div>

        <a-form
          :form="form"
          @submit="handleSubmit"
          class="login-form"
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

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              class="submit-btn"
              :loading="loading"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <div class="login-options">
          <a href="#" class="option-link">微信登录</a>
          <span class="separator">|</span>
          <router-link to="/register" class="option-link">注册账号</router-link>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-left">
        <span class="progress">会员登录</span>
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

export default {
  name: 'ClientLogin',
  data() {
    return {
      loading: false,
      form: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions('auth', ['loginMember']),
    
    async handleSubmit(e) {
      e.preventDefault()
      this.loading = true
      
      try {
        
        await this.handleLogin(this.form)
      } catch (error) {
        this.$message.error(error.message || '登录失败')
      } finally {
        this.loading = false
      }
    },

    async handleLogin(values) {
      const res = await this.loginMember({
        mem_username: values.account,
        mem_password: values.password
      })
      if (res.success) {
        this.$message.success('登录成功')
        this.$router.push('/')
      } else {
        this.$message.error(res.msg || '登录失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.client-login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  position: relative;
  background: #ffffff;
}

.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.illustration {
  position: relative;
  width: 400px;
  height: 400px;
}

.panel {
  position: absolute;
  background: rgba(255, 165, 0, 0.3);
  border: 2px solid rgba(255, 165, 0, 0.6);
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
  background: rgba(255, 165, 0, 0.4);
}

.letter-a {
  font-size: 72px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-form-container {
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

.verification-row {
  display: flex;
  gap: 12px;
  
  .verification-input {
    flex: 1;
  }
  
  .get-code-btn {
    height: 48px;
    border-radius: 8px;
    white-space: nowrap;
  }
}

.submit-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: #ff4d4f;
  border-color: #ff4d4f;
  font-size: 16px;
  font-weight: 500;
}

.login-options {
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
  .client-login-container {
    flex-direction: column;
  }
  
  .login-left {
    display: none;
  }
  
  .login-right {
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
