// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import axios from 'axios'
import router from './router'
import VueLazyload from 'vue-lazyload'
import {currency} from './util/currency'
import infiniteScroll from 'vue-infinite-scroll' //滚动加载

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'
import './assets/css/login.css'

Vue.config.productionTip = false

Vue.use(infiniteScroll)
Vue.use(Vuex)
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3
})

Vue.filter("currency",currency)

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  mounted(){
    this.getCartCount();
  },
  methods:{
    // //是否登录
    // checkLogin(){
    //   axios.get("users/checkLogin").then(res=>{
    //     let data = res.data;
    //     if(data.status === '0'){
    //       this.$store.commit("updateUserInfo", data.result);
    //     }else{
    //       if(this.$route.path != '/'){
    //         this.$router.push('/');
    //       }
    //     }
    //   })
    // },
    //获得购物车的总数量
    getCartCount(){
      axios.get("/users/getCartCount").then(res=>{
        let data = res.data;
        if(data.status === '0'){
          this.$store.commit("updateCartCount",data.result)
        }
      })
    }
  },
  components: { App },
  template: '<App/>'
}); //.$mount("#app") 也可以通过 mount挂载
