<template>
  <div class="category-list">
    <div class="page-header">
      <h2>分类列表</h2>
      <a-button type="primary" @click="$router.push('/categories/add')">
        <a-icon type="plus" />
        添加分类
      </a-button>
    </div>
    
    <a-table
      :columns="columns"
      :data-source="categoriesList"
      :loading="loading"
      row-key="id"
    >
      <template slot="action" slot-scope="text, record">
        <a-button type="link" @click="editCategory(record)">编辑</a-button>
        <a-popconfirm
          title="确定要删除这个分类吗？"
          @confirm="deleteCategory(record.id)"
        >
          <a-button type="link" style="color: #ff4d4f">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CategoryList',
  data() {
    return {
      columns: [
        {
          title: '分类名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '排序',
          dataIndex: 'sortOrder',
          key: 'sortOrder'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {
    ...mapGetters('categories', ['categoriesList', 'loading'])
  },
  mounted() {
    this.getCategoriesList()
  },
  methods: {
    ...mapActions('categories', ['getCategoriesList']),
    
    editCategory(category) {
      this.$router.push(`/categories/edit/${category.id}`)
    },
    
    deleteCategory(id) {
      this.$message.success(`删除分类成功，ID: ${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.category-list {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h2 {
      margin: 0;
      color: #333;
    }
  }
}
</style>
