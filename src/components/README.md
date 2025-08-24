# 页面头部组件使用说明

## 组件概述

本项目提供了两个页面头部组件，用于统一各个页面的头部样式和布局：

1. **PageHeader** - 完整版页面头部，支持标题、描述和操作按钮
2. **SimplePageHeader** - 简化版页面头部，仅支持标题和描述

## PageHeader 组件

### 基本用法

```vue
<template>
  <PageHeader
    title="页面标题"
    description="页面描述文字"
    :actions="[
      {
        key: 'create',
        text: '新建',
        type: 'primary',
        icon: 'plus',
        onClick: handleCreate
      }
    ]"
  />
</template>
```

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '' | 页面标题 |
| level | Number | 1 | 标题级别 (1=h1, 2=h2, 3=h3) |
| description | String | '' | 页面描述 |
| simple | Boolean | false | 是否为简化版本 |
| actions | Array | [] | 操作按钮配置 |

### 操作按钮配置

```javascript
actions: [
  {
    key: 'create',           // 唯一标识
    text: '新建',            // 按钮文字
    type: 'primary',         // 按钮类型 (primary/default/danger)
    icon: 'plus',            // 图标名称
    onClick: handleCreate,   // 点击事件处理函数
    size: 'large',           // 按钮大小 (large/default/small)
    loading: false,          // 是否显示加载状态
    disabled: false,         // 是否禁用
    className: 'custom-btn'  // 自定义CSS类名
  }
]
```

### 插槽使用

```vue
<PageHeader title="页面标题">
  <!-- 自定义内容 -->
  <template #content>
    <div>自定义内容</div>
  </template>
  
  <!-- 自定义操作按钮 -->
  <template #actions>
    <a-button type="primary">自定义按钮</a-button>
  </template>
</PageHeader>
```

## SimplePageHeader 组件

### 基本用法

```vue
<template>
  <SimplePageHeader
    title="页面标题"
    description="页面描述文字"
  />
</template>
```

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '' | 页面标题 |
| level | Number | 1 | 标题级别 (1=h1, 2=h2, 3=h3) |
| description | String | '' | 页面描述 |

### 插槽使用

```vue
<SimplePageHeader title="页面标题">
  <!-- 自定义内容 -->
  <template #content>
    <div>自定义内容</div>
  </template>
  
  <!-- 自定义操作按钮 -->
  <template #actions>
    <a-button type="primary">自定义按钮</a-button>
  </template>
</SimplePageHeader>
```

## 使用场景

### PageHeader 适用场景
- 需要操作按钮的页面（如列表页、管理页）
- 复杂的页面头部布局
- 需要动态按钮状态的页面

### SimplePageHeader 适用场景
- 纯展示页面（如仪表盘、详情页）
- 简单的页面头部
- 不需要操作按钮的页面

## 样式定制

组件使用了CSS变量，可以通过修改全局样式文件来定制：

```scss
:root {
  --primary-color: #1890ff;
  --text-primary: #262626;
  --text-secondary: #595959;
  --spacing-xl: 32px;
  --spacing-lg: 24px;
  --spacing-md: 16px;
  --spacing-sm: 8px;
  --border-light: #f0f0f0;
  --shadow-2: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## 响应式支持

组件内置了响应式支持，在移动端会自动调整布局：

- 标题字体大小自动调整
- 操作按钮在移动端变为全宽
- 布局从水平变为垂直排列

## 注意事项

1. 确保在main.js中引入了全局样式文件
2. 操作按钮的onClick函数需要绑定到组件的方法上
3. 图标名称需要是Ant Design Vue支持的图标
4. 组件会自动应用统一的样式类名，便于全局样式管理
