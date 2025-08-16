# 前端项目Dockerfile
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./
COPY yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN yarn build:production

# 验证构建产物
RUN echo "=== 构建产物验证 ===" && \
    ls -la /app/ && \
    echo "=== dist目录内容 ===" && \
    ls -la /app/dist/ && \
    echo "=== 检查index.html ===" && \
    test -f /app/dist/index.html && echo "index.html 存在" || echo "index.html 不存在" && \
    echo "=== 检查assets目录 ===" && \
    ls -la /app/dist/assets/ || echo "assets目录不存在"

# 生产阶段
FROM nginx:alpine

# 复制构建产物到nginx目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 验证nginx目录
RUN echo "=== Nginx目录验证 ===" && \
    ls -la /usr/share/nginx/html/ && \
    echo "=== 检查index.html ===" && \
    test -f /usr/share/nginx/html/index.html && echo "index.html 存在" || echo "index.html 不存在"

# 复制nginx配置
COPY nginx.res.conf /etc/nginx/nginx.conf

# 测试nginx配置
RUN nginx -t

# 暴露端口
EXPOSE 4001

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
