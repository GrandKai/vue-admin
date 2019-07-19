import {catalog} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryCatalogList = param => $http.post(catalog.QUERY_LIST, param);
export const addCatalog = param => $http.post(catalog.ADD, param);
export const updateCatalog = param => $http.post(catalog.UPDATE, param);
export const deleteCatalog = param => $http.post(catalog.DELETE, param);
export const uploadCatalogImage = param => $http.post(catalog.UPLOAD, param);