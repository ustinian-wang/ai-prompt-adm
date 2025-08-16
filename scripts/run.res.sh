  # 1. 停止并删除旧容器
  docker stop ai-prompt-res
  docker rm ai-prompt-res

  # 2. 删除旧镜像
  docker rmi ai-prompt-res:latest

  # 3. 重新构建
  docker build -f Dockerfile.res -t ai-prompt-res:latest .

  # 4. 运行新容器
  docker run -d \
    --name ai-prompt-res \
    -p 4001:4001 \
    ai-prompt-res:latest
