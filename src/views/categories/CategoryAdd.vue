<template>
  <div class="category-add">
    <h2>添加分类</h2>
    
    <a-form :form="form" layout="vertical" class="form-container">
      <a-form-item label="分类名称">
        <a-input
          v-decorator="[
            'name',
            { rules: [{ required: true, message: '请输入分类名称!' }] }
          ]"
          placeholder="请输入分类名称"
        />
      </a-form-item>
      
      <a-form-item label="分类描述">
        <a-textarea
          v-decorator="['description']"
          :rows="4"
          placeholder="请输入分类描述"
        />
      </a-form-item>
      
      <a-form-item label="父级分类">
        <a-select
          v-decorator="['parentId']"
          placeholder="请选择父级分类"
          allowClear
        >
          <a-select-option :value="0">顶级分类</a-select-option>
          <a-select-option :value="1">AI写作</a-select-option>
          <a-select-option :value="2">AI绘画</a-select-option>
          <a-select-option :value="3">AI编程</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="排序">
        <a-input-number
          v-decorator="['sortOrder']"
          :min="0"
          :max="999"
          placeholder="请输入排序值"
        />
      </a-form-item>
      
      <a-form-item>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          保存分类
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
  name: 'CategoryAdd',
  data() {
    return {
      loading: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          // 模拟保存
          setTimeout(() => {
            this.$message.success('分类添加成功！')
            this.loading = false
            this.goBack()
          }, 1000)
        }
      })
    },
    
    goBack() {
      this.$router.push('/categories/list')
    }
  }
}
</script>

<style lang="scss" scoped>
.category-add {
  h2 {
    margin-bottom: 24px;
    color: #333;
  }
  
  .form-container {
    max-width: 600px;
  }
}
</style>
