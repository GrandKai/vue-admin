import {auth} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const login = param => $http.post(auth.LOGIN, param);
export const logout = param => $http.post(auth.LOGOUT, param);
export const modifyPassword = param => $http.post(auth.MODIFY_PASSWORD, param);
export const queryGrantedMenus = param => $http.post(auth.MENUS, param);
export const queryGrantedPlats = param => $http.post(auth.PLATS, param);