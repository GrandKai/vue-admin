import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'

import ElementUI from 'element-ui'
import echarts from 'echarts'
import '@/assets/icon/iconfont.css' // 自定义 icon
import '@/assets/styles/element-variables.scss' // 皮肤 css
// import 'element-ui/lib/theme-chalk/index.css'
import * as constant from '@/constant/index.js'

import axios from '@/utils/axios'
import common from '@/utils/common'
import '@/utils/dialogDrag';

import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'small', zIndex: 3000 });
Vue.use(iView);

// 将 echarts 注册成Vue的全局属性
Vue.prototype.$echarts = echarts;
window.$echarts = echarts;

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

if ('development' !== process.env.NODE_ENV) {
  console.log = function () {
    return false;
  };
}
// 常量设置
Vue.prototype.constant = constant;
window.constant = constant;

let vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

export const $vm = vue;
