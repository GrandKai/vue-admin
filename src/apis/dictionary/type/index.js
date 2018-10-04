import {dictionaryType} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryDictionaryTypePage = param => $http.post(dictionaryType.QUERY_PAGE, param);

export const addDictionaryType = param => $http.post(dictionaryType.ADD, param);
export const updateDictionaryType = param => $http.post(dictionaryType.UPDATE, param);
export const deleteDictionaryType = param => $http.post(dictionaryType.DELETE, param);
export const setDictionaryType = param => $http.post(dictionaryType.SET, param);