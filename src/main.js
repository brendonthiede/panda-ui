import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Routes from './services/Routes'
import App from './App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: Routes.router,
  render: h => h(App)
})
