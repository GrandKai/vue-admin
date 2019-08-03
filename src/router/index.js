import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/layout/Welcome.vue'
import Index from '@/layout/Index.vue'
import Login from '@/views/Login.vue';

import routes from './routes';

Vue.use(Router);
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      // name: 'Index',
      component: Index,
      children: [
        {path: '', component: Welcome},

        ...routes
      ]
    },
  ]
});

router.beforeEach((to, from, next) => {
  let accessToken = sessionStorage.getItem('accessToken');
  let refreshToken = sessionStorage.getItem('accessToken');

  // 如果 token 不存在并且不在登录页面则跳转至登录页面
  if (!accessToken && !refreshToken && to.fullPath !== '/login') {
    next('/login');
    // window.location.href = "https:///www.baidu.com"
  } else {
    next();
  }
});

export default router;
