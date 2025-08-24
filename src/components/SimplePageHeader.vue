<template>
  <div class="page-header-simple">
    <div class="header-content">
      <h1 v-if="title && level === 1">{{ title }}</h1>
      <h2 v-else-if="title && level === 2">{{ title }}</h2>
      <h3 v-else-if="title && level === 3">{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
      <slot name="content"></slot>
    </div>
    
    <div class="header-actions" v-if="$slots.actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimplePageHeader',
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
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header-simple {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .header-content {
    flex: 1;
    
    h1, h2, h3 {
      color: var(--text-primary);
      margin: 0;
      font-weight: 600;
      line-height: 1.4;
    }
    
    h1 { font-size: 28px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    
    p {
      color: var(--text-secondary);
      margin: var(--spacing-xs) 0 0 0;
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

// 响应式调整
@media (max-width: 768px) {
  .page-header-simple {
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
