import Vue from 'vue'
import Router from 'vue-router'

import GoodLists from './../views/GoodsList.vue'
import Cart from './../views/Cart.vue'
import Address from './../views/Address.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodLists',
      component: GoodLists
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    }
  ]
})
