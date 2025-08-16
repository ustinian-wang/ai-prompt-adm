# 富文本编辑器图片上传功能使用说明

## 功能概述

本项目已实现富文本编辑器的图片上传功能，支持点击工具栏图片按钮选择图片文件，自动上传到服务器并插入到编辑器中。

## 使用方法

### 1. 在富文本编辑器中插入图片

1. 点击工具栏的图片按钮（📷）
2. 选择本地图片文件（支持JPG、PNG、GIF、WebP格式）
3. 图片自动上传到服务器
4. 上传成功后自动插入到编辑器当前光标位置

### 2. 代码调用示例

```javascript
import { uploadRichTextImage, createImageHtml } from '@/utils/imageUpload'

// 上传图片并获取URL
const imageUrl = await uploadRichTextImage(imageFile, {
  userId: 'user123',
  workId: 'work456'
})

// 创建图片HTML标签
const imgHtml = createImageHtml(imageUrl, {
  alt: '图片描述',
  width: '300px',
  height: '200px',
  align: 'center'
})

// 插入到编辑器
this.execCommand('insertHTML', imgHtml)
```

## API接口说明

### uploadRichTextImage(imageFile, uploadParams)

**参数：**
- `imageFile`: File对象，要上传的图片文件
- `uploadParams`: 对象，上传参数（如userId、workId等）

**返回值：**
- Promise<string>，返回图片的URL地址

**示例：**
```javascript
try {
  const imageUrl = await uploadRichTextImage(file, {
    userId: this.userId,
    workId: this.workId
  })
  console.log('图片URL:', imageUrl)
} catch (error) {
  console.error('上传失败:', error.message)
}
```

### createImageHtml(imageUrl, options)

**参数：**
- `imageUrl`: 字符串，图片URL地址
- `options`: 对象，图片属性选项
  - `alt`: 图片描述文本
  - `width`: 图片宽度
  - `height`: 图片高度
  - `align`: 对齐方式（'left'|'center'|'right'）
  - `className`: CSS类名
  - `style`: 自定义样式

**返回值：**
- 字符串，图片的HTML标签

**示例：**
```javascript
const imgHtml = createImageHtml('https://example.com/image.jpg', {
  alt: '示例图片',
  width: '400px',
  align: 'center'
})
// 输出: <img src="https://example.com/image.jpg" alt="示例图片" style="max-width: 100%; height: auto; width: 400px; display: block; margin: 0 auto;" class="" />
```

## 文件格式支持

- **JPG/JPEG**: 常用图片格式
- **PNG**: 支持透明背景
- **GIF**: 支持动画
- **WebP**: 现代高效格式

## 文件大小限制

- 富文本编辑器图片：最大5MB
- 作品参考图：最大5MB
- 用户头像：最大2MB

## 错误处理

```javascript
try {
  const imageUrl = await uploadRichTextImage(file, params)
  // 上传成功
} catch (error) {
  // 处理错误
  if (error.message.includes('文件类型')) {
    this.$message.error('请选择正确的图片格式')
  } else if (error.message.includes('文件大小')) {
    this.$message.error('图片文件过大')
  } else {
    this.$message.error('上传失败，请重试')
  }
}
```

## 高级功能

### 图片压缩

```javascript
import { compressImage } from '@/utils/imageUpload'

// 压缩图片
const compressedBlob = await compressImage(file, {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8
})

// 将Blob转换为File对象
const compressedFile = new File([compressedBlob], file.name, {
  type: 'image/jpeg'
})
```

### 自定义上传参数

```javascript
// 上传作品图片
const imageUrl = await uploadWorkImage(file, {
  userId: 'user123',
  workId: 'work456',
  category: 'design'
})

// 上传用户头像
const avatarUrl = await uploadAvatar(file, 'user123')
```

## 注意事项

1. **网络要求**: 需要稳定的网络连接
2. **文件验证**: 自动验证文件类型和大小
3. **错误处理**: 建议添加try-catch错误处理
4. **用户体验**: 上传过程中显示loading状态
5. **清理资源**: 及时清理临时DOM元素

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 更新日志

- **v1.0.0**: 基础图片上传功能
- **v1.1.0**: 添加图片压缩和优化
- **v1.2.0**: 支持多种上传场景
- **v1.3.0**: 完善错误处理和用户体验
