<template>
  <div class="collect-add-page">
    <div class="page-header">
      <a-button @click="$router.go(-1)" class="back-btn">
        <a-icon type="arrow-left" />
        返回
      </a-button>
      <h1>添加提示词</h1>
    </div>
    
    <div class="content">
      <a-form
        :form="form"
        @submit="handleSubmit"
        layout="vertical"
        class="add-form"
      >
        <a-form-item label="标题">
          <a-input
            v-decorator="[
              'title',
              {
                rules: [{ required: true, message: '请输入标题!' }]
              }
            ]"
            placeholder="请输入提示词标题"
          />
        </a-form-item>
        
        <a-form-item label="内容">
          <a-textarea
            v-decorator="[
              'content',
              {
                rules: [{ required: true, message: '请输入内容!' }]
              }
            ]"
            placeholder="请输入提示词内容"
            :rows="6"
          />
        </a-form-item>
        
        <a-form-item label="分类">
          <a-select
            v-decorator="[
              'categoryId',
              {
                rules: [{ required: true, message: '请选择分类!' }]
              }
            ]"
            placeholder="请选择分类"
          >
            <a-select-option value="1">AI绘画</a-select-option>
            <a-select-option value="2">文案创作</a-select-option>
            <a-select-option value="3">代码生成</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">
            保存
          </a-button>
          <a-button style="margin-left: 8px" @click="$router.go(-1)">
            取消
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectAdd',
  data() {
    return {
      loading: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
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
        
        // 这里调用添加提示词的API
        console.log('提交数据:', values)
        this.$message.success('添加成功')
        this.$router.push('/collect')
      } catch (error) {
        this.$message.error('添加失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.collect-add-page {
  padding: 24px;
  
  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    
    .back-btn {
      margin-right: 16px;
    }
    
    h1 {
      margin: 0;
      color: #333;
    }
  }
  
  .content {
    max-width: 600px;
    
    .add-form {
      background: #fff;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
