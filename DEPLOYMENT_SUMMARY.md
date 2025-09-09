# 部署配置更改总结

## 概述

本次更新成功将 `client/` 目录集成到部署流程中，实现了多入口应用构建和部署。

## 主要更改

### 1. Vite 配置更新 (vite.config.js)

**更改内容：**
- 添加了多入口构建配置
- 支持主应用 (`index.html`) 和客户端应用 (`client.html`)

**具体更改：**
```javascript
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),      // 主应用入口
      client: resolve(__dirname, 'client.html')    // 客户端应用入口
    }
  }
}
```

### 2. Dockerfile.res 更新

**更改内容：**
- 修改构建命令从 `yarn build:production` 到 `yarn build`
- 添加了对 `client.html` 的验证
- 确保 client 目录被正确包含在构建中

**具体更改：**
```dockerfile
# 构建项目（多入口构建）
RUN yarn build

# 验证构建产物
RUN echo "=== 检查client.html ===" && \
    test -f /app/dist/client.html && echo "client.html 存在" || echo "client.html 不存在"
```

### 3. Nginx 配置更新 (nginx.res.conf)

**更改内容：**
- 添加了 `/client` 路径的特殊处理
- 支持客户端应用的独立路由

**具体更改：**
```nginx
# 客户端应用入口点
location /client {
    alias /usr/share/nginx/html;
    try_files $uri $uri/ /client.html;
}
```

### 4. 新增文件

**构建脚本：**
- `scripts/build-and-deploy.sh` - 自动化构建和部署脚本

**文档：**
- `CLIENT_DEPLOYMENT.md` - 详细的客户端部署说明
- `DEPLOYMENT_SUMMARY.md` - 本次更改总结

## 构建验证

### 构建产物

成功构建后，`dist/` 目录包含：
- ✅ `index.html` - 主应用入口 (4.26 kB)
- ✅ `client.html` - 客户端应用入口 (4.28 kB)
- ✅ `assets/` - 共享静态资源目录

### 客户端应用资源

构建产物中包含的客户端应用文件：
- `client-b51e8b55.css` - 客户端应用样式
- `client-cec9177a.js` - 客户端应用脚本
- `ClientLogin-2e41a444.js` - 客户端登录页面脚本
- `ClientLogin-cef524a4.css` - 客户端登录页面样式

## 访问路径

部署后的访问路径：
- **主应用**: `http://localhost:4001/` 或 `http://your-domain:4001/`
- **客户端应用**: `http://localhost:4001/client` 或 `http://your-domain:4001/client`

## 部署流程

### 1. 本地构建测试
```bash
yarn install
yarn build
```

### 2. 验证构建产物
```bash
ls -la dist/
# 应该看到: index.html, client.html, assets/
```

### 3. Docker 部署
```bash
docker build -f Dockerfile.res -t ai-prompt-admin .
docker run -p 4001:4001 ai-prompt-admin
```

## 技术特点

### 多入口构建
- 使用 Vite 的 `rollupOptions.input` 配置
- 两个应用共享相同的依赖和配置
- 静态资源自动优化和代码分割

### 路由配置
- 主应用使用根路径 `/`
- 客户端应用使用 `/client` 路径
- Nginx 配置确保正确的路由分发

### 资源优化
- CSS 和 JS 文件自动压缩
- 静态资源长期缓存
- Gzip 压缩支持

## 注意事项

1. **依赖共享**: 客户端应用共享根目录的所有依赖
2. **构建顺序**: 确保先构建再部署
3. **路径配置**: 客户端应用的路由配置在 `clientRouter.js` 中
4. **静态资源**: 两个应用共享 `assets/` 目录

## 故障排除

### 常见问题
1. **构建失败**: 检查依赖安装和 client 目录完整性
2. **404 错误**: 确认 nginx 配置和构建产物
3. **资源加载失败**: 检查 assets 目录和文件权限

### 调试方法
1. 查看构建日志
2. 检查 nginx 错误日志
3. 验证构建产物完整性
4. 测试本地构建

## 总结

本次更新成功实现了：
- ✅ 多入口应用构建
- ✅ 客户端应用集成
- ✅ Docker 部署支持
- ✅ Nginx 路由配置
- ✅ 自动化构建脚本
- ✅ 完整的部署文档

现在可以成功部署包含主应用和客户端应用的完整系统。



