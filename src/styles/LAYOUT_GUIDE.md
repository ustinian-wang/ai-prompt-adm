# 统一布局规范

## 概述

本文档定义了项目中所有页面通用的间距、布局和组件样式规范，确保整个应用的视觉一致性和用户体验的统一性。

## 间距系统

### 基础间距变量

```scss
:root {
  --spacing-xs: 4px;    // 超小间距
  --spacing-sm: 8px;    // 小间距
  --spacing-md: 16px;   // 中等间距
  --spacing-lg: 24px;   // 大间距
  --spacing-xl: 32px;   // 超大间距
  --spacing-xxl: 48px;  // 超大间距
}
```

### 间距使用规范

| 使用场景 | 推荐间距 | 说明 |
|----------|----------|------|
| 页面容器内边距 | `var(--spacing-lg)` | 页面内容与边缘的距离 |
| 页面头部下方间距 | `var(--spacing-xl)` | 页面标题与内容区域的距离 |
| 搜索卡片下方间距 | `var(--spacing-xl)` | 搜索区域与表格的距离 |
| 表格行内边距 | `var(--spacing-md) var(--spacing-sm)` | 表格单元格的内边距 |
| 按钮组间距 | `var(--spacing-sm)` | 按钮之间的间距 |
| 表单项目间距 | `var(--spacing-md)` | 表单项之间的垂直间距 |
| 弹窗内边距 | `var(--spacing-lg)` | 弹窗内容的内边距 |

## 布局结构

### 标准页面布局

```vue
<template>
  <div class="page-container fade-in">
    <!-- 页面头部 -->
    <PageHeader 
      title="页面标题"
      description="页面描述"
      :actions="actions"
    />
    
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 搜索筛选区域 -->
      <a-card :bordered="false" class="search-card">
        <!-- 搜索表单 -->
      </a-card>
      
      <!-- 数据表格 -->
      <a-card :bordered="false" class="table-card">
        <!-- 表格内容 -->
      </a-card>
    </div>
  </div>
</template>
```

### 布局类名规范

| 类名 | 用途 | 样式说明 |
|------|------|----------|
| `.page-container` | 页面容器 | 提供基础内边距和最小高度 |
| `.content-wrapper` | 内容包装器 | 包装搜索和表格区域 |
| `.search-card` | 搜索卡片 | 搜索筛选区域的容器 |
| `.table-card` | 表格卡片 | 数据表格的容器 |

## 组件样式统一

### 按钮样式

```scss
// 搜索按钮组
.ant-form-item:last-child .ant-btn {
  height: 48px;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  margin-right: var(--spacing-sm);
  
  &:last-child {
    margin-right: 0;
  }
}

// 操作按钮
.action-btn {
  padding: 0 var(--spacing-sm);
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-color);
    transform: translateY(-1px);
  }
}
```

### 表格样式

```scss
.ant-table {
  .ant-table-thead > tr > th {
    background: var(--background-light);
    border-bottom: 1px solid var(--border-light);
    font-weight: 600;
    color: var(--text-primary);
    padding: var(--spacing-md) var(--spacing-sm);
  }
  
  .ant-table-tbody > tr > td {
    padding: var(--spacing-md) var(--spacing-sm);
    border-bottom: 1px solid var(--border-light);
  }
  
  .ant-table-tbody > tr:hover > td {
    background: var(--background-hover);
  }
}
```

### 弹窗样式

```scss
.ant-modal {
  .ant-modal-header {
    border-bottom: 1px solid var(--border-light);
    padding: var(--spacing-lg);
  }
  
  .ant-modal-body {
    padding: var(--spacing-lg);
    
    .ant-form-item {
      margin-bottom: var(--spacing-md);
    }
  }
  
  .ant-modal-footer {
    border-top: 1px solid var(--border-light);
    padding: var(--spacing-lg);
  }
}
```

## 响应式设计

### 移动端适配

```scss
@media (max-width: 768px) {
  .page-container {
    padding: var(--spacing-md);
  }
  
  .content-wrapper {
    .search-card {
      margin-bottom: var(--spacing-lg);
      
      .ant-form-item:last-child .ant-btn {
        width: 100%;
        margin-right: 0;
        margin-bottom: var(--spacing-sm);
      }
    }
    
    .table-card {
      .ant-table {
        .ant-table-thead > tr > th,
        .ant-table-tbody > tr > td {
          padding: var(--spacing-sm);
        }
      }
    }
  }
  
  .action-buttons {
    flex-direction: column;
    gap: var(--spacing-xs);
    
    .action-btn {
      width: 100%;
      text-align: center;
    }
  }
}
```

## 最佳实践

### 1. 使用统一的间距变量

❌ 错误示例：
```scss
.page-header {
  margin-bottom: 24px;  // 硬编码数值
}
```

✅ 正确示例：
```scss
.page-header {
  margin-bottom: var(--spacing-xl);  // 使用CSS变量
}
```

### 2. 保持一致的布局结构

❌ 错误示例：
```vue
<template>
  <div class="page">
    <h1>标题</h1>
    <div class="search">搜索</div>
    <div class="table">表格</div>
  </div>
</template>
```

✅ 正确示例：
```vue
<template>
  <div class="page-container fade-in">
    <PageHeader title="标题" />
    <div class="content-wrapper">
      <a-card class="search-card">搜索</a-card>
      <a-card class="table-card">表格</a-card>
    </div>
  </div>
</template>
```

### 3. 避免重复的样式定义

❌ 错误示例：
```scss
.user-list .search-card { margin-bottom: 32px; }
.category-list .search-card { margin-bottom: 32px; }
.role-list .search-card { margin-bottom: 32px; }
```

✅ 正确示例：
```scss
// 在 layout.scss 中统一定义
.content-wrapper .search-card {
  margin-bottom: var(--spacing-xl);
}
```

## 文件组织

```
src/styles/
├── global.scss      # 全局样式和设计令牌
├── components.scss  # 组件样式
├── layout.scss      # 布局样式（本文档）
└── LAYOUT_GUIDE.md # 布局规范文档
```

## 维护说明

1. **新增页面时**：使用标准的布局结构和类名
2. **修改样式时**：优先在 `layout.scss` 中添加通用样式
3. **页面特定样式**：仅在必要时在页面组件中添加
4. **响应式调整**：统一在 `layout.scss` 中处理

## 检查清单

创建新页面时，请确保：

- [ ] 使用了 `page-container` 类
- [ ] 使用了 `content-wrapper` 包装内容
- [ ] 搜索区域使用了 `search-card` 类
- [ ] 表格区域使用了 `table-card` 类
- [ ] 所有间距使用了CSS变量
- [ ] 响应式设计已考虑
- [ ] 样式没有重复定义

