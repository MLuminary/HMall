// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll' //滚动加载
import {currency} from './util/currency'

Vue.config.productionTip = false
Vue.use(infiniteScroll)

Vue.filter("currency",currency)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
}) //.$mount("#app") 也可以通过 mount挂载
