import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/Pages/Index'
import LogReg from '@/Pages/LogReg'

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
        }
      ]
    },
    {
      path: '/LogReg',
      name: 'LogReg',
      component: LogReg
    }
  ]
})
