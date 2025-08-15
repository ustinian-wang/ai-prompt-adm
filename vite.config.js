import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue2()],
  // base: '/',
  base: '/ai-prompt-adm/', // 添加仓库名作为base路径
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.esm.js'
    }
  },
  define: {
    'process.env': {}
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
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
})
