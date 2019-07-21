import {information} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryEntityPage = param => $http.post(information.QUERY_PAGE, param);
export const updateEntityStopStatus = param => $http.post(information.STOP, param);

export const checkExist = param => $http.post(information.CHECK_EXIST, param);
export const checkUpdateExist = param => $http.post(information.CHECK_UPDATE_EXIST, param);
export const queryEntityRoleList = param => $http.post(information.QUERY_USER_ROLES, param);

export const addEntity = param => $http.post(information.ADD, param);
export const updateEntity = param => $http.post(information.UPDATE, param);
export const deleteEntity = param => $http.post(information.DELETE, param);

export const resetEntity = param => $http.post(information.RESET, param);
export const addEntityRoles = param => $http.post(information.ADD_USER_ROLES, param);