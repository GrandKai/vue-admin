const About = () => import('views/About.vue');


const UserList = () => import('views/user/List.vue');
const SystemList = () => import('views/general/plat/List.vue');
const SystemAdd = () => import('views/general/plat/Add.vue');

const DictionaryTypeList = () => import('views/dictionary/type/List.vue');

let router = [
  {
    path: 'about',
    name: 'about',
    component: About
  },
  {
    path: 'user/list',
    component: UserList
  },
  {
    path: 'system/list',
    component: SystemList
  },
  {
    path: 'system/add',
    component: SystemAdd
  },
  {
    path: 'dictionary/type/list',
    name: 'dictionaryTypeList',
    component: DictionaryTypeList
  },
];

export default router;