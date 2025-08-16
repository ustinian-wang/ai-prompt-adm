#!/bin/bash

# PM2管理脚本

CONTAINER_NAME="ai-prompt-backend"

show_help() {
    echo "🔧 PM2进程管理脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  status      查看进程状态"
    echo "  start       启动进程"
    echo "  stop        停止进程"
    echo "  restart     重启进程"
    echo "  reload      重载进程"
    echo "  delete      删除进程"
    echo "  logs        查看日志"
    echo "  monit       监控面板"
    echo "  info        进程信息"
    echo "  help        显示帮助"
    echo ""
}

check_container() {
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        echo "❌ 容器 $CONTAINER_NAME 未运行"
        exit 1
    fi
}

case "$1" in
    status)
        check_container
        echo "📊 查看PM2进程状态..."
        docker exec $CONTAINER_NAME pm2 status
        ;;
    start)
        check_container
        echo "🚀 启动PM2进程..."
        docker exec $CONTAINER_NAME pm2 start ecosystem.config.js
        ;;
    stop)
        check_container
        echo "🛑 停止PM2进程..."
        docker exec $CONTAINER_NAME pm2 stop all
        ;;
    restart)
        check_container
        echo "🔄 重启PM2进程..."
        docker exec $CONTAINER_NAME pm2 restart all
        ;;
    reload)
        check_container
        echo "🔄 重载PM2进程..."
        docker exec $CONTAINER_NAME pm2 reload all
        ;;
    delete)
        check_container
        echo "🗑️  删除PM2进程..."
        docker exec $CONTAINER_NAME pm2 delete all
        ;;
    logs)
        check_container
        echo "📋 查看PM2日志..."
        docker exec $CONTAINER_NAME pm2 logs
        ;;
    monit)
        check_container
        echo "📊 打开PM2监控面板..."
        docker exec -it $CONTAINER_NAME pm2 monit
        ;;
    info)
        check_container
        echo "ℹ️  查看进程详细信息..."
        docker exec $CONTAINER_NAME pm2 show 0
        ;;
    help|*)
        show_help
        ;;
esac
