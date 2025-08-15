<template>
  <div class="dashboard">
    <h1>仪表盘</h1>
    <p>欢迎使用AI提示词管理系统</p>
    
    <a-row :gutter="16" class="stats-row">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总作品数"
            :value="1128"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <a-icon type="file-text" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总用户数"
            :value="93"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <a-icon type="user" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总分类数"
            :value="24"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <a-icon type="folder" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="今日访问"
            :value="1128"
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix>
              <a-icon type="eye" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style lang="scss" scoped>
.dashboard {
  h1 {
    margin-bottom: 16px;
    color: #333;
  }
  
  p {
    margin-bottom: 32px;
    color: #666;
    font-size: 16px;
  }
}

.stats-row {
  margin-top: 24px;
}
</style>
