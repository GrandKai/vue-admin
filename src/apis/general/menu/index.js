import {menu} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const queryMenusByPlatId = param => $http.post(menu.QUERY_MENUS_BY_PLAT_ID, param);