<template>
  <div class="test-page">
    <h1>测试页面</h1>
    <p>如果你看到这个页面，说明路由工作正常！</p>
    <p>当前路径: {{ $route.path }}</p>
    <p>当前路由名称: {{ $route.name }}</p>
  </div>
</template>

<script>
export default {
  name: 'Test',
  mounted() {
    console.log('Test component mounted')
  }
}
</script>

<style scoped>
.test-page {
  padding: 20px;
  text-align: center;
}
</style>
