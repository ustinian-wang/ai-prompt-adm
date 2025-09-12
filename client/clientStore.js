import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import user from './modules/user'
import works from './modules/works'
import categories from './modules/categories'
import memGroup from './modules/memGroup'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    user,
    works,
    categories,
    memGroup
  }
})
