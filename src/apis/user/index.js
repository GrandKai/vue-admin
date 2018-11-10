import {user} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const checkExist = param => $http.post(user.CHECK_EXIST, param);

export const addUser = param => $http.post(user.ADD, param);
// export const updateMenu = param => $http.post(menu.UPDATE, param);
export const deleteUser = param => $http.post(user.DELETE, param);

export const addUserRoles = param => $http.post(user.ADD_USER_ROLES, param);
export const queryUserRoleList = param => $http.post(user.QUERY_USER_ROLES, param);