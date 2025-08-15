# 🚀 GitHub Pages 部署指南

## 📋 前置条件

1. 确保项目已经推送到GitHub仓库
2. 确保GitHub仓库已启用GitHub Pages功能
3. 确保GitHub Actions已启用
4. **重要**: 配置正确的仓库权限

## 🔧 自动部署（推荐）

### 1. 启用GitHub Pages

1. 进入你的GitHub仓库
2. 点击 `Settings` 标签页
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分选择 `GitHub Actions`
5. 保存设置

### 2. 配置仓库权限

**重要**: 如果遇到权限错误，请按以下步骤配置：

1. 进入仓库的 `Settings` 标签页
2. 在左侧菜单中找到 `Actions` > `General`
3. 在 `Workflow permissions` 部分：
   - 选择 `Read and write permissions`
   - 勾选 `Allow GitHub Actions to create and approve pull requests`
4. 保存设置

### 3. 推送代码触发部署

```bash
# 提交所有更改
git add .
git commit -m "🚀 部署更新"
git push origin main
```

推送后，GitHub Actions会自动：
- 构建项目
- 部署到GitHub Pages

### 4. 查看部署状态

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

### 1. 权限错误 (403 Forbidden)

**错误信息**: `Permission to [repo] denied to github-actions[bot]`

**解决方案**:
1. 进入仓库 `Settings` > `Actions` > `General`
2. 在 `Workflow permissions` 选择 `Read and write permissions`
3. 保存设置
4. 重新推送代码触发部署

### 2. 构建失败
- 检查 `package.json` 中的依赖是否正确
- 确保所有导入路径正确
- 查看GitHub Actions日志获取详细错误信息

### 3. 页面显示404
- 确保GitHub Pages已启用
- 检查部署分支是否正确
- 等待几分钟让部署生效

### 4. 样式或功能异常
- 检查构建输出是否正常
- 确保所有静态资源路径正确
- 查看浏览器控制台是否有错误

### 5. gh-pages分支不存在
- 这是正常现象，首次部署时会自动创建
- 如果持续失败，可以尝试使用备用部署配置

## 🔄 故障排除

### 方法1: 使用新的部署配置
当前配置使用了最新的GitHub Actions官方部署方式，应该能解决权限问题。

### 方法2: 使用备用配置
如果主配置仍有问题，可以：
1. 删除 `.github/workflows/deploy.yml`
2. 重命名 `deploy-fallback.yml` 为 `deploy.yml`
3. 推送代码重新部署

### 方法3: 手动创建gh-pages分支
```bash
# 在本地创建gh-pages分支
git checkout --orphan gh-pages
git rm -rf .
git commit --allow-empty -m "Initial gh-pages branch"
git push origin gh-pages

# 切回主分支
git checkout main
```

## 📚 相关资源

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Vite 构建配置](https://vitejs.dev/config/)
- [GitHub Actions 权限配置](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)

## 🎯 下一步

部署成功后，你可以：
1. 配置自定义域名
2. 设置环境变量
3. 配置CDN加速
4. 添加监控和分析
