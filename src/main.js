// 导入 polyfills（必须在其他导入之前）
import './polyfills'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/styles/global.scss'

Vue.use(Antd)
Vue.config.productionTip = false

window.Vue = Vue;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
