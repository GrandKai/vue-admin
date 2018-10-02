
//页面配置文件
const About = () => import('views/About.vue');


const UserList = () => import('views/user/List.vue');
const UserAdd = () => import('views/user/Add.vue');

const SystemList = () => import('views/general/plat/List.vue');
const SystemAdd = () => import('views/general/plat/Add.vue');

const MenuList = () => import('views/general/menu/List.vue');
const MenuAdd = () => import('views/general/menu/Add.vue');

const OperationList = () => import('views/general/operation/List.vue');
const OperationAdd = () => import('views/general/operation/Add.vue');


const AuthorityList = () => import('views/privilege/authority/List.vue');
const AuthorityAdd = () => import('views/privilege/authority/Add.vue');

const RoleList = () => import('views/privilege/role/List.vue');
const RoleAdd = () => import('views/privilege/role/Add.vue');

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
    path: 'user/add',
    component: UserAdd
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
    component: DictionaryTypeList
  },

  {
      path: 'authority',
      component: AuthorityList
  },

    {
        path: 'authority/add',
        component: AuthorityAdd
    },

  {
      path: 'role',
      component: RoleList
  },

    {
        path: 'role/add',
        component: RoleAdd
    },
];

export default router;