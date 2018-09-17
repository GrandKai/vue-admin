import Vue from 'vue'
import ElementUI from 'element-ui'
import '@/assets/styles/element-variables.scss' // 皮肤 css
// import 'element-ui/lib/theme-chalk/index.css'

import App from '@/App.vue'
import router from '@/router/router'
import store from '@/store/store'

import axios from '@/utils/axios'
import common from '@/utils/common'

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

// axios 请求
Vue.prototype.$http = axios;
window.$http = axios;

// 工具类
Vue.prototype.common = common;
window.common = common;

// 分页条目类型
window.pageSizes = [10, 20, 50, 100 , 200 , 400];

let vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

export const $vm = vue;