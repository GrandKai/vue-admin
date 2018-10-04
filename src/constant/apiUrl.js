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
  QUERY_MENUS_BY_PLAT_ID: '/menu/query/by/platId',
  ADD: '/menu/add',
  UPDATE: '/menu/update',
  DELETE: '/menu/delete',
};

//用户管理
export const user = {
  QUERY_USER_BY_USER_NAME: '/user/queryUserByUserName',
  ADD_USER_INFO: '/user/addUserInfo'
}

export const operation = {
  QUERY_OPERATIONS_BY_PLAT_ID: '/operation/query/by/platId',
  ADD: '/operation/add',
  UPDATE: '/operation/update',
  DELETE: '/operation/delete',
};

export const permission = {
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
  CHECK_EXIST: '/dictionary/type/check/exist',
  CHECK_UPDATE_EXIST: '/dictionary/type/check/update/exist',
};

export const authority = {
    QUERY_PAGE: '/authority',
    ADD: '/authority/add',
    UPDATE: '/authority/update',
    DELETE: '/authority/delete',
    CHECK_EXIST: '/authority/check/exist',
    CHECK_UPDATE_EXIST: '/authority/check/update/exist',
};


export const role = {
    QUERY_PAGE: '/role',
    ADD: '/role/add',
    UPDATE: '/role/update',
    DELETE: '/role/delete',
    CHECK_EXIST: '/role/check/exist',
    CHECK_UPDATE_EXIST: '/role/check/update/exist',
  QUERY_LIST: '/role/list',
  QUERY_USER_ROLE: '/role/select/user'
};