import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './clientStore'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
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
    path: '/collect/list',
    name: 'CollectIndex',
    component: () => import('./views/Collect.vue'),
    meta: {
      title: '收集首页',
      icon: 'collection'
    }
  },
  {
    path: '/collect/add',
    name: 'CollectAdd',
    component: () => import('./views/CollectAdd.vue'),
    meta: {
      title: '新增分组',
      icon: 'plus'
    }
  },
  {
    path: '/collect/my',
    name: 'CollectMy',
    component: () => import('./views/CollectMy.vue'),
    meta: {
      title: '我的收集',
      icon: 'user'
    }
  },
  {
    path: '/collect/preview/:id?',
    name: 'CollectPreview',
    component: () => import('./views/CollectPreview.vue'),
    meta: {
      title: '收集预览',
      icon: 'eye',
      hidden: true
    }
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
  console.log('[client router] Navigating from', from.path, 'to', to.path)
  console.log('[client router] Route matched:', to.matched)
  console.log('[client router] Route component:', to.matched[to.matched.length - 1]?.components?.default)
  
  // 暂时简化路由守卫，直接允许所有路由
  next()
})

export default router
