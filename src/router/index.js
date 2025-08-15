import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/dashboard/overview',
    children: [
      {
        path: 'overview',
        name: 'DashboardOverview',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'works',
        name: 'Works',
        redirect: '/dashboard/works/list',
        children: [
          {
            path: 'list',
            name: 'WorkList',
            component: () => import('@/views/works/WorkList.vue')
          },
          {
            path: 'guide',
            name: 'WorkGuide',
            component: () => import('@/views/works/WorkGuide.vue')
          },
          {
            path: 'prompt',
            name: 'WorkPrompt',
            component: () => import('@/views/works/WorkPrompt.vue')
          }
        ]
      },
      {
        path: 'categories',
        name: 'Categories',
        redirect: '/dashboard/categories/list',
        children: [
          {
            path: 'list',
            name: 'CategoryList',
            component: () => import('@/views/categories/CategoryList.vue')
          },
          {
            path: 'add',
            name: 'CategoryAdd',
            component: () => import('@/views/categories/CategoryAdd.vue')
          },
          {
            path: 'edit/:id',
            name: 'CategoryEdit',
            component: () => import('@/views/categories/CategoryEdit.vue')
          }
        ]
      },
      {
        path: 'users',
        name: 'Users',
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: () => import('@/views/users/UserList.vue')
          }
        ]
      },
      {
        path: 'system',
        name: 'System',
        children: [
          {
            path: 'accounts',
            name: 'AccountManage',
            component: () => import('@/views/system/AccountManage.vue')
          },
          {
            path: 'roles',
            name: 'RoleManage',
            component: () => import('@/views/system/RoleManage.vue')
          }
        ]
      }
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
  const token = store.getters['user/token']
  
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
