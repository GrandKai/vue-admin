import {label, labelGroup} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryLabelPage = param => $http.post(label.QUERY_PAGE, param);
export const queryLabelGroupPage = param => $http.post(labelGroup.QUERY_PAGE, param);

export const queryLabelList = param => $http.post(label.QUERY_LIST, param);
export const queryLabelGroupList = param => $http.post(labelGroup.QUERY_LIST, param);

export const addLabel = param => $http.post(label.ADD, param);
export const addLabelGroup = param => $http.post(labelGroup.ADD, param);

export const updateLabel = param => $http.post(label.UPDATE, param);
export const updateLabelGroup = param => $http.post(labelGroup.UPDATE, param);

export const deleteLabel = param => $http.post(label.DELETE, param);
export const deleteLabelGroup = param => $http.post(labelGroup.DELETE, param);

export const setLabel = param => $http.post(label.SET, param);
export const setLabelGroup = param => $http.post(labelGroup.SET, param);

export const checkLabelStatus = param => $http.post(label.CHECK_STATUS, param);
export const checkLabelGroupStatus = param => $http.post(labelGroup.CHECK_STATUS, param);

export const checkLabelExist = param => $http.post(label.CHECK_EXIST, param);
export const checkLabelGroupExist = param => $http.post(labelGroup.CHECK_EXIST, param);