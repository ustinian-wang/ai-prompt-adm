<template>
  <div class="category-add">
    <BackButton text="返回分类列表" to="/categories/list" />
    
    <a-card title="添加分类" :bordered="false">
        <a-form :form="form" layout="vertical" class="form-container">
          <a-row :gutter="24">
            <a-col :span="16">
              <a-form-item label="分类名称" required>
                <a-input
                  v-model="form.name"
                  placeholder="请输入分类名称"
                  
                >
                  <a-icon slot="prefix" type="tag" />
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-divider />
          
          <div class="form-actions">
            <a-button type="primary" @click="handleSubmit" :loading="loading" >
              <a-icon type="save" />
              保存分类
            </a-button>
            <a-button style="margin-left: 8px" @click="handlePreview" >
              <a-icon type="eye" />
              预览效果
            </a-button>
          </div>
        </a-form>
      </a-card>
    </div>
    
    <!-- 图标选择器弹窗 -->
    <a-modal
      v-model="iconSelectorVisible"
      title="选择图标"
      :width="800"
      :footer="null"
    >
      <div class="icon-selector">
        <a-input-search
          v-model="iconSearchText"
          placeholder="搜索图标"
          style="margin-bottom: 16px"
          
        />
        <div class="icon-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon"
            class="icon-item"
            @click="selectIcon(icon)"
          >
            <a-icon :type="icon" />
            <span class="icon-name">{{ icon }}</span>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'CategoryAdd',
  data() {
    return {
      loading: false,
      iconSelectorVisible: false,
      iconSearchText: '',
      icon: '', // 用于存储选中的图标类名
      categoryTree: [
        {
          title: '顶级分类',
          value: '0',
          key: '0',
          children: [
            {
              title: 'AI写作',
              value: '1',
              key: '1',
            },
            {
              title: 'AI绘画',
              value: '2',
              key: '2',
            },
            {
              title: 'AI编程',
              value: '3',
              key: '3',
            },
          ],
        },
      ],
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
    },

    showIconSelector() {
      this.iconSelectorVisible = true
    },

    selectIcon(iconName) {
      this.icon = iconName
      this.iconSelectorVisible = false
    },

    handlePreview() {
      // 预览效果逻辑
      console.log('预览效果')
    }
  }
}
</script>

<style lang="scss" scoped>
.category-add {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;

    .header-content {
      h1 {
        margin-bottom: 8px;
        color: #333;
        font-size: 24px;
      }
      p {
        color: #666;
        font-size: 16px;
      }
    }

    .breadcrumb {
      background-color: #f5f5f5;
      padding: 8px 16px;
      border-radius: 4px;
    }
  }

  .content-wrapper {
    .form-card {
      .form-container {
        .form-actions {
          text-align: right;
          margin-top: 24px;
        }
      }
    }
  }

  .icon-selector {
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;

      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        border: 1px solid #eee;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: #f0f0f0;
          border-color: #ccc;
        }

        .icon-name {
          margin-top: 8px;
          font-size: 12px;
          color: #555;
        }
      }
    }
  }
}
</style>
