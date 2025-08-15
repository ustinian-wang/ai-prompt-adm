<template>
  <div class="dashboard">
    <div class="page-header">
      <h2>仪表盘</h2>
      <p>欢迎使用AI提示词管理系统</p>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-row">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总作品数"
            :value="stats.totalWorks"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <a-icon type="file-text" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总分类数"
            :value="stats.totalCategories"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <a-icon type="folder" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总用户数"
            :value="stats.totalUsers"
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix>
              <a-icon type="user" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总角色数"
            :value="stats.totalRoles"
            :value-style="{ color: '#fa8c16' }"
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
        <a-card title="作品分类分布" style="margin-bottom: 24px;">
          <div class="chart-placeholder">
            <a-icon type="pie-chart" style="font-size: 48px; color: #1890ff;" />
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
        <a-card title="最近活动" style="margin-bottom: 24px;">
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
      <a-card title="快速操作">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-button type="primary" block @click="$router.push('/works')">
              <a-icon type="plus" />
              新建作品
            </a-button>
          </a-col>
          <a-col :span="6">
            <a-button type="default" block @click="$router.push('/categories')">
              <a-icon type="folder-add" />
              新建分类
            </a-button>
          </a-col>
          <a-col :span="6">
            <a-button type="default" block @click="$router.push('/users')">
              <a-icon type="user-add" />
              新建用户
            </a-button>
          </a-col>
          <a-col :span="6">
            <a-button type="default" block @click="$router.push('/system/roles')">
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

export default {
  name: 'Dashboard',
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
    margin-bottom: 24px;
    
    h2 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 24px;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }
  
  .stats-row {
    margin-bottom: 24px;
    
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .charts-row {
    margin-bottom: 24px;
    
    .ant-col {
      margin-bottom: 16px;
    }
  }
  
  .chart-placeholder {
    text-align: center;
    padding: 40px 0;
    
    p {
      margin: 16px 0;
      color: #666;
    }
    
    .category-list {
      text-align: left;
      margin-top: 20px;
      
      .category-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .category-name {
          color: #333;
        }
        
        .category-count {
          color: #1890ff;
          font-weight: bold;
        }
      }
    }
  }
  
  .activity-list {
    .activity-item {
      display: flex;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .activity-content {
        margin-left: 12px;
        flex: 1;
        
        .activity-text {
          color: #333;
          margin-bottom: 4px;
        }
        
        .activity-time {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
  
  .quick-actions {
    .ant-col {
      margin-bottom: 16px;
    }
  }
}
</style>
