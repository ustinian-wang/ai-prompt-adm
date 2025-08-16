module.exports = {
  apps: [
    {
      name: 'ai-prompt-backend',
      script: 'app.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4002
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4002
      },
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // 进程守护配置
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      
      // 健康检查
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // 监控配置
      pmx: true,
      monitoring: true,
      
      // 优雅关闭
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // 环境变量
      env_file: '.env',
      
      // 启动参数
      node_args: '--max-old-space-size=1024',
      
      // 错误处理
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      watch_options: {
        followSymlinks: false
      }
    }
  ],
  
  // 部署配置
  deploy: {
    production: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:username/ai-prompt-adm.git',
      path: '/var/www/ai-prompt-adm',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
