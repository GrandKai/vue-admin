import {operation, permission} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryOperationList = param => $http.post(operation.QUERY_LIST, param);
export const addOperation = param => $http.post(operation.ADD, param);
export const updateOperation = param => $http.post(operation.UPDATE, param);
export const deleteOperation = param => $http.post(operation.DELETE, param);

export const queryPermissionList = param => $http.post(permission.QUERY_LIST, param);
export const addPermission = param => $http.post(permission.ADD, param);
export const updatePermission = param => $http.post(permission.UPDATE, param);
export const deletePermission = param => $http.post(permission.DELETE, param);