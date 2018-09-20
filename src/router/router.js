import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/layout/Welcome.vue'
import Index from '@/layout/Index.vue'
import UserList from 'views/user/List.vue'
import SystemList from 'views/general/system/List.vue'
import SystemAdd from 'views/general/system/Add.vue'

Vue.use(Router);

console.log('process.env.BASE_URL:', process.env.BASE_URL);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {path: '', component: Welcome},
        {path: 'user/list', component: UserList},
        {path: 'system/list', component: SystemList},
        {path: 'system/add', component: SystemAdd},

        {
          path: 'about',
          name: 'about',
          component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
        },
        {
          path: 'home',
          name: 'home',
          component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
        },
        {
          path: 'dictionary/type/list',
          name: 'dictionaryTypeList',
          component: () => import('../views/dictionary/type/List.vue')
        },
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
  ]
})
