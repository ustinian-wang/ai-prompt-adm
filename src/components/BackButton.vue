<template>
  <div class="back-button-section">
    <a-button 
      type="link" 
      @click="goBack"
      class="back-button"
    >
      <a-icon type="left" />
      {{ buttonText }}
    </a-button>
  </div>
</template>

<script>
export default {
  name: 'BackButton',
  props: {
    // 返回路径，如果不指定则使用浏览器历史记录
    to: {
      type: String,
      default: ''
    },
    // 按钮文本
    text: {
      type: String,
      default: '返回'
    },
    // 是否显示返回路径
    showPath: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonText() {
      if (this.showPath && this.to) {
        return `${this.text} (${this.to})`
      }
      return this.text
    }
  },
  methods: {
    goBack() {
      if (this.to) {
        // 如果指定了路径，则跳转到指定路径
        this.$router.push(this.to)
      } else {
        // 否则返回上一页
        if (this.$router.history.length > 1) {
          this.$router.go(-1)
        } else {
          // 如果没有历史记录，则跳转到首页
          this.$router.push('/works/list')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.back-button-section {
  margin-bottom: 16px;
  padding: 8px 0;
  
  .back-button {
    padding: 4px 8px;
    height: auto;
    font-size: 14px;
    color: #1890ff;
    
    &:hover {
      color: #40a9ff;
      background-color: #f0f8ff;
    }
    
    .anticon {
      margin-right: 4px;
    }
  }
}
</style>
