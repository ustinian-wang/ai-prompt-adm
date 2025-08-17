# AI Prompt Admin 部署指南

## 概述

本指南介绍如何使用Docker部署AI Prompt Admin应用，包括数据库初始化、数据持久化和备份恢复功能。**脚本设计为可重复执行，不会丢失现有数据。**

## 部署脚本

### 1. 基础部署脚本 (`scripts/run.web.sh`)

**智能部署脚本，可重复执行：**
- Docker镜像构建
- 容器启动
- 数据卷映射
- **智能数据库初始化（首次部署创建默认账号，重复执行只更新）**
- **数据安全保护（不会覆盖现有数据）**

**使用方法：**
```bash
cd scripts
./run.web.sh
```

**安全特性：**
- ✅ 首次部署：自动创建默认管理员账号 (admin/123456)
- ✅ 重复部署：保留所有现有数据，只进行必要更新
- ✅ 数据检测：自动识别新/旧数据库，采用不同策略
- ✅ 权限保护：确保数据目录权限正确设置

### 2. 数据库安全性测试脚本 (`scripts/test-db-safety.sh`)

**验证数据库初始化安全性的测试脚本：**
- 检查数据库文件状态
- 验证数据库连接
- 检查数据完整性
- 测试重复执行安全性
- 验证文件权限

**使用方法：**
```bash
cd scripts
./test-db-safety.sh
```

## 数据持久化

### 目录结构

应用使用以下目录进行数据持久化：

```
/var/lib/ai-prompt-web/
├── database/           # SQLite数据库文件
├── cache/             # 缓存文件
├── uploads/           # 上传文件
│   ├── images/        # 图片文件
│   ├── thumbnails/    # 缩略图
│   ├── documents/     # 文档文件
│   └── temp/          # 临时文件
└── logs/              # 应用日志

/var/log/ai-prompt-web/    # 系统日志
/etc/ai-prompt-web/        # 配置文件
```

### Docker卷映射

```yaml
volumes:
  - /var/lib/ai-prompt-web:/app/data          # 主数据目录
  - /var/log/ai-prompt-web:/app/data/logs     # 日志目录
  - /etc/ai-prompt-web:/app/config            # 配置目录
  - /var/lib/ai-prompt-web/database:/app/data/database    # 数据库文件
  - /var/lib/ai-prompt-web/uploads:/app/data/uploads      # 上传文件
  - /var/lib/ai-prompt-web/cache:/app/data/cache          # 缓存文件
```

## 数据库管理

### SQLite数据库

- **位置**: `/var/lib/ai-prompt-web/database/database.sqlite`
- **类型**: SQLite3
- **自动初始化**: 容器启动时智能创建表和导入种子数据

### 智能数据初始化

**首次部署时：**
- 自动创建数据库表结构
- 插入默认分类（AI写作、AI绘画、AI编程、AI对话）
- 创建默认管理员账号：`admin` / `123456`
- 创建示例作品

**重复部署时：**
- 检测现有数据，跳过重复插入
- 只进行必要的数据库结构更新
- 保留所有用户数据、作品和配置

### 默认账号信息

```
用户名: admin
密码: 123456
邮箱: admin@example.com
角色: admin
状态: active
```

**⚠️ 安全提醒：首次登录后请立即修改默认密码！**

## 部署流程

### 1. 环境准备

确保系统已安装：
- Docker
- Git
- 足够的磁盘空间

### 2. 获取代码

```bash
git clone <repository-url>
cd ai-prompt-adm
```

### 3. 部署应用

```bash
# 使用智能部署脚本（推荐）
cd scripts
./run.web.sh
```

**脚本特点：**
- 🚀 一键部署，自动处理所有配置
- 🔒 数据安全，可重复执行
- 📊 智能检测，避免重复操作
- 🔑 自动创建默认账号

### 4. 验证部署

- 检查容器状态：`docker ps`
- 访问应用：`http://localhost:4002`
- 检查健康状态：`http://localhost:4002/health`
- 测试数据库安全性：`./test-db-safety.sh`

### 5. 首次登录

1. 访问 `http://localhost:4002/login`
2. 使用默认账号登录：`admin` / `123456`
3. **立即修改默认密码**
4. 开始使用系统

## 重复部署

### 安全特性

**脚本可以安全地重复执行：**
- ✅ 不会丢失现有数据
- ✅ 不会重复创建用户账号
- ✅ 不会覆盖用户作品
- ✅ 只进行必要的更新

**适用场景：**
- 应用更新部署
- 服务器重启后重新部署
- 配置修改后重新部署
- 定期维护部署

### 重复部署流程

```bash
# 1. 拉取最新代码
git pull

# 2. 重新部署（安全）
./run.web.sh

# 3. 验证数据完整性
./test-db-safety.sh
```

## 故障排除

### 常见问题

1. **容器启动失败**
   ```bash
   # 查看容器日志
   docker logs ai-prompt-web
   
   # 检查端口占用
   netstat -tlnp | grep 4002
   ```

2. **数据库连接失败**
   ```bash
   # 检查数据库文件权限
   ls -la /var/lib/ai-prompt-web/database/
   
   # 检查容器内数据库状态
   docker exec ai-prompt-web ls -la /app/data/database/
   ```

3. **数据丢失**
   ```bash
   # 检查数据库文件
   ls -la /var/lib/ai-prompt-web/database/
   
   # 运行安全性测试
   ./test-db-safety.sh
   ```

### 日志查看

```bash
# 应用日志
docker logs ai-prompt-web

# 系统日志
tail -f /var/log/ai-prompt-web/app.log

# 实时日志
docker logs -f ai-prompt-web
```

## 维护操作

### 定期检查

建议定期运行安全性测试：

```bash
# 每周检查一次
0 2 * * 1 /path/to/ai-prompt-adm/scripts/test-db-safety.sh
```

### 数据备份

虽然脚本设计为安全，但建议定期备份：

```bash
# 备份数据库文件
cp /var/lib/ai-prompt-web/database/database.sqlite /backup/db_$(date +%Y%m%d).sqlite
```

### 更新应用

```bash
# 拉取最新代码
git pull

# 重新部署（安全）
./run.web.sh

# 验证部署
./test-db-safety.sh
```

## 安全注意事项

1. **文件权限**: 确保数据目录权限设置正确
2. **网络安全**: 生产环境建议使用反向代理和HTTPS
3. **密码安全**: 首次登录后立即修改默认密码
4. **访问控制**: 限制对数据目录的直接访问
5. **定期更新**: 保持应用和依赖包的最新版本

## 性能优化

1. **数据库优化**: 定期执行VACUUM操作
2. **缓存策略**: 配置适当的缓存策略
3. **日志轮转**: 设置日志文件轮转避免磁盘空间不足

## 联系支持

如遇到问题，请：
1. 查看应用日志
2. 运行安全性测试脚本
3. 检查系统资源使用情况
4. 参考故障排除部分
5. 联系技术支持团队

## 更新日志

### v2.0.0 (当前版本)
- ✨ 新增智能数据库初始化
- 🔒 支持重复执行，数据安全保护
- 🧪 新增数据库安全性测试脚本
- 📚 完善部署文档和指南
- 🚀 优化部署流程和错误处理
