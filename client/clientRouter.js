import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './clientStore'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/collect'
  },
  {
    path: '/login',
    name: 'ClientLogin',
    component: () => import('./views/ClientLogin.vue')
  },
  {
    path: '/collect',
    name: 'Collect',
    component: () => import('./views/Collect.vue'),
    meta: {
      title: '提示词收集',
      icon: 'collection',
      requiresAuth: true
    }
  },
  {
    path: '/collect/add',
    name: 'CollectAdd',
    component: () => import('./views/CollectAdd.vue'),
    meta: {
      title: '添加提示词',
      icon: 'plus',
      requiresAuth: true
    }
  },
  {
    path: '/collect/my',
    name: 'CollectMy',
    component: () => import('./views/CollectMy.vue'),
    meta: {
      title: '我的提示词',
      icon: 'user',
      requiresAuth: true
    }
  },
  {
    path: '/collect/preview/:id?',
    name: 'CollectPreview',
    component: () => import('./views/CollectPreview.vue'),
    meta: {
      title: '提示词预览',
      icon: 'eye',
      requiresAuth: true,
      hidden: true
    }
  },
  {
    path: '/prompt/preview/:id?',
    name: 'PromptPreview',
    component: () => import('./views/PromptPreview.vue'),
    meta: {
      title: '提示词预览',
      icon: 'eye',
      requiresAuth: true,
      hidden: true
    }
  },
  {
    path: '*',
    redirect: '/collect'
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
  console.log('[client router] token', token)
  
  if (to.path === '/login') {
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.meta.requiresAuth && !token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
