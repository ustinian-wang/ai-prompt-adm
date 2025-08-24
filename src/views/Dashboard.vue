<template>
  <div class="dashboard page-container fade-in">
    <SimplePageHeader
      title="仪表盘"
      description="欢迎使用AI提示词管理系统"
    />
    
    <!-- 统计卡片 -->
    <div class="stats-row">
      <a-col :span="6">
        <a-card class="stats-card">
          <a-statistic
            title="总作品数"
            :value="stats.totalWorks"
            :value-style="{ color: 'var(--success-color)' }"
          >
            <template #prefix>
              <a-icon type="file-text" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="6">
        <a-card class="stats-card">
          <a-statistic
            title="总分类数"
            :value="stats.totalCategories"
            :value-style="{ color: 'var(--primary-color)' }"
          >
            <template #prefix>
              <a-icon type="folder" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="6">
        <a-card class="stats-card">
          <a-statistic
            title="总用户数"
            :value="stats.totalUsers"
            :value-style="{ color: 'var(--warning-color)' }"
          >
            <template #prefix>
              <a-icon type="user" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="6">
        <a-card class="stats-card">
          <a-statistic
            title="总角色数"
            :value="stats.totalRoles"
            :value-style="{ color: 'var(--error-color)' }"
          >
            <template #prefix>
              <a-icon type="team" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-row">
      <a-col :span="12">
        <a-card title="作品分类分布" class="chart-card">
          <div class="chart-placeholder">
            <a-icon type="pie-chart" class="chart-icon" />
            <p>作品分类饼图</p>
            <div class="category-list">
              <div v-for="item in categoryStats" :key="item.name" class="category-item">
                <span class="category-name">{{ item.name }}</span>
                <span class="category-count">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="12">
        <a-card title="最近活动" class="chart-card">
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <a-avatar :src="activity.avatar" size="small" />
              <div class="activity-content">
                <div class="activity-text">
                  <strong>{{ activity.user }}</strong> {{ activity.action }}
                </div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </div>
    
    <!-- 快速操作 -->
    <div class="quick-actions">
      <a-card title="快速操作" class="action-card">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-button type="primary" block @click="$router.push('/works')" class="action-btn">
              <a-icon type="plus" />
              新建作品
            </a-button>
          </a-col>
          <a-col :span="6">
            <a-button type="default" block @click="$router.push('/categories')" class="action-btn">
              <a-icon type="folder-add" />
              新建分类
            </a-button>
          </a-col>
          <a-col :span="6">
            <a-button type="default" block @click="$router.push('/users')" class="action-btn">
              <a-icon type="user-add" />
              新建用户
            </a-button>
          </a-col>
          <a-col :span="6">
            <a-button type="default" block @click="$router.push('/system/roles')" class="action-btn">
              <a-icon type="team" />
              新建角色
            </a-button>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SimplePageHeader from '@/components/SimplePageHeader.vue'

