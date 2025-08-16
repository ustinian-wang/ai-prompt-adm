# 数据持久化配置说明

## 概述
本项目已配置数据持久化，确保在Docker容器重启或重建后，重要数据不会丢失。

## 数据目录结构
```
server/
├── data/                    # 数据文件目录（持久化）
│   ├── __tmp__users.json   # 用户数据
│   └── __tmp__works.json   # 作品数据
├── uploads/                 # 上传文件目录（持久化）
└── logs/                    # 日志目录（持久化）
```

## Docker卷映射配置
在`docker-compose.yml`中，以下目录被映射到宿主机：

```yaml
volumes:
  - ./server/uploads:/app/uploads  # 上传文件持久化
  - ./logs/web:/app/logs          # 后端日志持久化
  - ./logs/pm2:/app/.pm2          # PM2日志持久化
  - ./server/data:/app/data       # 数据文件持久化
```

## 数据文件说明
- `__tmp__users.json`: 存储用户信息，包括用户名、密码哈希、角色等
- `__tmp__works.json`: 存储作品信息，包括作品名称、提示词、图片路径等

## 注意事项
1. 数据文件存储在`server/data/`目录中，该目录会被映射到容器内的`/app/data`
2. 容器重启或重建后，数据文件会保持完整
3. 如果需要备份数据，可以直接复制`server/data/`目录
4. 确保宿主机上的`server/data/`目录有适当的读写权限

## 服务配置
服务文件中的文件路径已更新为：
- `users.service.js`: `data/__tmp__users.json`
- `works.service.js`: `data/__tmp__works.json`

## 部署建议
1. 在生产环境中，建议定期备份`server/data/`目录
2. 可以考虑使用外部存储服务（如云存储）来进一步保护数据
3. 监控数据目录的磁盘空间使用情况
