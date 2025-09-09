<template>
  <div id="client-app">
    <!-- 登录页面不显示布局 -->
    <template v-if="$route.path === '/login'">
      <router-view />
    </template>
    
    <!-- 后台管理系统布局 -->
    <template v-else>
      <a-layout class="layout">
        <!-- 左侧菜单 -->
        <a-layout-sider
          v-model="collapsed"
          :trigger="null"
          collapsible
          class="sidebar"
        >
          <div class="logo">
            <h2 v-if="!collapsed">AI提示词收集</h2>
            <h2 v-else>AI</h2>
          </div>
          
          <a-menu
            theme="dark"
            mode="inline"
            :selectedKeys="selectedKeys"
            :openKeys="openKeys"
            @click="handleMenuClick"
            @openChange="handleOpenChange"
            class="sidebar-menu"
          >
            <template v-for="route in visibleMenuRoutes">
              <a-sub-menu
                v-if="route.children && getVisibleChildren(route).length > 1"
                :key="route.path"
              >
                <span slot="title">
                  <a-icon :type="route.meta?.icon || 'file'" />
                  <span>{{ route.meta?.title || '未命名' }}</span>
                </span>
                <a-menu-item
                  v-for="child in getVisibleChildren(route)"
                  :key="child.path"
                >
                  <a-icon :type="getRouteIcon(child)" />
                  <span>{{ child.meta?.title || '未命名' }}</span>
                </a-menu-item>
              </a-sub-menu>

              <a-menu-item
                v-if="route.children && getVisibleChildren(route).length === 1"
                :key="getVisibleChildren(route)[0].path"
              >
                <a-icon :type="getVisibleChildren(route)[0].meta?.icon || route.meta?.icon || 'file'" />
                <span>{{ getVisibleChildren(route)[0].meta?.title || route.meta?.title || '未命名' }}</span>
              </a-menu-item>

              <a-menu-item
                v-if="!route.children"
                :key="route.path"
              >
                <a-icon :type="route.meta?.icon || 'file'" />
                <span>{{ route.meta?.title || '未命名' }}</span>
              </a-menu-item>
            </template>
          </a-menu>
        </a-layout-sider>

        <!-- 右侧内容区域 -->
        <a-layout>
          <!-- 顶部导航栏 -->
          <a-layout-header class="header">
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="toggleCollapsed"
            />
            
            <div class="header-right">
              <!-- 调试按钮 -->
              <a-button 
                type="dashed" 
                size="small" 
                @click="toggleDebug"
                style="margin-right: 16px;"
              >
                {{ showDebug ? '隐藏调试' : '显示调试' }}
              </a-button>
              
              <a-dropdown v-if="isLoggedIn">
                <a class="user-dropdown">
                  <a-avatar :src="userAvatar" />
                  <span class="username">{{ userName }}</span>
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item @click="handleLogout">
                    <a-icon type="logout" />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              
              <a-button v-else type="primary" @click="goToLogin">
                <a-icon type="login" />
                登录/注册
              </a-button>
            </div>
          </a-layout-header>

          <!-- 内容区域 -->
          <a-layout-content class="content">
            <!-- 调试信息 -->
            <div v-if="showDebug" class="debug-panel">
              <h3>调试信息</h3>
              <p>当前路径: {{ $route.path }}</p>
              <p>路由名称: {{ $route.name }}</p>
              <p>路由参数: {{ JSON.stringify($route.params) }}</p>
              <p>查询参数: {{ JSON.stringify($route.query) }}</p>
              <p>匹配的路由: {{ JSON.stringify($route.matched) }}</p>
            </div>
            
            <router-view :key="$route.fullPath" />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ClientApp',
  data() {
    return {
      collapsed: false,
      selectedKeys: [],
      openKeys: [],
      showDebug: false
    }
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'userInfo']),
    ...mapGetters('user', ['currentUser']),
    
    userAvatar() {
      return this.userInfo?.avatar || this.currentUser?.avatar || ''
    },
    
    userName() {
      return this.userInfo?.username || this.currentUser?.username || '用户'
    },
    
    menuRoutes() {
      const routes = this.$router.options.routes.filter(route => 
        route.path !== '/login' && route.path !== '*' && !route.meta?.hidden
      )
      console.log('[ClientApp] Available menu routes:', routes)
      return routes
    },
    
    visibleMenuRoutes() {
      const routes = this.menuRoutes.filter(route => {
        // 如果路由需要认证但用户未登录，则隐藏
        if (route.meta?.requiresAuth && !this.isLoggedIn) {
          return false
        }
        
        // 如果有子路由，检查是否有可见的子路由
        if (route.children) {
          return route.children.some(child => {
            if (child.meta?.hidden) return false
            if (child.meta?.requiresAuth && !this.isLoggedIn) return false
            return true
          })
        }
        
        return true
      })
      console.log('[ClientApp] Visible menu routes:', routes)
      return routes
    }
  },
  
  watch: {
    $route: {
      handler(route) {
        console.log('[ClientApp] Route changed:', route.path, route.name)
        console.log('[ClientApp] Route component:', route.matched)
        this.updateSelectedKeys(route)
      },
      immediate: true
    }
  },
  
  methods: {
    ...mapActions('auth', ['logout']),
    
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    },
    
    handleMenuClick({ key }) {
      console.log('Menu clicked:', key)
      console.log('Current route:', this.$route.path)
      console.log('Available routes:', this.menuRoutes)
      
      // 避免重复导航到当前路由
      if (this.$route.path !== key) {
        console.log('Navigating to:', key)
        
        // 强制刷新路由视图
        this.$nextTick(() => {
          this.$router.push(key).then(() => {
            console.log('Navigation successful to:', key)
            // 强制更新组件
            this.$forceUpdate()
          }).catch(err => {
            console.error('Navigation error:', err)
            console.error('Navigation error details:', err.message)
          })
        })
      } else {
        console.log('Already on target route')
      }
    },
    
    handleOpenChange(openKeys) {
      this.openKeys = openKeys
    },
    
    updateSelectedKeys(route) {
      // 获取当前路由路径
      const currentPath = route.path

      // 特殊处理：详情页面应该高亮对应的父级菜单
      if (currentPath.startsWith('/detail/')) {
        this.selectedKeys = ['/']
        this.openKeys = []
        return
      }

      // 特殊处理：收集预览页面应该高亮"提示词收集"菜单
      if (currentPath.startsWith('/collect/preview/')) {
        this.selectedKeys = ['/collect/list'] // 高亮收集首页
        this.openKeys = ['/collect'] // 展开提示词收集菜单
        return
      }

      // 查找匹配的菜单项
      let selectedKey = null
      let parentKey = null

      // 遍历路由配置，找到匹配的菜单项
      for (const menuRoute of this.menuRoutes) {
        if (menuRoute.children && menuRoute.children.length > 0) {
          // 检查子路由
          for (const child of menuRoute.children) {
            if (child.path === currentPath) {
              selectedKey = child.path
              parentKey = menuRoute.path
              break
            }
          }

          // 如果找到了匹配的子路由，跳出外层循环
          if (selectedKey) {
            break
          }

          // 如果当前路径匹配父路由，选择第一个可见的子路由
          if (currentPath === menuRoute.path) {
            const firstVisibleChild = menuRoute.children.find(child => 
              !child.meta?.hidden && 
              (!child.meta?.requiresAuth || this.isLoggedIn)
            )
            if (firstVisibleChild) {
              selectedKey = firstVisibleChild.path
              parentKey = menuRoute.path
              break
            }
          }
        } else {
          // 单级菜单
          if (menuRoute.path === currentPath) {
            selectedKey = menuRoute.path
            break
          }
        }
      }

      // 如果没有找到匹配的菜单项，使用当前路径
      if (!selectedKey) {
        selectedKey = currentPath
      }

      this.selectedKeys = [selectedKey]

      // 设置展开的菜单
      if (parentKey) {
        this.openKeys = [parentKey]
      } else {
        this.openKeys = []
      }
    },

    getRouteIcon(route) {
      return route.meta?.icon || 'file'
    },

    getVisibleChildren(route) {
      if (!route.children) return []
      return route.children.filter(child => 
        !child.meta?.hidden && 
        (!child.meta?.requiresAuth || this.isLoggedIn)
      ).map(child => ({
        ...child,
        // 确保子路由有完整的路径
        fullPath: child.path.startsWith('/') ? child.path : `${route.path}/${child.path}`
      }))
    },
    
    async handleLogout() {
      try {
        await this.logout()
        this.$message.success('退出成功')
        this.$router.push('/')
      } catch (error) {
        this.$message.error('退出失败')
      }
    },
    
    goToLogin() {
      this.$router.push('/login')
    },
    
    toggleDebug() {
      this.showDebug = !this.showDebug
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  background: #f0f2f5;
}

