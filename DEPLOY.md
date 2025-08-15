# 🚀 GitHub Pages 部署指南

## 📋 前置条件

1. 确保项目已经推送到GitHub仓库
2. 确保GitHub仓库已启用GitHub Pages功能
3. 确保GitHub Actions已启用

## 🔧 自动部署（推荐）

### 1. 启用GitHub Pages

1. 进入你的GitHub仓库
2. 点击 `Settings` 标签页
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分选择 `GitHub Actions`
5. 保存设置

### 2. 推送代码触发部署

```bash
# 提交所有更改
git add .
git commit -m "🚀 部署更新"
git push origin main
```

推送后，GitHub Actions会自动：
- 构建项目
- 部署到GitHub Pages

### 3. 查看部署状态

1. 进入仓库的 `Actions` 标签页
2. 查看最新的工作流运行状态
3. 部署成功后，可以在 `Settings > Pages` 中看到部署的URL

## 🛠️ 手动部署

### 使用部署脚本

#### Linux/Mac
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Windows
```cmd
deploy.bat
```

### 手动步骤

1. 构建项目
```bash
yarn build
```

2. 提交更改
```bash
git add .
git commit -m "🚀 手动部署"
git push origin main
```

## 🌐 访问你的应用

部署成功后，你的应用将在以下地址可用：
```
https://[你的用户名].github.io/[仓库名]/
```

## 🔍 常见问题

### 1. 构建失败
- 检查 `package.json` 中的依赖是否正确
- 确保所有导入路径正确
- 查看GitHub Actions日志获取详细错误信息

### 2. 页面显示404
- 确保GitHub Pages已启用
- 检查部署分支是否正确
- 等待几分钟让部署生效

### 3. 样式或功能异常
- 检查构建输出是否正常
- 确保所有静态资源路径正确
- 查看浏览器控制台是否有错误

## 📚 相关资源

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Vite 构建配置](https://vitejs.dev/config/)

## 🎯 下一步

部署成功后，你可以：
1. 配置自定义域名
2. 设置环境变量
3. 配置CDN加速
4. 添加监控和分析
