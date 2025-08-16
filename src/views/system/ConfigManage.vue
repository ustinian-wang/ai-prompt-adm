<template>
  <div class="config-manage">
    <a-card title="配置管理" :bordered="false">
      <a-form
        :model="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        @finish="onFinish"
      >
        <a-form-item label="前端端口" name="frontendPort">
          <a-input-number
            v-model="form.frontendPort"
            :min="1000"
            :max="9999"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="后端地址" name="backendUrl">
          <a-input
            v-model:value="form.backendUrl"
            placeholder="http://localhost:8080"
          />
        </a-form-item>

        <a-form-item label="API基础路径" name="apiBase">
          <a-input
            v-model:value="form.apiBase"
            placeholder="/api"
          />
        </a-form-item>

        <a-form-item label="请求超时" name="requestTimeout">
          <a-input-number
            v-model:value="form.requestTimeout"
            :min="1000"
            :max="60000"
            :step="1000"
            style="width: 100%"
          />
          <span class="unit">毫秒</span>
        </a-form-item>

        <a-form-item label="调试模式" name="debug">
          <a-switch v-model:checked="form.debug" />
        </a-form-item>

        <a-form-item label="环境" name="nodeEnv">
          <a-select v-model:value="form.nodeEnv">
            <a-select-option value="development">开发环境</a-select-option>
            <a-select-option value="production">生产环境</a-select-option>
            <a-select-option value="test">测试环境</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="代理配置" name="proxyEnabled">
          <a-switch v-model:checked="form.proxy.enabled" />
        </a-form-item>

        <a-form-item label="构建配置" name="sourcemap">
          <a-switch v-model:checked="form.build.sourcemap" />
          <span class="label-text">启用源码映射</span>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              保存配置
            </a-button>
            <a-button @click="resetForm">重置</a-button>
            <a-button @click="testConnection">测试连接</a-button>
            <a-button @click="exportConfig">导出配置</a-button>
          </a-space>
        </a-form-item>
      </a-form>

      <a-divider />

      <a-card title="当前配置" size="small">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="前端端口">
            {{ currentConfig.frontendPort }}
          </a-descriptions-item>
          <a-descriptions-item label="后端地址">
            {{ currentConfig.backendUrl }}
          </a-descriptions-item>
          <a-descriptions-item label="API基础路径">
            {{ currentConfig.apiBase }}
          </a-descriptions-item>
          <a-descriptions-item label="请求超时">
            {{ currentConfig.requestTimeout }}ms
          </a-descriptions-item>
          <a-descriptions-item label="调试模式">
            {{ currentConfig.debug ? '启用' : '禁用' }}
          </a-descriptions-item>
          <a-descriptions-item label="环境">
            {{ currentConfig.nodeEnv }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-card>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import config from '@/utils/config'
import { updateConfig } from '@/utils/config'
import { sendConfigUpdateNotification } from '@/utils/wechatBot'

export default defineComponent({
  name: 'ConfigManage',
  setup() {
    const loading = ref(false)
    
    const form = reactive({
      frontendPort: 3000,
      backendUrl: 'http://localhost:8080',
      apiBase: '/api',
      requestTimeout: 10000,
      debug: false,
      nodeEnv: 'development',
      proxy: {
        enabled: true,
        changeOrigin: true,
        secure: false
      },
      build: {
        sourcemap: false,
        minify: true,
        chunkSizeWarningLimit: 1000
      }
    })

    const currentConfig = ref({})

    // 加载当前配置
    const loadCurrentConfig = () => {
      currentConfig.value = { ...config }
      Object.assign(form, currentConfig.value)
    }

    // 保存配置
    const onFinish = async () => {
      loading.value = true
      try {
        // 更新配置
        updateConfig(form)
        
        // 发送企业微信通知
        await sendConfigUpdateNotification(
          'Vite配置更新',
          `前端端口: ${form.frontendPort}, 后端地址: ${form.backendUrl}, API路径: ${form.apiBase}`
        )
        
        message.success('配置保存成功，请重启开发服务器以应用新配置')
        loadCurrentConfig()
      } catch (error) {
        message.error('配置保存失败: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    // 重置表单
    const resetForm = () => {
      loadCurrentConfig()
      message.info('表单已重置')
    }

    // 测试连接
    const testConnection = async () => {
      try {
        const response = await fetch(`${form.backendUrl}/health`)
        if (response.ok) {
          message.success('后端连接正常')
        } else {
          message.warning('后端连接异常，状态码: ' + response.status)
        }
      } catch (error) {
        message.error('后端连接失败: ' + error.message)
      }
    }

    // 导出配置
    const exportConfig = () => {
      const configStr = JSON.stringify(form, null, 2)
      const blob = new Blob([configStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'vite-config.json'
      a.click()
      URL.revokeObjectURL(url)
      message.success('配置已导出')
    }

    onMounted(() => {
      loadCurrentConfig()
    })

    return {
      form,
      loading,
      currentConfig,
      onFinish,
      resetForm,
      testConnection,
      exportConfig
    }
  }
})
</script>

<style lang="scss" scoped>
.config-manage {
  padding: 24px;
  
  .unit {
    margin-left: 8px;
    color: #666;
  }
  
  .label-text {
    margin-left: 8px;
    color: #666;
  }
  
  .ant-descriptions {
    margin-top: 16px;
  }
}
</style>