.sidebar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    h2 {
      color: white;
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }
  
  .sidebar-menu {
    border-right: none;
    
    .ant-menu-item,
    .ant-menu-submenu-title {
      margin: 0;
      padding: 0 16px;
      height: 48px;
      line-height: 48px;
      
      .anticon {
        margin-right: 12px;
        font-size: 16px;
      }
      
      span {
        font-size: 14px;
        font-weight: 500;
      }
    }
    
    .ant-menu-item-selected {
      background: #1890ff;
      
      &::after {
        border-right: 3px solid white;
      }
    }
    
    .ant-menu-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.header {
  background: white;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #f0f0f0;
  height: 64px;
  
  .trigger {
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #666;
    padding: 8px;
    border-radius: 6px;
    
    &:hover {
      color: #1890ff;
      background: #e6f7ff;
    }
  }
  
  .header-right {
    .user-dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.3s ease;
      
      &:hover {
        background: #f5f5f5;
      }
      
      .username {
        margin: 0 8px;
        color: #333;
        font-weight: 500;
      }
      
      .anticon {
        color: #999;
        transition: transform 0.3s ease;
      }
      
      &:hover .anticon {
        transform: rotate(180deg);
      }
    }
  }
}

.content {
  margin: 24px;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  overflow-y: auto;
  min-height: calc(100vh - 112px);
  
  // 响应式调整
  @media (max-width: 768px) {
    margin: 12px;
    padding: 16px;
  }
}

// 动画效果
.sidebar-menu {
  .ant-menu-item,
  .ant-menu-submenu-title {
    transition: all 0.3s ease;
  }
}

.user-dropdown {
  .anticon {
    transition: transform 0.3s ease;
  }
}

// 调试面板样式
.debug-panel {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  font-family: monospace;
  font-size: 12px;
  
  h3 {
    margin: 0 0 12px 0;
    color: #1890ff;
  }
  
  p {
    margin: 4px 0;
    color: #666;
  }
}

// 全局样式
#client-app {
  height: 100vh;
  width: 100vw;
}
</style>
