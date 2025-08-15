<template>
  <div class="work-guide">
    <h2>教程描述</h2>
    <p>这里展示如何使用AI提示词管理系统的详细教程</p>
    
    <a-card title="快速开始指南" class="guide-card">
      <a-steps :current="1" direction="vertical">
        <a-step title="创建作品" description="在作品管理中添加新的AI作品" />
        <a-step title="配置提示词" description="为作品设置合适的AI提示词参数" />
        <a-step title="测试效果" description="使用配置的提示词测试AI生成效果" />
        <a-step title="发布分享" description="将满意的作品发布并分享给其他用户" />
      </a-steps>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'WorkGuide'
}
</script>

<style lang="scss" scoped>
.work-guide {
  h2 {
    margin-bottom: 16px;
    color: #333;
  }
  
  p {
    margin-bottom: 24px;
    color: #666;
  }
  
  .guide-card {
    margin-top: 16px;
  }
}
</style>
