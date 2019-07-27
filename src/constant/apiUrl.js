// 白名单
export const auth = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  MODIFY_PASSWORD: '/auth/modify/password',
  MENUS: '/auth/menu/list',
  PLATS: '/auth/plat/list',
};

// 组织机构
export const organization = {
  QUERY_LIST: '/org/list',
  ADD: '/org/add',
  UPDATE: '/org/update',
  DELETE: '/org/delete',
  CHECK_STATUS: '/org/check/status',
};

// 后台方法配置
export const plat = {
  QUERY_PAGE: '/plat',
  QUERY_LIST: '/plat/list',
  STOP: '/plat/stop',
  ADD: '/plat/add',
  UPDATE: '/plat/update',
  DELETE: '/plat/delete',
  CHECK_EXIST: '/plat/check/exist',
  CHECK_UPDATE_EXIST: '/plat/check/update/exist',
  QUERY_ALL_PLATS_AND_ROLES: '/plat/role/list'
};

// 栏目管理
export const catalog = {
  QUERY_LIST: '/catalog/list',
  ADD: '/catalog/add',
  UPDATE: '/catalog/update',
  DELETE: '/catalog/delete',
  UPLOAD: '/catalog/upload',
};

// 菜单管理
export const menu = {
  QUERY_LIST: '/menu/list',
  ADD: '/menu/add',
  UPDATE: '/menu/update',
  DELETE: '/menu/delete',
};

// 用户管理
export const user = {
  QUERY_PAGE: '/user',
  CHECK_EXIST: '/user/check/exist',
  CHECK_UPDATE_EXIST: '/user/check/update/exist',
  ADD: '/user/add',
  UPDATE: '/user/update',
  DELETE: '/user/delete', // 删除用户信息 置状态
  STOP: '/user/stop', // 停用 置状态
  RESET: '/user/reset/password',
  ADD_USER_ROLES: '/user/add/roles',
  QUERY_USER_ROLES: '/user/select/roles',
};
// 关联内容
export const association = {
  QUERY_LIST: '/association/list/information',
  // ADD: '/association/add',
  // UPDATE: '/association/update',
  // DELETE: '/association/delete',
  // CHECK_STATUS: '/association/check/status',
};
// 资讯管理
export const information = {
  QUERY_PAGE: '/information',
  QUERY_PAGE_SIMPLE: '/information/page/simple',
  GET: '/information/get',
  ADD: '/information/add',
  UPDATE: '/information/update',
  DELETE: '/information/delete',
  UPLOAD: '/information/upload',
};

// 操作管理
export const operation = {
  QUERY_LIST: '/operation/list',
  QUERY_GRANTED_LIST: '/operation/granted/list',
  ADD: '/operation/add',
  UPDATE: '/operation/update',
  DELETE: '/operation/delete',
};

// 子操作管理
export const permission = {
  QUERY_LIST: '/permission/list',
  ADD: '/permission/add',
  UPDATE: '/permission/update',
  DELETE: '/permission/delete',
};

// 标签管理
export const label = {
  QUERY_PAGE: '/label',
  QUERY_LIST: '/label/list',
  ADD: '/label/add',
  UPDATE: '/label/update',
  DELETE: '/label/delete',
  SET: '/label/set',
  CHECK_EXIST: '/label/check/exist',
  CHECK_STATUS: '/label/check/status',
};

// 标签组管理
export const labelGroup = {
  QUERY_PAGE: '/label/group',
  QUERY_LIST: '/label/group/list',
  ADD: '/label/group/add',
  UPDATE: '/label/group/update',
  DELETE: '/label/group/delete',
  SET: '/label/group/set',
  CHECK_EXIST: '/label/group/check/exist',
  CHECK_STATUS: '/label/group/check/status',
};

// 数据项目管理
export const dictionaryItem = {
  QUERY_PAGE: '/dictionary/item',
  QUERY_LIST: '/dictionary/item/list',
  ADD: '/dictionary/item/add',
  UPDATE: '/dictionary/item/update',
  DELETE: '/dictionary/item/delete',
  SET: '/dictionary/item/set',
  CHECK_EXIST: '/dictionary/item/check/exist',
};

// 数据类型管理
export const dictionaryType = {
  QUERY_PAGE: '/dictionary/type',
  QUERY_LIST: '/dictionary/type/list',
  ADD: '/dictionary/type/add',
  UPDATE: '/dictionary/type/update',
  DELETE: '/dictionary/type/delete',
  SET: '/dictionary/type/set',
  CHECK_STATUS: '/dictionary/type/check/status',
  CHECK_EXIST: '/dictionary/type/check/exist',
};

// 权限管理
export const authority = {
  QUERY_PAGE: '/authority',
  QUERY_LIST: '/authority/list',
  ADD: '/authority/add',
  UPDATE: '/authority/update',
  SET: '/authority/set',
  DELETE: '/authority/delete',
  CHECK_EXIST: '/authority/check/exist',
  CHECK_UPDATE_EXIST: '/authority/check/update/exist',
  QUERY_GRANTED_IDS: '/authority/granted/ids',
};

// 角色管理
export const role = {
  QUERY_PAGE: '/role',
  QUERY_List: '/role/list',
  ADD: '/role/add',
  AUTHORITY_ADD: '/role/authority/add',
  UPDATE: '/role/update',
  DELETE: '/role/delete',
  CHECK_EXIST: '/role/check/exist',
  CHECK_UPDATE_EXIST: '/role/check/update/exist',
  QUERY_ROLE_AUTHORITY_LIST: '/role/authority/list',
};