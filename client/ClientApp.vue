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
            <router-view />
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
      openKeys: []
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
      return this.$router.options.routes.filter(route => 
        route.path !== '/login' && route.path !== '*' && !route.meta?.hidden
      )
    },
    
    visibleMenuRoutes() {
      return this.menuRoutes.filter(route => {
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
    }
  },
  
  watch: {
    $route: {
      handler(route) {
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
      // 避免重复导航到当前路由
      if (this.$route.path !== key) {
        this.$router.push(key)
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

      if (currentPath.startsWith('/collect/preview/')) {
        this.selectedKeys = ['/collect']
        this.openKeys = ['/collect']
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
            // 计算子路由的完整路径
            let childFullPath = child.path
            if (!child.path.startsWith('/')) {
              // 相对路径，需要拼接父路径
              childFullPath = menuRoute.path + '/' + child.path
            }

            if (childFullPath === currentPath) {
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
      )
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

// 全局样式
#client-app {
  height: 100vh;
  width: 100vw;
}
</style>
