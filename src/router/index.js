import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/Pages/Index'
import LogReg from '@/Pages/LogReg'
import Item from '@/Pages/Product/Item'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: 'homepage',
          name: 'homepage',
          component: () => import('@/Pages/Index/components/Content')
        },
        {
          path: 'product',
          name: 'product',
          component: () => import('@/Pages/Product')
        }
      ]
    },
    {
      path: '/LogReg',
      name: 'LogReg',
      component: LogReg
    },
    {
      path: '/Product/Item/:pid',
      name: 'Item',
      component: Item
    }
  ]
})
