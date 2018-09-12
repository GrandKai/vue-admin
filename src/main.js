import Vue from 'vue'
import ElementUI from 'element-ui'
import '@/assets/styles/element-variables.scss' // 皮肤 css
// import 'element-ui/lib/theme-chalk/index.css'

import App from '@/App.vue'
import router from '@/router/router'
import store from '@/store/store'

import axios from '@/utils/axios'

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

// axios 请求
Vue.prototype.$http = axios;
window.$http = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
