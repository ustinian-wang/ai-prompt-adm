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
          <h1 class="title">登录/注册</h1>
          <p class="subtitle">Login or register an account</p>
        </div>

        <a-form
          :form="form"
          @submit="handleSubmit"
          class="login-form"
          layout="vertical"
        >
          <a-form-item label="账号">
            <a-input
              v-decorator="[
                'account',
                {
                  rules: [{ required: true, message: '请输入账号!' }],
                  initialValue: '135492'
                }
              ]"
              placeholder="请输入账号"
              class="custom-input"
            />
          </a-form-item>


          <a-form-item label="密码">
            <a-input-password
              v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: '请输入密码!' }]
                }
              ]"
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
              登录/注册
            </a-button>
          </a-form-item>
        </a-form>

        <div class="login-options">
          <a href="#" class="option-link">微信登录</a>
          <span class="separator">|</span>
          <a href="#" class="option-link">密码登录</a>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-left">
        <span class="progress">1/7 第一次注册设置密码</span>
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
import { registerMember, loginMember } from '../api/memberApi'

export default {
  name: 'ClientLogin',
  data() {
    return {
      loading: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    ...mapActions('auth', ['login', 'register']),
    
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
        
        // 先尝试登录，如果失败则注册
        try {
          await this.handleLogin(values)
        } catch (error) {
          await this.handleRegister(values)
        }
      } catch (error) {
        this.$message.error(error.message || '操作失败')
      } finally {
        this.loading = false
      }
    },

    async handleLogin(values) {
      try {
        const response = await loginMember({
          mem_username: values.account,
          mem_password: values.password || 'default_password'
        })
        
        if (response.data.success) {
          // 保存用户信息到store
          this.$store.commit('auth/SET_USER_INFO', response.data.data)
          this.$message.success('登录成功')
          this.$router.push('/')
        } else {
          this.$message.error(response.data.msg || '登录失败')
        }
      } catch (error) {
        this.$message.error('登录失败')
      }
    },

    async handleRegister(values) {
      try {
        const response = await registerMember({
          mem_username: values.account,
          mem_password: values.password
        })
        
        if (response.data.success) {
          this.$message.success('注册成功')
          this.$router.push('/')
        } else {
          this.$message.error(response.data.msg || '注册失败')
        }
      } catch (error) {
        this.$message.error('注册失败')
      }
    },

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
