#!/bin/bash

echo "=== 测试Assets访问 ==="

# 获取容器IP
CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ai-prompt-res)
echo "容器IP: $CONTAINER_IP"

# 测试index.html访问
echo "1. 测试index.html访问..."
curl -s -o /dev/null -w "index.html: %{http_code}\n" http://localhost:4001/

# 测试assets目录访问
echo "2. 测试assets目录访问..."
curl -s -o /dev/null -w "assets目录: %{http_code}\n" http://localhost:4001/assets/

# 获取assets目录下的文件列表
echo "3. 获取assets目录内容..."
docker exec ai-prompt-res ls -la /usr/share/nginx/html/assets/ 2>/dev/null || echo "assets目录不存在"

# 测试具体的JS文件访问
echo "4. 测试JS文件访问..."
JS_FILE=$(docker exec ai-prompt-res find /usr/share/nginx/html/assets/ -name "*.js" | head -1)
if [ -n "$JS_FILE" ]; then
    JS_PATH=$(echo $JS_FILE | sed 's|/usr/share/nginx/html||')
    echo "测试JS文件: $JS_PATH"
    curl -s -o /dev/null -w "JS文件: %{http_code}\n" "http://localhost:4001$JS_PATH"
else
    echo "未找到JS文件"
fi

# 测试具体的CSS文件访问
echo "5. 测试CSS文件访问..."
CSS_FILE=$(docker exec ai-prompt-res find /usr/share/nginx/html/assets/ -name "*.css" | head -1)
if [ -n "$CSS_FILE" ]; then
    CSS_PATH=$(echo $CSS_FILE | sed 's|/usr/share/nginx/html||')
    echo "测试CSS文件: $CSS_PATH"
    curl -s -o /dev/null -w "CSS文件: %{http_code}\n" "http://localhost:4001$CSS_PATH"
else
    echo "未找到CSS文件"
fi

# 检查nginx日志
echo "6. 检查nginx错误日志..."
docker exec ai-prompt-res tail -10 /var/log/nginx/error.log 2>/dev/null || echo "错误日志不存在"

echo "=== 测试完成 ==="