export default {
  name: 'Dashboard',
  components: {
    SimplePageHeader
  },
  data() {
    return {
      stats: {
        totalWorks: 0,
        totalCategories: 0,
        totalUsers: 0,
        totalRoles: 0
      },
      categoryStats: [],
      recentActivities: []
    }
  },
  computed: {
    ...mapGetters('works', ['worksList']),
    ...mapGetters('categories', ['categoriesList']),
    ...mapGetters('users', ['usersList']),
    ...mapGetters('system', ['rolesList'])
  },
  mounted() {
    this.loadDashboardData()
  },
  methods: {
    loadDashboardData() {
      // 模拟加载仪表盘数据
      setTimeout(() => {
        this.stats = {
          totalWorks: this.worksList.length || 5,
          totalCategories: this.categoriesList.length || 5,
          totalUsers: this.usersList.length || 5,
          totalRoles: this.rolesList.length || 5
        }
        
        this.categoryStats = [
          { name: 'AI写作', count: 15 },
          { name: 'AI绘画', count: 23 },
          { name: 'AI编程', count: 8 },
          { name: 'AI分析', count: 12 },
          { name: 'AI应用', count: 19 }
        ]
        
        this.recentActivities = [
          {
            id: 1,
            user: '张三',
            action: '创建了新作品《AI写作助手》',
            time: '2分钟前',
            avatar: 'https://via.placeholder.com/32x32'
          },
          {
            id: 2,
            user: '李四',
            action: '更新了分类《AI绘画》',
            time: '5分钟前',
            avatar: 'https://via.placeholder.com/32x32'
          },
          {
            id: 3,
            user: '王五',
            action: '删除了作品《测试作品》',
            time: '10分钟前',
            avatar: 'https://via.placeholder.com/32x32'
          },
          {
            id: 4,
            user: '赵六',
            action: '创建了新用户账号',
            time: '15分钟前',
            avatar: 'https://via.placeholder.com/32x32'
          },
          {
            id: 5,
            user: '钱七',
            action: '配置了提示词参数',
            time: '20分钟前',
            avatar: 'https://via.placeholder.com/32x32'
          }
        ]
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  .page-header {
    
    .header-content {
      h1 {
        margin: 0 0 var(--spacing-xs) 0;
        color: var(--text-primary);
        font-size: 24px;
      }
      
      p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
      }
    }
  }
  
  .stats-row {
    margin-bottom: var(--spacing-xl);
    
    .ant-col {
      margin-bottom: var(--spacing-md);
    }
  }
  
  .charts-row {
    margin-bottom: var(--spacing-xl);
    
    .ant-col {
      margin-bottom: var(--spacing-md);
    }
  }
  
  .chart-card {
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-1);
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: var(--shadow-2);
    }
    
    .ant-card-head {
      border-bottom: 1px solid var(--border-light);
      
      .ant-card-head-title {
        color: var(--text-primary);
        font-weight: 600;
      }
    }
  }
  
  .chart-placeholder {
    text-align: center;
    padding: var(--spacing-xl) 0;
    
    .chart-icon {
      font-size: 48px;
      color: var(--primary-color);
      margin-bottom: var(--spacing-md);
    }
    
    p {
      margin: var(--spacing-md) 0;
      color: var(--text-secondary);
      font-size: 14px;
    }
    
    .category-list {
      text-align: left;
      margin-top: var(--spacing-lg);
      
      .category-item {
        display: flex;
        justify-content: space-between;
        padding: var(--spacing-sm) 0;
        border-bottom: 1px solid var(--border-light);
        
        &:last-child {
          border-bottom: none;
        }
        
        .category-name {
          color: var(--text-primary);
          font-weight: 500;
        }
        
        .category-count {
          color: var(--primary-color);
          font-weight: 600;
        }
      }
    }
  }
  
  .activity-list {
    .activity-item {
      display: flex;
      align-items: flex-start;
      padding: var(--spacing-md) 0;
      border-bottom: 1px solid var(--border-light);
      
      &:last-child {
        border-bottom: none;
      }
      
      .activity-content {
        margin-left: var(--spacing-md);
        flex: 1;
        
        .activity-text {
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
          line-height: 1.5;
          
          strong {
            color: var(--primary-color);
            font-weight: 600;
          }
        }
        
        .activity-time {
          color: var(--text-tertiary);
          font-size: 12px;
        }
      }
    }
  }
  
  .action-card {
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-1);
    
    .ant-card-head {
      border-bottom: 1px solid var(--border-light);
      
      .ant-card-head-title {
        color: var(--text-primary);
        font-weight: 600;
      }
    }
    
    .action-btn {
      height: 48px;
      border-radius: var(--border-radius-md);
      font-weight: 500;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-2);
      }
      
      .anticon {
        margin-right: var(--spacing-sm);
      }
    }
  }
  
  .quick-actions {
    .ant-col {
      margin-bottom: var(--spacing-md);
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .dashboard {
    .stats-row,
    .charts-row {
      .ant-col {
        span: 24;
        margin-bottom: var(--spacing-md);
      }
    }
    
    .quick-actions {
      .ant-col {
        span: 12;
        margin-bottom: var(--spacing-md);
      }
    }
  }
}
</style>
