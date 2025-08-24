<template>
  <div class="page-header" :class="{ 'page-header-simple': simple }">
    <div class="header-content">
      <h1 v-if="title && level === 1">{{ title }}</h1>
      <h2 v-else-if="title && level === 2">{{ title }}</h2>
      <h3 v-else-if="title && level === 3">{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
      <slot name="content"></slot>
    </div>
    
    <div class="header-actions" v-if="$slots.actions || actions">
      <slot name="actions">
        <template v-for="action in actions">
          <a-button
            :key="action.key"
            :type="action.type || 'default'"
            :size="action.size || 'middle'"
            :loading="action.loading"
            :disabled="action.disabled"
            @click="action.onClick"
            :class="action.className"
          >
            <a-icon v-if="action.icon" :type="action.icon" />
            {{ action.text }}
          </a-button>
        </template>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 标题级别 1=h1, 2=h2, 3=h3
    level: {
      type: Number,
      default: 1,
      validator: value => [1, 2, 3].includes(value)
    },
    // 描述文字
    description: {
      type: String,
      default: ''
    },
    // 是否为简化版本
    simple: {
      type: Boolean,
      default: false
    },
    // 操作按钮配置
    actions: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
  
  display: flex;
  align-items: center;
  
  .header-content {
    flex: 1;
    
    h1, h2, h3 {
      color: var(--text-primary);
      margin: 0 0 var(--spacing-sm) 0;
      font-weight: 600;
      line-height: 1.4;
    }
    
    h1 { 
      font-size: 28px; 
      margin-bottom: var(--spacing-xs);
    }
    h2 { 
      font-size: 24px; 
      margin-bottom: var(--spacing-xs);
    }
    h3 { 
      font-size: 20px; 
      margin-bottom: var(--spacing-xs);
    }
    
    p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      max-width: 600px;
    }
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex-shrink: 0;
    
  }
}

.page-header-simple {
  align-items: center;
  
  .header-content {
    h1, h2, h3 {
      margin: 0;
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
    
    .header-content {
      h1 { font-size: 24px; }
      h2 { font-size: 20px; }
      h3 { font-size: 18px; }
    }
    
    .header-actions {
      width: 100%;
      justify-content: flex-start;
      
      
    }
  }
}
</style>

