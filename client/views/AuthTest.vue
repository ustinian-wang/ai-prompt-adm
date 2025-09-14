<template>
  <div class="auth-test-page">
    <h2>认证状态测试</h2>
    
    <div class="test-section">
      <h3>当前状态</h3>
      <p><strong>Token:</strong> {{ token ? '已设置' : '未设置' }}</p>
      <p><strong>用户信息:</strong> {{ userInfo.username || '未登录' }}</p>
      <p><strong>登录状态:</strong> {{ isLoggedIn ? '已登录' : '未登录' }}</p>
    </div>

    <div class="test-section">
      <h3>存储状态</h3>
      <p><strong>localStorage token:</strong> {{ localStorageToken ? '已设置' : '未设置' }}</p>
      <p><strong>Cookie token:</strong> {{ cookieToken ? '已设置' : '未设置' }}</p>
      <p><strong>member_token cookie:</strong> {{ memberTokenCookie ? '已设置' : '未设置' }}</p>
    </div>

    <div class="test-section">
      <h3>测试操作</h3>
      <a-button @click="refreshState" type="primary">刷新状态</a-button>
      <a-button @click="testLogin" style="margin-left: 10px;">测试登录</a-button>
      <a-button @click="testLogout" style="margin-left: 10px;" danger>测试登出</a-button>
    </div>

    <div class="test-section">
      <h3>调试信息</h3>
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AuthTest',
  data() {
    return {
      localStorageToken: '',
      cookieToken: '',
      memberTokenCookie: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['token', 'userInfo', 'isLoggedIn']),
    debugInfo() {
      return {
        token: this.token,
        userInfo: this.userInfo,
        isLoggedIn: this.isLoggedIn,
        localStorage: {
          client_token: localStorage.getItem('client_token'),
          client_userInfo: localStorage.getItem('client_userInfo')
        },
        cookies: document.cookie,
        allCookies: this.getAllCookies()
      }
    }
  },
  mounted() {
    this.refreshState()
  },
  methods: {
    ...mapActions('auth', ['loginMember', 'logout']),
    
    refreshState() {
      this.localStorageToken = localStorage.getItem('client_token') || ''
      this.cookieToken = this.getCookie('client_token')
      this.memberTokenCookie = this.getCookie('member_token')
    },
    
    getCookie(name) {
      const cookies = document.cookie.split(';')
      const cookie = cookies.find(c => c.trim().startsWith(`${name}=`))
      return cookie ? cookie.split('=')[1] : ''
    },
    
    getAllCookies() {
      return document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=')
        acc[name] = value
        return acc
      }, {})
    },
    
    async testLogin() {
      try {
        const result = await this.loginMember({
          mem_username: 'test',
          mem_password: 'test123'
        })
        if (result.success) {
          this.$message.success('登录成功')
          this.refreshState()
        } else {
          this.$message.error(result.msg || '登录失败')
        }
      } catch (error) {
        this.$message.error('登录失败: ' + error.message)
      }
    },
    
    async testLogout() {
      try {
        await this.logout()
        this.$message.success('登出成功')
        this.refreshState()
      } catch (error) {
        this.$message.error('登出失败: ' + error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-test-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  
  .test-section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    
    h3 {
      margin-top: 0;
      color: #333;
    }
    
    p {
      margin: 10px 0;
    }
    
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }
  }
}
</style>
