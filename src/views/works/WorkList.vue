<template>
  <div class="work-list">
    <h1>作品列表页面</h1>
    <p>如果你能看到这个页面，说明组件加载正常</p>
    
    <!-- 调试信息 -->
    <div style="background: #f0f0f0; padding: 10px; margin: 20px 0; border: 1px solid #ccc;">
      <h3>调试信息</h3>
      <p>组件名称: {{ $options.name }}</p>
      <p>当前路由: {{ $route.path }}</p>
      <p>路由名称: {{ $route.name }}</p>
      <p>Vuex works 模块状态: {{ $store.state.works ? '已加载' : '未加载' }}</p>
    </div>
    
    <a-button type="primary" @click="testClick">
      测试按钮
    </a-button>
    
    <div v-if="testMessage" style="margin-top: 20px; padding: 10px; background: #e6f7ff; border: 1px solid #91d5ff;">
      {{ testMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkList',
  data() {
    return {
      testMessage: ''
    }
  },
  mounted() {
    console.log('WorkList 组件已挂载')
    this.testMessage = '组件已成功加载！'
  },
  methods: {
    testClick() {
      this.testMessage = '按钮点击成功！时间：' + new Date().toLocaleString()
    }
  }
}
</script>

<style lang="scss" scoped>
.work-list {
  padding: 20px;
  
  h1 {
    color: #1890ff;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 10px;
  }
}
</style>
