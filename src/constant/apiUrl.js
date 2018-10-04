
// 白名单
export const auth = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    MENUS: '/auth/menu/list',
    PLATS: '/auth/plat/list',
};

//后台方法配置
export const plat = {
  QUERY_PAGE: '/plat',
  QUERY_LIST: '/plat/list',
  STOP: '/plat/stop',
  ADD: '/plat/add',
  UPDATE: '/plat/update',
  DELETE: '/plat/delete',
  CHECK_EXIST: '/plat/check/exist',
  CHECK_UPDATE_EXIST: '/plat/check/update/exist',
};

export const menu = {
  QUERY_LIST: '/menu/list',
  ADD: '/menu/add',
  UPDATE: '/menu/update',
  DELETE: '/menu/delete',
};

//用户管理
export const user = {
  QUERY_USER_BY_USER_NAME: '/user/queryUserByUserName',
  ADD_USER_INFO: '/user/addUserInfo'
};

export const operation = {
  QUERY_LIST: '/operation/list',
  QUERY_GRANTED_LIST: '/operation/granted/list',
  ADD: '/operation/add',
  UPDATE: '/operation/update',
  DELETE: '/operation/delete',
};

export const permission = {
  QUERY_LIST: '/permission/list',
  ADD: '/permission/add',
  UPDATE: '/permission/update',
  DELETE: '/permission/delete',
};

export const dictionaryItem = {
  QUERY_PAGE: '/dictionary/item',
  QUERY_LIST: '/dictionary/item/list',
  UPDATE: '/dictionary/item/update',
  DELETE: '/dictionary/item/delete',
  CHECK_EXIST: '/dictionary/item/check/exist',
  CHECK_UPDATE_EXIST: '/dictionary/item/check/update/exist',
};

export const dictionaryType = {
  QUERY_PAGE: '/dictionary/type',
  UPDATE: '/dictionary/type/update',
  DELETE: '/dictionary/type/delete',
  SET: '/dictionary/type/set',
  CHECK_EXIST: '/dictionary/type/check/exist',
  CHECK_UPDATE_EXIST: '/dictionary/type/check/update/exist',
};

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
    QUERY_USER_ROLE: '/role/select/user',
    QUERY_ALL_PLATS_AND_ROLES: '/role/plat/all'
};