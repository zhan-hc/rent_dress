// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import axios from './utils/http'
import ViewUI from 'view-design'
import VDistpicker from 'v-distpicker'
import moment from 'moment'
import './assets/iconfont/iconfont.css'
import 'view-design/dist/styles/iview.css'
import 'swiper/swiper-bundle.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)

Vue.component('v-distpicker', VDistpicker)
Vue.config.devtools = true
Vue.use(ViewUI)
Vue.prototype.moment = moment
Vue.prototype.$axios = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
