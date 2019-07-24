import {information} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryEntityPage = param => $http.post(information.QUERY_PAGE, param);

export const getEntity = param => $http.post(information.GET, param);
export const addEntity = (param) => {

    console.log("添加/修改资讯", param);
    let url;
    if (param.content.id) {
        url = information.UPDATE;
    } else {
        url = information.ADD;
    }
    return $http.post(url, param);

};
export const deleteEntity = param => $http.post(information.DELETE, param);

export const uploadImage = param => $http.post(information.UPDATE, param);

