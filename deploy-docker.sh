#!/bin/bash

# Docker部署脚本 - 适配MySQL数据库
# 使用方法: ./deploy-docker.sh [build|start|stop|restart|logs|clean]

set -e

# 配置变量
IMAGE_NAME="ai-prompt-admin-backend"
CONTAINER_NAME="ai-prompt-admin-backend"
PORT=54321
DB_HOST="42.193.243.30"
DB_PORT=3306
DB_USER="root"
DB_PASSWORD="fai@508"
DB_NAME="ai_prompt_admin"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Docker是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker未运行，请先启动Docker"
        exit 1
    fi
    log_success "Docker运行正常"
}

# 构建镜像
build_image() {
    log_info "开始构建Docker镜像..."
    
    # 检查后端目录
    if [ ! -d "server" ]; then
        log_error "server目录不存在，请确保在项目根目录执行"
        exit 1
    fi
    
    # 复制Dockerfile到server目录
    cp Dockerfile.web server/
    
    # 构建镜像
    cd server
    docker build -f Dockerfile.web -t $IMAGE_NAME:latest .
    
    if [ $? -eq 0 ]; then
        log_success "镜像构建成功: $IMAGE_NAME:latest"
    else
        log_error "镜像构建失败"
        exit 1
    fi
    
    cd ..
}

# 启动容器
start_container() {
    log_info "启动容器..."
    
    # 检查镜像是否存在
    if [[ "$(docker images -q $IMAGE_NAME:latest 2> /dev/null)" == "" ]]; then
        log_warning "镜像不存在，先构建镜像..."
        build_image
    fi
    
    # 检查容器是否已存在
    if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
        log_warning "容器已存在，先停止并删除..."
        docker stop $CONTAINER_NAME > /dev/null 2>&1 || true
        docker rm $CONTAINER_NAME > /dev/null 2>&1 || true
    fi
    
    # 启动容器
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p $PORT:$PORT \
        -e NODE_ENV=production \
        -e PORT=$PORT \
        -e DB_HOST=$DB_HOST \
        -e DB_PORT=$DB_PORT \
        -e DB_USER=$DB_USER \
        -e DB_PASSWORD=$DB_PASSWORD \
        -e DB_NAME=$DB_NAME \
        -v $(pwd)/uploads:/app/uploads \
        -v $(pwd)/data:/app/data \
        $IMAGE_NAME:latest
    
    if [ $? -eq 0 ]; then
        log_success "容器启动成功"
        log_info "容器名称: $CONTAINER_NAME"
        log_info "访问地址: http://localhost:$PORT"
        log_info "健康检查: http://localhost:$PORT/health"
        log_info "数据库: $DB_HOST:$DB_PORT/$DB_NAME"
    else
        log_error "容器启动失败"
        exit 1
    fi
}

# 停止容器
stop_container() {
    log_info "停止容器..."
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        docker stop $CONTAINER_NAME
        log_success "容器已停止"
    else
        log_warning "容器未运行"
    fi
}

# 重启容器
restart_container() {
    log_info "重启容器..."
    stop_container
    sleep 2
    start_container
}

# 查看日志
show_logs() {
    log_info "显示容器日志..."
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        docker logs -f $CONTAINER_NAME
    else
        log_warning "容器未运行"
    fi
}

# 清理资源
clean_resources() {
    log_info "清理Docker资源..."
    
    # 停止并删除容器
    if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
        docker stop $CONTAINER_NAME > /dev/null 2>&1 || true
        docker rm $CONTAINER_NAME > /dev/null 2>&1 || true
        log_success "容器已清理"
    fi
    
    # 删除镜像
    if [[ "$(docker images -q $IMAGE_NAME:latest 2> /dev/null)" != "" ]]; then
        docker rmi $IMAGE_NAME:latest
        log_success "镜像已清理"
    fi
    
    # 清理未使用的资源
    docker system prune -f
    log_success "未使用的Docker资源已清理"
}

# 显示状态
show_status() {
    log_info "容器状态:"
    docker ps -a --filter name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo
    log_info "镜像状态:"
    docker images $IMAGE_NAME --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
    
    echo
    log_info "端口使用情况:"
    netstat -tlnp | grep :$PORT || echo "端口 $PORT 未被使用"
}

# 主函数
main() {
    local action=${1:-help}
    
    case $action in
        build)
            check_docker
            build_image
            ;;
        start)
            check_docker
            start_container
            ;;
        stop)
            check_docker
            stop_container
            ;;
        restart)
            check_docker
            restart_container
            ;;
        logs)
            check_docker
            show_logs
            ;;
        status)
            check_docker
            show_status
            ;;
        clean)
            check_docker
            clean_resources
            ;;
        help|*)
            echo "使用方法: $0 [build|start|stop|restart|logs|status|clean|help]"
            echo
            echo "命令说明:"
            echo "  build   - 构建Docker镜像"
            echo "  start   - 启动容器"
            echo "  stop    - 停止容器"
            echo "  restart - 重启容器"
            echo "  logs    - 查看容器日志"
            echo "  status  - 查看容器和镜像状态"
            echo "  clean   - 清理Docker资源"
            echo "  help    - 显示帮助信息"
            echo
            echo "配置信息:"
            echo "  端口: $PORT"
            echo "  数据库: $DB_HOST:$DB_PORT/$DB_NAME"
            echo "  镜像名: $IMAGE_NAME"
            echo "  容器名: $CONTAINER_NAME"
            ;;
    esac
}

# 执行主函数
main "$@"
