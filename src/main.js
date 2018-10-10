import Vue from 'vue'
import ElementUI from 'element-ui'
import '@/assets/styles/element-variables.scss' // 皮肤 css
// import 'element-ui/lib/theme-chalk/index.css'

import App from '@/App.vue'
import router from '@/router'
// import store from '@/store/store'
import store from '@/store'

import axios from '@/utils/axios'
import common from '@/utils/common'
import '@/utils/dialogDrag';

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

// axios 请求
Vue.prototype.$http = axios;
window.$http = axios;

// 工具类
Vue.prototype.common = common;
window.common = common;

// api接口路径
// Vue.prototype.apiUrl = process.env.hosturl;
// window.apiUrl = process.env.hosturl;
Vue.prototype.urlPrefix = process.env.urlPrefix;
window.urlPrefix = process.env.urlPrefix;

window.process = process;

// 分页条目类型
window.pageSizes = [10, 20, 50, 100 , 200 , 400];

let vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

export const $vm = vue;