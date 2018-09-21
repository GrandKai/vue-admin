import {plat} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryPlatPage = param => $http.post(plat.QUERY_PAGE, param);
export const stopPlat = param => $http.post(plat.STOP, param);
export const addPlat = param => $http.post(plat.ADD, param);
export const updatePlat = param => $http.post(plat.UPDATE, param);
export const deletePlat = param => $http.post(plat.DELETE, param);
export const checkExistPlat = param => $http.post(plat.CHECK_EXIST, param);

