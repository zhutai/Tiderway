import Vue from 'vue'
import store from './store'
import App from './App'
import { msg, json, prePage } from './mock' // mock模拟数据可删除
import http from '@/api/service.js' // 全局挂载引入，配置相关在该index.js文件里修改

Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$http = http;
Vue.prototype.$api = { msg, json, prePage };

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()