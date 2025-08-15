# AI提示词管理系统

一个现代化的AI提示词管理系统，帮助用户高效地创建、组织、测试和分享AI提示词。

## 🚀 功能特性

- **用户管理**: 用户注册、登录、权限管理
- **作品管理**: 创建、编辑、分类管理AI作品
- **提示词配置**: 灵活的提示词参数设置
- **分类系统**: 多级分类管理
- **角色权限**: 细粒度的权限控制
- **响应式设计**: 支持PC端访问

## 🛠️ 技术栈

### 前端
- **Vue.js 2.7** - 渐进式JavaScript框架
- **Ant Design Vue** - 企业级UI组件库
- **Vuex** - 状态管理
- **Vue Router** - 路由管理
- **Vite** - 构建工具

### 后端
- **Node.js** - JavaScript运行时
- **Express** - Web应用框架
- **MySQL** - 关系型数据库
- **JWT** - 身份认证
- **bcryptjs** - 密码加密

### 部署
- **Docker** - 容器化部署
- **Docker Compose** - 多容器编排
- **Nginx** - 反向代理

## 📁 项目结构

```
ai-prompt-admin/
├── src/                    # 前端源码
│   ├── components/         # 公共组件
│   ├── views/             # 页面组件
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── api/               # API接口
│   └── utils/             # 工具函数
├── server/                 # 后端源码
│   ├── routes/            # 路由文件
│   ├── controllers/       # 控制器
│   ├── models/            # 数据模型
│   ├── middleware/        # 中间件
│   └── config/            # 配置文件
├── .cursor/               # Cursor配置
├── docker-compose.yml     # Docker编排
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js >= 14
- MySQL >= 8.0
- Docker & Docker Compose

### 1. 克隆项目
```bash
git clone <repository-url>
cd ai-prompt-admin
```

### 2. 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 3. 配置环境变量
```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量
vim .env
```

### 4. 启动开发环境
```bash
# 启动前端开发服务器
npm run dev

# 启动后端服务器
cd server
npm run dev
```

### 5. 使用Docker部署
```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 🔧 开发指南

### 前端开发
```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

### 后端开发
```bash
cd server

# 启动开发服务器
npm run dev

# 运行测试
npm test
```

## 📊 数据库设计

### 主要数据表
- **users** - 用户表
- **roles** - 角色表
- **categories** - 分类表
- **works** - 作品表
- **prompts** - 提示词表

### 默认账号
- **管理员**: admin / admin123
- **普通用户**: 需要注册

## 🌐 API接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/logout` - 用户登出

### 用户管理
- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

### 作品管理
- `GET /api/works` - 获取作品列表
- `POST /api/works` - 创建作品
- `PUT /api/works/:id` - 更新作品
- `DELETE /api/works/:id` - 删除作品

## 🔒 安全特性

- JWT身份认证
- 密码加密存储
- 请求频率限制
- CORS跨域保护
- SQL注入防护

## 📱 界面预览

- **登录页面**: 现代化的登录界面
- **主控制台**: 左侧菜单 + 右侧内容
- **响应式设计**: 支持不同屏幕尺寸

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者: [Your Name]
- 邮箱: [your.email@example.com]
- 项目地址: [https://github.com/yourusername/ai-prompt-admin]

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！
