import {operation} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryOperationsByPlatId = param => $http.post(operation.QUERY_OPERATIONS_BY_PLAT_ID, param);
export const addOperation = param => $http.post(operation.ADD, param);
export const updateOperation = param => $http.post(operation.UPDATE, param);
export const deleteOperation = param => $http.post(operation.DELETE, param);