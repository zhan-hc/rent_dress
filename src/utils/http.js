import axios from 'axios'
// import router from '@/router'
// import store from '@/store'
import qs from 'qs'

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
    // if (store.state.token) {
    //   config.headers.common['token'] = store.state.token
    // }
    return config
  },
  error => {
    // 对请求错误做什么
    return Promise.reject(error)
  })

// http reponse响应拦截器
axios.interceptors.response.use(
  response => {
    return response
  }
  // ,
  // error => {
  //   if (error.response) {
  //     switch (error.response.status) {
  //       case 401:
  //         localStorage.removeItem('token')
  //         router.replace({
  //           path: '/Login',
  //           query: {redirect: router.currentRoute.fullPath} // 登录成功后跳入浏览的当前页面
  //         })
  //     }
  //   }
  // }
)

export default axios
