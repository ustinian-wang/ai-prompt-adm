# Quill.js 富文本编辑器使用说明

## 🎯 功能概述

本项目已集成 Quill.js 富文本编辑器，替换原有的自定义富文本编辑器，提供更专业、更稳定的编辑体验。

## ✨ 主要特性

### 1. **核心功能**
- 富文本编辑（粗体、斜体、下划线）
- 图片上传和插入
- 撤销/重做操作
- 内容变化检测
- 自动保存提示

### 2. **图片上传**
- 支持 JPG、PNG、GIF、WebP 格式
- 最大文件大小：5MB
- 自动上传到服务器
- 插入到编辑器当前光标位置

### 3. **用户体验**
- 简洁的工具栏界面
- 实时内容变化提示
- 响应式设计
- 与现有图片上传工具完美集成

## 🚀 使用方法

### 1. 安装依赖

```bash
npm install quill@^1.3.7
# 或者
yarn add quill@^1.3.7
```

### 2. 在组件中使用

```vue
<template>
  <div>
    <QuillEditor
      v-model="content"
      :height="'500px'"
      placeholder="请输入内容..."
      @change="handleContentChange"
      @save="handleSave"
    />
  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor.vue'

export default {
  components: {
    QuillEditor
  },
  data() {
    return {
      content: '<p>初始内容</p>'
    }
  },
  methods: {
    handleContentChange(html) {
      console.log('内容变化:', html)
    },
    handleSave(html) {
      console.log('保存内容:', html)
      // 保存到后端
    }
  }
}
</script>
```

### 3. 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | String | `''` | 编辑器内容（支持v-model） |
| `placeholder` | String | `'请输入内容...'` | 占位符文本 |
| `height` | String | `'400px'` | 编辑器高度 |

### 4. 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `input` | `html` | 内容变化时触发 |
| `change` | `html` | 内容变化时触发 |
| `save` | `html` | 点击保存按钮时触发 |

## 🔧 API 方法

### 获取内容
```javascript
// 获取HTML内容
const html = this.$refs.quillEditor.getContent()

// 获取纯文本内容
const text = this.$refs.quillEditor.quill.getText()
```

### 设置内容
```javascript
// 设置HTML内容
this.$refs.quillEditor.setContent('<p>新内容</p>')

// 清空内容
this.$refs.quillEditor.quill.setText('')
```

### 格式化文本
```javascript
// 粗体
this.$refs.quillEditor.formatText('bold')

// 斜体
this.$refs.quillEditor.formatText('italic')

// 下划线
this.$refs.quillEditor.formatText('underline')
```

## 🖼️ 图片上传

### 1. 自动集成
编辑器已自动集成现有的图片上传工具，无需额外配置。

### 2. 上传流程
1. 点击工具栏图片按钮
2. 选择本地图片文件
3. 自动验证文件类型和大小
4. 上传到服务器
5. 获取图片URL
6. 插入到编辑器

### 3. 自定义上传
```javascript
// 如果需要自定义上传逻辑
async customImageUpload({ file, onSuccess, onError }) {
  try {
    // 自定义上传逻辑
    const imageUrl = await yourUploadFunction(file)
    
    // 插入图片
    if (this.quill) {
      const range = this.quill.getSelection()
      this.quill.insertEmbed(range.index, 'image', imageUrl)
    }
    
    onSuccess()
  } catch (error) {
    onError(error)
  }
}
```

## 🎨 样式定制

### 1. 工具栏样式
```scss
.editor-toolbar {
  background: #fafafa;
  border-bottom: 1px solid #d9d9d9;
  
  .ant-btn {
    &:hover {
      border-color: #1890ff;
      color: #1890ff;
    }
  }
}
```

### 2. 编辑器内容样式
```scss
.ql-editor {
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
}
```

## 🔍 与其他编辑器对比

| 特性 | Quill.js | TinyMCE | CKEditor 5 | 自定义编辑器 |
|------|----------|---------|------------|-------------|
| 文件大小 | ~40KB | ~300KB | ~200KB | 自定义 |
| 学习曲线 | 简单 | 中等 | 中等 | 简单 |
| 定制性 | 高 | 很高 | 很高 | 完全自定义 |
| 稳定性 | 很好 | 很好 | 很好 | 一般 |
| 社区支持 | 好 | 很好 | 好 | 无 |
| 图片上传 | 原生支持 | 插件支持 | 原生支持 | 自定义实现 |

## 📱 响应式支持

编辑器已内置响应式设计，支持移动端和桌面端：

```scss
@media (max-width: 768px) {
  .quill-editor-container {
    .editor-toolbar {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
```

## 🚨 注意事项

### 1. **依赖要求**
- Vue 2.x
- Ant Design Vue
- Quill.js 1.3.7+

### 2. **浏览器兼容性**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 3. **性能优化**
- 编辑器内容变化时自动检测
- 历史记录限制为500步
- 延迟2秒保存历史记录

### 4. **安全考虑**
- 图片文件类型验证
- 文件大小限制
- XSS防护（Quill.js内置）

## 🔄 迁移指南

### 从自定义编辑器迁移

1. **替换组件**
```vue
<!-- 旧版本 -->
<div ref="editorContent" class="editor-content" contenteditable="true"></div>

<!-- 新版本 -->
<QuillEditor v-model="content" />
```

2. **更新方法调用**
```javascript
// 旧版本
this.$refs.editorContent.innerHTML = content

// 新版本
this.$refs.quillEditor.setContent(content)
```

3. **事件处理**
```javascript
// 旧版本
@input="handleEditorInput"

// 新版本
@change="handleContentChange"
```

## 📚 扩展功能

### 1. 添加更多格式选项
```javascript
// 在 QuillEditor.vue 中添加
<a-button @click="formatText('align', 'center')" title="居中对齐">
  <a-icon type="align-center" />
</a-button>
```

### 2. 自定义工具栏
```javascript
// 可以完全自定义工具栏布局和功能
<div class="custom-toolbar">
  <!-- 自定义按钮和控件 -->
</div>
```

### 3. 主题定制
```scss
// 支持多种主题
.quill-editor-container {
  &.dark-theme {
    background: #1f1f1f;
    color: #ffffff;
  }
  
  &.minimal-theme {
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
```

## 🎉 总结

Quill.js 编辑器提供了：
- **更好的稳定性**：成熟的第三方库，经过大量项目验证
- **更丰富的功能**：内置图片上传、历史记录、格式化等
- **更好的维护性**：活跃的社区支持，定期更新
- **更专业的体验**：类似 Word 的编辑体验

建议在生产环境中使用 Quill.js 替换自定义编辑器，以获得更好的用户体验和开发效率。
