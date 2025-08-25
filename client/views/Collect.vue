<template>
  <div class="collect-page">
    <div class="page-header">
      <h1>提示词收集</h1>
      <a-button type="primary" @click="$router.push('/collect/add')">
        <a-icon type="plus" />
        添加提示词
      </a-button>
    </div>
    
    <div class="content">
      <p>欢迎使用提示词收集系统</p>
      <a-button type="link" @click="$router.push('/collect/my')">
        查看我的提示词
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collect'
}
</script>

<style lang="scss" scoped>
.collect-page {
  padding: 24px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h1 {
      margin: 0;
      color: #333;
    }
  }
  
  .content {
    text-align: center;
    padding: 60px 0;
    
    p {
      font-size: 18px;
      color: #666;
      margin-bottom: 24px;
    }
  }
}
</style>
