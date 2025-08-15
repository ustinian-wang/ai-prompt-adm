import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/works'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/works',
    name: 'Works',
    redirect: '/works/list',
    component: () => import('@/layout/Layout.vue'),
    meta: {
      title: '作品管理',
      icon: 'file-text'
    },
    children: [
      {
        path: '/works/list',
        name: 'WorkList',
        component: () => import('@/views/works/WorkList.vue'),
        meta: {
          title: '作品列表',
          icon: 'unordered-list'
        }
      },
      {
        path: 'guide',
        name: 'WorkGuide',
        component: () => import('@/views/works/WorkGuide.vue'),
        meta: {
          title: '使用指南',
          icon: 'book'
        }
      },
      {
        path: 'prompt',
        name: 'WorkPrompt',
        component: () => import('@/views/works/WorkPrompt.vue'),
        meta: {
          title: '提示词配置',
          icon: 'edit'
        }
      }
    ]
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/categories/list',
    meta: {
      title: '分类管理',
      icon: 'folder'
    },
    children: [
      {
        path: '/categories/list',
        name: 'CategoryList',
        component: () => import('@/views/categories/CategoryList.vue'),
        meta: {
          title: '分类列表',
          icon: 'unordered-list'
        }
      },
      {
        path: '/categories/add',
        name: 'CategoryAdd',
        component: () => import('@/views/categories/CategoryAdd.vue'),
        meta: {
          title: '新增分类',
          icon: 'plus',
          hidden: true
        }
      },
      {
        path: '/categories/edit/:id',
        name: 'CategoryEdit',
        component: () => import('@/views/categories/CategoryEdit.vue'),
        meta: {
          title: '编辑分类',
          icon: 'edit',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/users',
    name: 'Users',
    meta: {
      title: '用户管理',
      icon: 'user'
    },
    redirect: '/users/list',
    component: () => import('@/layout/Layout.vue'),
    children: [
      {
        path: '/users/list',
        name: 'UserList',
        component: () => import('@/views/users/UserList.vue'),
        meta: {
          title: '用户列表',
          icon: 'unordered-list'
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    meta: {
      title: '系统设置',
      icon: 'setting'
    },
    component: () => import('@/layout/Layout.vue'),
    redirect: '/system/accounts',
    children: [
      {
        path: '/system/accounts',
        name: 'AccountManage',
        component: () => import('@/views/system/AccountManage.vue'),
        meta: {
          title: '账户管理',
          icon: 'user'
        }
      },
      {
        path: '/system/account/:id',
        name: 'AccountDetail',
        component: () => import('@/views/system/AccountDetail.vue'),
        meta: {
          title: '账户详情',
          icon: 'user'
        }
      },
      {
        path: '/system/roles',
        name: 'RoleManage',
        component: () => import('@/views/system/RoleManage.vue'),
        meta: {
          title: '角色管理',
          icon: 'team'
        }
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/dashboard/overview',
    meta: {
      title: '仪表盘',
      icon: 'dashboard'
    },
    children: [
      {
        path: '/dashboard/overview',
        name: 'DashboardOverview',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '概览',
          icon: 'eye'
        }
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'hash', // 使用hash模式，不需要服务器配置
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = store.getters['user/token'];
  
  if (to.path === '/login') {
    if (token) {
      next('/dashboard')
    } else {
      next()
    }
  } else if (to.path.startsWith('/dashboard')) {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
