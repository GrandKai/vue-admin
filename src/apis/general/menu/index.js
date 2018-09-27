import {menu} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryMenusByPlatId = param => $http.post(menu.QUERY_MENUS_BY_PLAT_ID, param);
export const addMenu = param => $http.post(menu.ADD, param);
export const updateMenu = param => $http.post(menu.UPDATE, param);
export const deleteMenu = param => $http.post(menu.DELETE, param);