import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/works',
    component: Layout,
    redirect: '/works/list',
    meta: { title: '作品管理', icon: 'file-text' },
    children: [
      {
        path: 'list',
        name: 'WorkList',
        component: () => import('@/views/works/WorkList.vue'),
        meta: { title: '作品列表' }
      },
      {
        path: 'guide',
        name: 'WorkGuide',
        component: () => import('@/views/works/WorkGuide.vue'),
        meta: { title: '教程描述' }
      },
      {
        path: 'prompt/:id',
        name: 'WorkPrompt',
        component: () => import('@/views/works/WorkPrompt.vue'),
        meta: { title: '提示词配置', hidden: true }
      }
    ]
  },
  {
    path: '/categories',
    component: Layout,
    redirect: '/categories/list',
    meta: { title: '分类管理', icon: 'folder' },
    children: [
      {
        path: 'list',
        name: 'CategoryList',
        component: () => import('@/views/categories/CategoryList.vue'),
        meta: { title: '分类列表' }
      },
      {
        path: 'add',
        name: 'CategoryAdd',
        component: () => import('@/views/categories/CategoryAdd.vue'),
        meta: { title: '添加分类' }
      },
      {
        path: 'edit/:id',
        name: 'CategoryEdit',
        component: () => import('@/views/categories/CategoryEdit.vue'),
        meta: { title: '编辑分类', hidden: true }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users/list',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/users/UserList.vue'),
        meta: { title: '用户列表' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/accounts',
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      {
        path: 'accounts',
        name: 'AccountManage',
        component: () => import('@/views/system/AccountManage.vue'),
        meta: { title: '账号管理' }
      },
      {
        path: 'roles',
        name: 'RoleManage',
        component: () => import('@/views/system/RoleManage.vue'),
        meta: { title: '角色管理' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path === '/login') {
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
