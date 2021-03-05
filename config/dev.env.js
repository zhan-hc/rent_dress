'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT:'"http://localhost:8080"' //项目api地址
})
// module.exports = {
//   NODE_ENV: '"production"',
//   VUE_APP_BASE_API:'"http://121.196.151.65:8080"' //项目api地址
//  }
