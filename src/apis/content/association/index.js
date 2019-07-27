import {association} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryEntityList = param => $http.post(association.QUERY_LIST, param);


