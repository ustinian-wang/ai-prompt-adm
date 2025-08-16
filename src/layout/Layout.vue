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
      >
        <template v-for="route in menuRoutes">
          <a-sub-menu
            v-if="route.children && getVisibleChildren(route).length > 1"
            :key="route.path"
          >
            <span slot="title">
              <a-icon :type="route.meta?.icon || 'file'" />
              <span>{{ route.meta?.title || '未命名' }}</span>
            </span>
            <a-menu-item
              v-for="child in route.children"
              :key="child.path"
              v-if="!child.meta?.hidden"
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
}

.sidebar {
  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    
    h2 {
      color: white;
      margin: 0;
      font-size: 16px;
    }
  }
}

.header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  
  .trigger {
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;
    
    &:hover {
      color: #1890ff;
    }
  }
  
  .header-right {
    .user-dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: #f5f5f5;
      }
      
      .username {
        margin: 0 8px;
        color: #333;
      }
    }
  }
}

.content {
  // margin: 24px;
  // padding: 24px;
  background: #fff;
  border-radius: 4px;
  overflow-y: auto;
}
</style>
