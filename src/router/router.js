const About = () => import('views/About.vue');


const UserList = () => import('views/user/List.vue');
const SystemList = () => import('views/general/plat/List.vue');
const SystemAdd = () => import('views/general/plat/Add.vue');

const MenuList = () => import('views/general/menu/List.vue');
const MenuAdd = () => import('views/general/menu/Add.vue');

const OperationList = () => import('views/general/operation/List.vue');
const OperationAdd = () => import('views/general/operation/Add.vue');


const AuthorityList = () => import('views/privilege/authority/List.vue');

const TestTree = () => import('components/business/tree/Test.vue');

const DictionaryTypeList = () => import('views/dictionary/type/List.vue');

let router = [

  {
    path: 'test/menu',
    component: TestTree
  },
  {
    path: 'about',
    name: 'about',
    component: About
  },
  {
    path: 'user',
    component: UserList
  },
  {
    path: 'system',
    component: SystemList
  },
  {
    path: 'system/add',
    component: SystemAdd
  },
  {
    path: 'menu',
    component: MenuList
  },
  {
    path: 'menu/add',
    component: MenuAdd
  },
  {
    path: 'operation',
    component: OperationList
  },
  {
    path: 'operation/add',
    component: OperationAdd
  },
  {
    path: 'dictionary/type/list',
    name: 'dictionaryTypeList',
    component: DictionaryTypeList
  },

  {
      path: 'authority',
      name: 'authority',
      component: AuthorityList
  },
];

export default router;