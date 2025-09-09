import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './clientStore'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/collect/list'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('./views/Index.vue'),
    meta: {
      title: '首页',
      icon: 'home'
    }
  },
  {
    path: '/login',
    name: 'ClientLogin',
    component: () => import('./views/ClientLogin.vue'),
    meta: {
      title: '会员登录',
      icon: 'login',
      hidden: true
    }
  },
  {
    path: '/register',
    name: 'ClientReg',
    component: () => import('./views/ClientReg.vue'),
    meta: {
      title: '会员注册',
      icon: 'user-add',
      hidden: true
    }
  },
  {
    path: '/collect',
    name: 'Collect',
    redirect: '/collect/list',
    meta: {
      title: '提示词收集',
      icon: 'collection'
    },
    children: [
      {
        path: 'list',
        name: 'CollectIndex',
        component: () => import('./views/Collect.vue'),
        meta: {
          title: '收集首页',
          icon: 'collection'
        }
      },
      {
        path: 'add',
        name: 'CollectAdd',
        component: () => import('./views/CollectAdd.vue'),
        meta: {
          title: '新增分组',
          icon: 'plus'
        }
      },
      {
        path: 'my',
        name: 'CollectMy',
        component: () => import('./views/CollectMy.vue'),
        meta: {
          title: '我的收集',
          icon: 'user'
        }
      },
      {
        path: 'preview/:id?',
        name: 'CollectPreview',
        component: () => import('./views/CollectPreview.vue'),
        meta: {
          title: '收集预览',
          icon: 'eye',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/detail/:id?',
    name: 'IndexDetail',
    component: () => import('./views/IndexDetail.vue'),
    meta: {
      title: '详情',
      icon: 'file-text',
      hidden: true
    }
  },
  {
    path: '*',
    redirect: '/collect/list'
  }
];

const router = new VueRouter({
  mode: 'hash', // 使用hash模式，不需要服务器配置
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = store.getters['auth/token'];
  console.log('[client router] Navigating from', from.path, 'to', to.path)
  console.log('[client router] Route matched:', to.matched)
  console.log('[client router] Route component:', to.matched[to.matched.length - 1]?.components?.default)
  console.log('[client router] token', token)
  
  if (to.path === '/login' || to.path === '/register') {
    if (token) {
      console.log('[client router] User logged in, redirecting to home')
      next('/')
    } else {
      console.log('[client router] User not logged in, allowing login/register')
      next()
    }
  } else {
    if (to.meta.requiresAuth && !token) {
      console.log('[client router] Route requires auth but no token, redirecting to login')
      next('/login')
    } else {
      console.log('[client router] Route allowed, proceeding')
      next()
    }
  }
})

export default router
