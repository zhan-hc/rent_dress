import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/Pages/Index'
import LogReg from '@/Pages/LogReg'
import Item from '@/Pages/Product/Item'
import Order from '@/Pages/Order'
import Result from '@/Pages/Order/Result'

Vue.use(Router)
// 防止路由重复报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: '/homepage',
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
    },
    {
      path: '/Order',
      name: 'Order',
      component: Order
    },
    {
      path: '/result',
      name: 'result',
      component: Result
    }
  ]
})
