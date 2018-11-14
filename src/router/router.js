//页面配置文件
const About = () => import('views/About.vue');

const UserList = () => import('views/user/List.vue');
const UserAdd = () => import('views/user/Add.vue');

const SystemList = () => import('views/general/plat/List.vue');
const SystemAdd = () => import('views/general/plat/Add.vue');

const MenuList = () => import('views/general/menu/List.vue');
const OrganizationList = () => import('views/system/organization/List.vue');

const OperationList = () => import('views/general/operation/List.vue');
const OperationAdd = () => import('views/general/operation/Add.vue');


const AuthorityList = () => import('views/privilege/authority/List.vue');
const AuthorityAdd = () => import('views/privilege/authority/Add.vue');

const RoleList = () => import('views/privilege/role/List.vue');
const RoleAdd = () => import('views/privilege/role/Add.vue');

const TestTree = () => import('components/business/tree/Test.vue');

const DictionaryTypeList = () => import('views/dictionary/type/List.vue');
const DictionaryTypeAdd = () => import('views/dictionary/type/Add.vue');

const DictionaryItemList = () => import('views/dictionary/item/List.vue');
const DictionaryItemAdd = () => import('views/dictionary/item/Add.vue');

const DemoCKEditor = () => import('views/demo/DemoCKEditor.vue');
let router = [
  {
    path: 'ckeditor',
    component: DemoCKEditor

  },

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
        path: 'plat',
        component: SystemList
    },
    {
        path: 'plat/add',
        component: SystemAdd
    },
    {
        path: 'menu',
        component: MenuList
    },
    {
        path: 'organization',
        component: OrganizationList
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
        path: 'dictionary/type',
        component: DictionaryTypeList
    },

    {
        path: 'dictionary/type/add',
        component: DictionaryTypeAdd
    },
    {
        path: 'dictionary/item',
        component: DictionaryItemList
    },

    {
        path: 'dictionary/item/add',
        component: DictionaryItemAdd
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
