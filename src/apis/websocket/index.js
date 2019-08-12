import {websocket} from '@/constant/apiUrl';
import $http from '@/utils/axios'

export const sendMessage = param => $http.post(websocket.SEND_MESSAGE, param);
