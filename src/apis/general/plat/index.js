//引用方法
import {plat} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryPlatPage = param => $http.post(plat.QUERY_PAGE, param);
export const queryPlatList = param => $http.post(plat.QUERY_LIST, param);
export const stopPlat = param => $http.post(plat.STOP, param);
export const addPlat = param => $http.post(plat.ADD, param);
export const updatePlat = param => $http.post(plat.UPDATE, param);
export const deletePlat = param => $http.post(plat.DELETE, param);
export const checkExistPlat = param => $http.post(plat.CHECK_EXIST, param);
export const checkUpdateExistPlat = param => $http.post(plat.CHECK_UPDATE_EXIST, param);

export const queryAllPlatsAndRoles = param => $http.post(plat.QUERY_ALL_PLATS_AND_ROLES, param);
