# 客户端应用部署说明

## 概述

本项目现在支持多入口构建，包括：
- 主应用 (管理后台) - 访问路径: `/`
- 客户端应用 - 访问路径: `/client`

## 构建配置

### Vite 配置 (vite.config.js)

已配置多入口构建：
```javascript
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),      // 主应用
      client: resolve(__dirname, 'client.html')    // 客户端应用
    }
  }
}
```

### 构建产物

构建后会在 `dist/` 目录生成：
- `index.html` - 主应用入口
- `client.html` - 客户端应用入口
- `assets/` - 共享的静态资源

## 部署流程

### 1. 本地构建测试

```bash
# 安装依赖
yarn install

# 构建项目
yarn build

# 验证构建产物
ls -la dist/
# 应该看到: index.html, client.html, assets/
```

### 2. Docker 部署

```bash
# 构建 Docker 镜像
docker build -f Dockerfile.res -t ai-prompt-admin .

# 运行容器
docker run -p 4001:4001 ai-prompt-admin
```

### 3. 访问应用

- 主应用: `http://localhost:4001/`
- 客户端应用: `http://localhost:4001/client`

## Nginx 配置

nginx.res.conf 已配置支持两个入口点：

```nginx
# 客户端应用入口点
location /client {
    alias /usr/share/nginx/html;
    try_files $uri $uri/ /client.html;
}

# 主应用入口点
location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}
```

## 文件结构

```
client/
├── ClientApp.vue          # 客户端应用主组件
├── clientMain.js          # 客户端应用入口文件
├── clientRouter.js        # 客户端路由配置
├── clientStore.js         # 客户端状态管理
├── views/                 # 客户端页面组件
│   ├── Index.vue
│   ├── Collect.vue
│   ├── ClientLogin.vue
│   └── ...
└── modules/               # 客户端模块
    ├── auth.js
    ├── categories.js
    ├── user.js
    └── works.js
```

## 依赖关系

客户端应用共享根目录的依赖：
- Vue 2.x
- Ant Design Vue
- Vue Router
- Vuex
- 样式文件

## 构建脚本

使用提供的构建脚本：

```bash
# 运行构建和部署脚本
./scripts/build-and-deploy.sh
```

## 注意事项

1. 确保 `client.html` 文件存在于项目根目录
2. 客户端应用的路由配置在 `clientRouter.js` 中
3. 构建时会自动包含 client 目录的所有文件
4. 静态资源会被优化和压缩
5. 两个应用共享相同的 API 配置

## 故障排除

### 构建失败
- 检查依赖是否正确安装
- 确认 client 目录结构完整
- 查看构建日志中的错误信息

### 访问 404
- 确认 nginx 配置正确
- 检查构建产物是否完整
- 验证文件权限设置

### 静态资源加载失败
- 检查 assets 目录是否正确生成
- 确认 nginx 静态资源配置
- 验证文件路径是否正确



