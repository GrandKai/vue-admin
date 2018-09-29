import {operation, permission} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryOperationsByPlatId = param => $http.post(operation.QUERY_OPERATIONS_BY_PLAT_ID, param);
export const addOperation = param => $http.post(operation.ADD, param);
export const updateOperation = param => $http.post(operation.UPDATE, param);
export const deleteOperation = param => $http.post(operation.DELETE, param);

export const addPermission = param => $http.post(permission.ADD, param);
export const updatePermission = param => $http.post(permission.UPDATE, param);
export const deletePermission = param => $http.post(permission.DELETE, param);