@echo off
echo === 静态资源调试脚本 ===

REM 检查容器状态
echo 1. 检查容器状态...
docker-compose ps

REM 检查前端容器日志
echo 2. 检查前端容器日志...
docker logs ai-prompt-res --tail 30

REM 进入容器检查文件结构
echo 3. 检查容器内文件结构...
docker exec ai-prompt-res sh -c "echo '=== 根目录 ===' && ls -la /usr/share/nginx/html/ && echo '=== assets目录 ===' && ls -la /usr/share/nginx/html/assets/ 2>/dev/null || echo 'assets目录不存在' && echo '=== 检查index.html内容 ===' && head -20 /usr/share/nginx/html/index.html"

REM 检查nginx配置
echo 4. 检查nginx配置...
docker exec ai-prompt-res nginx -t

REM 测试静态资源访问
echo 5. 测试静态资源访问...
echo 测试JS文件访问...
docker exec ai-prompt-res sh -c "if [ -f /usr/share/nginx/html/assets/index-*.js ]; then echo 'JS文件存在:' && ls -la /usr/share/nginx/html/assets/index-*.js; else echo 'JS文件不存在'; fi"

echo 测试CSS文件访问...
docker exec ai-prompt-res sh -c "if [ -f /usr/share/nginx/html/assets/index-*.css ]; then echo 'CSS文件存在:' && ls -la /usr/share/nginx/html/assets/index-*.css; else echo 'CSS文件不存在'; fi"

REM 检查nginx访问日志
echo 6. 检查nginx访问日志...
docker exec ai-prompt-res tail -20 /var/log/nginx/access.log 2>/dev/null || echo 访问日志不存在

REM 检查nginx错误日志
echo 7. 检查nginx错误日志...
docker exec ai-prompt-res tail -20 /var/log/nginx/error.log 2>/dev/null || echo 错误日志不存在

echo === 调试完成 ===
pause
