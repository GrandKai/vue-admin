import {catalog} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryCatalogList = param => $http.post(catalog.QUERY_LIST, param);
export const addEntity = param => $http.post(catalog.ADD, param);
export const updateEntity = param => $http.post(catalog.UPDATE, param);
export const deleteEntity = param => $http.post(catalog.DELETE, param);
export const uploadEntityImage = param => $http.post(catalog.UPLOAD, param);