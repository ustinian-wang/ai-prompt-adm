# AI提示词收集系统 - 用户端

这是AI提示词收集系统的用户端管理后台，提供用户友好的界面来管理和收集AI提示词。

## 功能特性

- **用户认证**: 支持账号密码登录/注册
- **首页管理**: 根据登录状态显示不同内容（默认/已登录/详情）
- **提示词收集**: 浏览、搜索、筛选提示词
- **分组管理**: 新增、编辑、删除提示词分组
- **预览功能**: 查看提示词详情和使用效果
- **响应式设计**: 支持移动端和桌面端

## 页面结构

根据需求文档，系统包含以下页面：

### 1. 登录/注册页面 (`/login`)
- 参考设计稿：`client_login.png`
- 支持账号密码登录/注册
- 包含验证码功能

### 2. 首页 (`/`)
- **默认状态**: 未登录用户看到的欢迎页面
- **已登录状态**: 登录用户看到的个性化首页
- **详情状态**: 点击提示词进入的详情页面 (`/detail/:id`)

### 3. 收集页 (`/collect`)
- **默认状态**: 提示词列表展示，支持搜索和筛选
- **新增分组**: 创建新的提示词分组 (`/collect/add`)
- **我的收集**: 查看个人收集的提示词 (`/collect/my`)
- **预览**: 查看提示词详细内容 (`/collect/preview/:id`)

## 文件结构

```
client/
├── clientMain.js          # 用户端主入口文件
├── ClientApp.vue          # 用户端主应用组件
├── clientRouter.js        # 用户端路由配置
├── clientStore.js         # 用户端状态管理
├── modules/               # Vuex模块
│   ├── auth.js           # 认证模块
│   ├── user.js           # 用户模块
│   ├── works.js          # 作品模块
│   └── categories.js     # 分类模块
├── views/                 # 页面组件
│   ├── ClientLogin.vue   # 登录页面
│   ├── Index.vue         # 首页（三种状态）
│   ├── IndexDetail.vue   # 首页详情页面
│   ├── Collect.vue       # 收集首页
│   ├── CollectAdd.vue    # 新增分组
│   ├── CollectMy.vue     # 我的收集
│   └── CollectPreview.vue # 收集预览
└── README.md             # 说明文档
```

## 路由配置

```javascript
// 主要路由
/                    # 首页（根据登录状态显示不同内容）
/login               # 登录/注册页面
/collect             # 提示词收集页面
/collect/add         # 新增分组页面
/collect/my          # 我的收集页面
/collect/preview/:id # 收集预览页面
/detail/:id          # 首页详情页面
```

## 使用方法

### 1. 访问用户端

在浏览器中访问 `client.html` 即可进入用户端系统。

### 2. 登录/注册

- 首次使用需要注册账号
- 输入账号和验证码完成注册
- 后续可直接使用账号密码登录

### 3. 浏览提示词

- **首页**: 查看推荐提示词和快速操作
- **收集页**: 浏览所有提示词，支持分类筛选和搜索
- **详情页**: 点击提示词查看详细内容和相关推荐

### 4. 管理提示词

- **新增分组**: 创建新的提示词分组
- **我的收集**: 管理个人收集的提示词
- **编辑/删除**: 对个人提示词进行编辑和删除操作

## 技术架构

- **前端框架**: Vue.js 2.x
- **UI组件库**: Ant Design Vue
- **状态管理**: Vuex
- **路由管理**: Vue Router
- **样式**: SCSS

## 开发说明

### 添加新页面

1. 在 `views/` 目录下创建新的Vue组件
2. 在 `clientRouter.js` 中添加路由配置
3. 在 `clientStore.js` 中添加相关状态管理（如需要）

### 修改样式

- 全局样式在 `../src/styles/` 目录下
- 组件样式使用 `scoped` 属性隔离

### API集成

- 认证相关API在 `../src/api/authApi.js`
- 其他API可参考现有结构添加

## 设计稿对应

系统严格按照需求文档中的设计稿实现：

- `client_login.png` → `ClientLogin.vue`
- `client_index.png` → `Index.vue` (默认状态)
- `client_index_login.png` → `Index.vue` (已登录状态)
- `client_index_detail.png` → `IndexDetail.vue`
- `client_collect_index.png` → `Collect.vue` (默认状态)
- `client_collect_add.png` → `CollectAdd.vue`
- `client_collect_my.png` → `CollectMy.vue`
- `client_collect_preview.png` → `CollectPreview.vue`

## 注意事项

- 用户端和管理端使用不同的入口文件，避免冲突
- 认证状态独立管理，使用 `client_token` 和 `client_userInfo` 存储
- 响应式设计确保在不同设备上的良好体验
- 页面状态根据用户登录状态动态切换

## 部署

用户端系统可以独立部署，只需要确保：

1. 所有依赖文件正确引用
2. 后端API接口可访问
3. 静态资源路径正确配置
