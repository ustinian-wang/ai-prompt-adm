<template>
  <a-layout class="layout">
    <!-- 左侧菜单 -->
    <a-layout-sider
      v-model="collapsed"
      :trigger="null"
      collapsible
      class="sidebar"
    >
      <div class="logo">
        <h2 v-if="!collapsed">AI提示词管理</h2>
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
          <a-dropdown>
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
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Layout',
  data() {
    return {
      collapsed: false,
      selectedKeys: [],
      openKeys: []
    }
  },
  computed: {
    ...mapGetters('user', ['userAvatar', 'userName']),
    menuRoutes() {
      return this.$router.options.routes.filter(route => 
        route.path !== '/login' && route.path !== '/'
      )
    },
    visibleMenuRoutes() {
      return this.menuRoutes.filter(route => 
        !route.meta?.hidden && 
        (route.children ? route.children.some(child => !child.meta?.hidden) : true)
      )
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

      // 特殊处理：WorkDetail页面应该高亮"作品管理"菜单
      if (currentPath.startsWith('/works/workDetail')) {
        this.selectedKeys = ['/works/list'] // 高亮作品列表
        this.openKeys = ['/works'] // 展开作品管理菜单
        return
      }

      // 特殊处理：AccountDetail页面应该高亮"账户管理"菜单
      if (currentPath.startsWith('/system/accounts')) {
        this.selectedKeys = ['/system/accounts'] // 高亮账户管理
        this.openKeys = ['/system'] // 展开系统设置菜单
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
            const firstVisibleChild = menuRoute.children.find(child => !child.meta?.hidden)
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
      return route.children.filter(child => !child.meta?.hidden)
    },
    
    async handleLogout() {
      try {
        await this.logout()
        this.$message.success('退出成功')
        this.$router.push('/login')
      } catch (error) {
        this.$message.error('退出失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  background: var(--background-light);
}

.sidebar {
  box-shadow: var(--shadow-2);
  
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
      background: var(--primary-color);
      
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
  background: var(--background-white);
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-1);
  border-bottom: 1px solid var(--border-light);
  height: 64px;
  
  .trigger {
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-secondary);
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-md);
    
    &:hover {
      color: var(--primary-color);
      background: var(--primary-light);
    }
  }
  
  .header-right {
    .user-dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-md);
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--background-light);
      }
      
      .username {
        margin: 0 var(--spacing-sm);
        color: var(--text-primary);
        font-weight: 500;
      }
      
      .anticon {
        color: var(--text-tertiary);
        transition: transform 0.3s ease;
      }
      
      &:hover .anticon {
        transform: rotate(180deg);
      }
    }
  }
}

.content {
  margin: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--background-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-1);
  overflow-y: auto;
  min-height: calc(100vh - 112px);
  
  // 响应式调整
  @media (max-width: 768px) {
    margin: var(--spacing-sm);
    padding: var(--spacing-md);
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
</style>
