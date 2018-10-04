import {role} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryRolePage = param => $http.post(role.QUERY_PAGE, param);
export const queryRoleList = param => $http.post(role.QUERY_LIST, param);//获取用户角色的树形结构
export const queryRoleUserList = param => $http.post(role.QUERY_USER_ROLE, param);
export const addRole = param => $http.post(role.ADD, param);
export const updateRole = param => $http.post(role.UPDATE, param);
export const deleteRole = param => $http.post(role.DELETE, param);
// export const checkExistRole = param => $http.post(role.CHECK_EXIST, param);
// export const checkUpdateExistRole = param => $http.post(role.CHECK_UPDATE_EXIST, param);

