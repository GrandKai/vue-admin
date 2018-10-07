import {user} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryUserByUserName = param => $http.post(user.QUERY_USER_BY_USER_NAME, param);

export const addUserInfo = param => $http.post(user.ADD_USER_INFO, param);
// export const updateMenu = param => $http.post(menu.UPDATE, param);
export const deleteUser = param => $http.post(user.DELETE_USER, param);