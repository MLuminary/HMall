import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld' //@相当于src
import GoodLists from './../views/GoodsList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/goods/:goodsId',
      name: 'GoodLists',
      component: GoodLists
    }
  ]
})
