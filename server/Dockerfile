# 后端项目Dockerfile
FROM node:18-alpine

# 安装PM2和必要的工具
RUN npm install -g pm2@latest && \
    apk add --no-cache dumb-init

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./
COPY yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile --production

# 复制源代码
COPY . .

# 创建必要的目录
RUN mkdir -p uploads logs

# 复制PM2配置文件
COPY ecosystem.config.js ./

# 设置权限
RUN chmod +x /app/ecosystem.config.js

# 暴露端口
EXPOSE 4002

# 使用dumb-init作为PID1进程，启动PM2
ENTRYPOINT ["dumb-init", "--"]
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
