import axios from 'axios'

const http = axios.create ({
  baseURL: process.env.urlPrefix,
  timeout: 5000,
  headers: {'Content-Type': 'application/json'},
});

// Add a request interceptor
http.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = sessionStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
http.interceptors.response.use(function (response) {
  // Do something with response data

  if (200 !== response.status) {

    // TODO: 直接跳转到错误页面
  }
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default http
