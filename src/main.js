// 导入 polyfills（必须在其他导入之前）
import './polyfills'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/styles/global.scss'
import '@/styles/components.scss'
import '@/styles/layout.scss'

Vue.use(Antd)
Vue.config.productionTip = false

window.Vue = Vue;
window.$store = store;
window.$router = router;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
