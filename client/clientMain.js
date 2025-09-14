// 导入 polyfills（必须在其他导入之前）
import '../src/polyfills'

import Vue from 'vue'
import App from './ClientApp.vue'
import router from './clientRouter'
import store from './clientStore'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '../src/styles/global.scss'
import '../src/styles/components.scss'
import '../src/styles/layout.scss'

Vue.use(Antd)
Vue.config.productionTip = false

window.Vue = Vue;
window.$store = store;
window.$router = router;

// 初始化认证状态
store.dispatch('auth/initAuth')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#client-app')
