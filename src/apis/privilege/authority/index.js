import {authority} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryAuthorityPage = param => $http.post(authority.QUERY_PAGE, param);
export const queryAuthorityList = param => $http.post(authority.QUERY_LIST, param);
export const queryAuthorityGrantedIds = param => $http.post(authority.QUERY_GRANTED_IDS, param);

export const addAuthority = param => $http.post(authority.ADD, param);
export const updateAuthority = param => $http.post(authority.UPDATE, param);
export const setAuthority = param => $http.post(authority.SET, param);
export const deleteAuthority = param => $http.post(authority.DELETE, param);


