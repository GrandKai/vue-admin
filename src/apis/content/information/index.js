import {information} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryEntityPage = param => $http.post(information.QUERY_PAGE, param);

export const checkExist = param => $http.post(information.CHECK_EXIST, param);

export const addEntity = param => $http.post(information.ADD, param);
export const updateEntity = param => $http.post(information.UPDATE, param);
export const deleteEntity = param => $http.post(information.DELETE, param);

