import {authority} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryAuthorityPage = param => $http.post(authority.QUERY_PAGE, param);
export const queryAuthorityList = param => $http.post(authority.QUERY_LIST, param);
export const queryAuthorityGrantedIds = param => $http.post(authority.QUERY_GRANTED_IDS, param);

export const addAuthority = param => $http.post(authority.ADD, param);
export const updateAuthority = param => $http.post(authority.UPDATE, param);
export const setAuthority = param => $http.post(authority.SET, param);
export const deleteAuthority = param => $http.post(authority.DELETE, param);

// export const stopAuthority = param => $http.post(authority.STOP, param);
// export const checkExistAuthority = param => $http.post(authority.CHECK_EXIST, param);
// export const checkUpdateExistAuthority = param => $http.post(authority.CHECK_UPDATE_EXIST, param);

