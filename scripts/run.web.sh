  # 1. 停止并删除旧容器
  docker stop ai-prompt-web
  docker rm ai-prompt-web

  # 2. 删除旧镜像
  docker rmi ai-prompt-web:latest

  # 3. 重新构建
  docker build -f Dockerfile.web -t ai-prompt-web:latest .

  # 4. 运行新容器
  docker run -d \
    --name ai-prompt-web \
    -p 4001:4001 \
    ai-prompt-web:latest
