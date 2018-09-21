import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/layout/Welcome.vue'
import Index from '@/layout/Index.vue'
import Login from '@/views/Login.vue';

import router from './router';

Vue.use(Router);

console.log('process.env.BASE_URL:', process.env.BASE_URL);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {path: '', component: Welcome},

        ...router
      ]
    },
  ]
})
