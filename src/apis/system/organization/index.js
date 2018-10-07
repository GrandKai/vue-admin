import {organization} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryOrganizationList = param => $http.post(organization.QUERY_LIST, param);
export const addOrganization = param => $http.post(organization.ADD, param);
export const updateOrganization = param => $http.post(organization.UPDATE, param);
export const deleteOrganization = param => $http.post(organization.DELETE, param);