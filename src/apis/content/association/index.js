import {association} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryInformationList = param => $http.post(association.QUERY_INFORMATION_LIST, param);
export const queryLabelsList = param => $http.post(association.QUERY_LABEL_LIST, param);


