import {dictionaryItem} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryDictionaryItemPage = param => $http.post(dictionaryItem.QUERY_PAGE, param);
export const queryDictionaryItemList = param => $http.post(dictionaryItem.QUERY_LIST, param);

export const addDictionaryItem = param => $http.post(dictionaryItem.ADD, param);
export const updateDictionaryItem = param => $http.post(dictionaryItem.UPDATE, param);
export const deleteDictionaryItem = param => $http.post(dictionaryItem.DELETE, param);