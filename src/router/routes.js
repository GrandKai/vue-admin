//页面配置文件

const InformationList = () => import('views/content/information/List.vue');
const InformationAdd = () => import('views/content/information/Add.vue');

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

const DictionaryTypeList = () => import('views/dictionary/type/List.vue');
const DictionaryItemList = () => import('views/dictionary/item/List.vue');

const DemoEcharts = () => import('views/demo/DemoEcharts.vue');
const DemoCKEditor = () => import('views/demo/DemoCKEditor.vue');
const DemoAvatar = () => import('views/demo/DemoAvatar.vue');
const DemoWebSocket = () => import('views/demo/DemoWebSocket.vue');


const CatalogList = () => import('views/catalog/List.vue');
const LabelList = () => import('views/label/LabelList.vue');
const LabelGroupList = () => import('views/label/LabelGroupList.vue');
let routes = [

    {
        path: 'websocket',
        component: DemoWebSocket
    },
    {
        path: 'label',
        component: LabelList
    },
    {
        path: 'label/group',
        component: LabelGroupList
    },
    {
        path: 'catalog',
        component: CatalogList
    },
    {
        path: 'avatar',
        component: DemoAvatar

    },
    {
        path: 'echarts',
        component: DemoEcharts

    },
    {
        path: 'ckeditor',
        component: DemoCKEditor

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
        path: 'information',
        component: InformationList
    },
    {
        path: 'information/add',
        component: InformationAdd
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
        path: 'dictionary/item',
        component: DictionaryItemList
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

export default routes;
