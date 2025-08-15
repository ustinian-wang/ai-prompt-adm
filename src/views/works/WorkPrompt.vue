<template>
  <div class="work-prompt">
    <h2>提示词配置</h2>
    <p>为作品 "{{ workTitle }}" 配置AI提示词参数</p>
    
    <a-form :form="form" layout="vertical">
      <a-form-item label="提示词标题">
        <a-input
          v-decorator="[
            'title',
            { rules: [{ required: true, message: '请输入提示词标题!' }] }
          ]"
          placeholder="请输入提示词标题"
        />
      </a-form-item>
      
      <a-form-item label="提示词内容">
        <a-textarea
          v-decorator="[
            'content',
            { rules: [{ required: true, message: '请输入提示词内容!' }] }
          ]"
          :rows="6"
          placeholder="请输入AI提示词内容"
        />
      </a-form-item>
      
      <a-form-item label="AI模型类型">
        <a-select
          v-decorator="[
            'modelType',
            { rules: [{ required: true, message: '请选择AI模型类型!' }] }
          ]"
          placeholder="请选择AI模型类型"
        >
          <a-select-option value="gpt-3.5">GPT-3.5</a-select-option>
          <a-select-option value="gpt-4">GPT-4</a-select-option>
          <a-select-option value="claude">Claude</a-select-option>
          <a-select-option value="gemini">Gemini</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="参数配置">
        <a-input
          v-decorator="['parameters']"
          placeholder="请输入JSON格式的参数配置"
        />
      </a-form-item>
      
      <a-form-item>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          保存配置
        </a-button>
        <a-button style="margin-left: 8px" @click="goBack">
          返回
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'WorkPrompt',
  data() {
    return {
      loading: false,
      workTitle: '示例作品'
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
    // 获取路由参数中的作品ID
    const workId = this.$route.params.id
    this.loadWorkData(workId)
  },
  methods: {
    loadWorkData(workId) {
      // 这里应该调用API获取作品信息
      this.workTitle = `作品${workId}`
    },
    
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          // 模拟保存
          setTimeout(() => {
            this.$message.success('提示词配置保存成功！')
            this.loading = false
          }, 1000)
        }
      })
    },
    
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.work-prompt {
  h2 {
    margin-bottom: 16px;
    color: #333;
  }
  
  p {
    margin-bottom: 24px;
    color: #666;
  }
}
</style>
