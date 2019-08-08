import axios from 'axios'
import store from '@/store'

axios.defaults.timeout = 2 * 60 * 1000;
axios.defaults.baseURL = process.env.urlPrefix;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// Add a request interceptor
axios.interceptors.request.use(config => {
    // Do something before request is sent
    const token = store.getters.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(response => {
        // Do something with response data

        if (200 !== response.status) {

            // TODO: 直接跳转到错误页面
        }
        return response;
    }
    , error => {
        // Do something with response error
        return Promise.reject(error);
    });

export default axios
