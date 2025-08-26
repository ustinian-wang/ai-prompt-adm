import { defineConfig, loadEnv } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import { resolve } from 'path'

import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode, command }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  console.log(env)
  // 从项目根读取配置
  const configPath = path.resolve(process.cwd(), 'project.config.json')
  
  let frontendPort = 3000
  let backendUrl = 'http://localhost:8080'
  let apiBase = '/api'
  let conf = {
    frontendPort: 3000,
    backendUrl: 'http://localhost:8080',
    apiBase: '/api'
  };
  
  try {
    if (fs.existsSync(configPath)) {
      conf = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (conf.frontendPort) frontendPort = conf.frontendPort
      if (conf.backendUrl) backendUrl = conf.backendUrl
      if (conf.apiBase) apiBase = conf.apiBase
    }
  } catch (e) {
    console.log('project.config.json not found', e)
  }

  // 环境变量优先级最高
  const finalConfig = {
    frontendPort: env.VITE_FRONTEND_PORT || env.FRONTEND_PORT || conf.frontendPort,
    backendUrl: env.VITE_BACKEND_URL || env.BACKEND_URL || conf.backendUrl,
    apiBase: env.VITE_API_BASE || env.API_BASE || conf.apiBase
  }

  console.log('Vite配置:', finalConfig)

  return {
    plugins: [vue2()],
    base: '/',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'vue': 'vue/dist/vue.esm.js'
      }
    },
    define: {
      'process.env': {
        NODE_ENV: mode,
        VITE_FRONTEND_PORT: JSON.stringify(finalConfig.frontendPort),
        VITE_BACKEND_URL: JSON.stringify(finalConfig.backendUrl),
        VITE_API_BASE: JSON.stringify(finalConfig.apiBase)
      }
    },
    server: {
      port: finalConfig.frontendPort,
      open: true,
      proxy: {
        [finalConfig.apiBase]: {
          target: finalConfig.backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(new RegExp(`^${finalConfig.apiBase}`), ''),
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          }
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          client: resolve(__dirname, 'client.html')
        },
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'vuex'],
            antd: ['ant-design-vue']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'vuex', 'ant-design-vue'],
      exclude: ['moment']
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})
