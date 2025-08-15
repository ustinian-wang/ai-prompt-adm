# 返回按钮组件使用说明

## 概述
已将所有页面的面包屑导航替换为返回按钮，提供更简洁的导航体验。

## 组件位置
`src/components/BackButton.vue`

## 使用方法

### 1. 基本用法
```vue
<template>
  <div>
    <BackButton />
    <!-- 页面内容 -->
  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue'

export default {
  components: {
    BackButton
  }
}
</script>
```

### 2. 自定义返回路径
```vue
<BackButton text="返回作品列表" to="/works/list" />
```

### 3. 自定义按钮文本
```vue
<BackButton text="返回上一页" />
```

### 4. 显示返回路径（调试用）
```vue
<BackButton text="返回" to="/works/list" :showPath="true" />
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `to` | String | `''` | 指定返回路径，不指定则使用浏览器历史记录 |
| `text` | String | `'返回'` | 按钮显示文本 |
| `showPath` | Boolean | `false` | 是否在按钮文本中显示返回路径 |

## 返回逻辑

1. **指定路径**：如果设置了 `to` 属性，点击后直接跳转到指定路径
2. **历史记录**：如果没有设置 `to`，则返回上一页
3. **兜底处理**：如果没有历史记录，则跳转到 `/works/list`

## 已更新的页面

### 作品管理
- `WorkList.vue` - 返回首页 (`/works`)
- `WorkDetail.vue` - 返回作品列表 (`/works/list`)

### 分类管理
- `CategoryAdd.vue` - 返回分类列表 (`/categories/list`)
- `CategoryEdit.vue` - 已有返回按钮，无需更新

### 其他页面
- `UserList.vue` - 无面包屑，无需更新
- `AccountManage.vue` - 无面包屑，无需更新
- `Dashboard.vue` - 无面包屑，无需更新

## 样式特点

- 使用链接样式按钮，颜色为蓝色
- 左侧显示左箭头图标
- 悬停时有背景色变化
- 统一的间距和字体大小

## 优势

1. **简洁性**：比面包屑更简洁，节省空间
2. **一致性**：所有页面使用统一的返回按钮样式
3. **灵活性**：支持自定义返回路径和文本
4. **用户体验**：更直观的返回操作

## 注意事项

1. 确保在需要返回按钮的页面中导入组件
2. 根据页面层级关系设置合适的返回路径
3. 返回按钮通常放在页面顶部，在页面标题之前
4. 如果页面有多个可能的返回路径，建议明确指定 `to` 属性
