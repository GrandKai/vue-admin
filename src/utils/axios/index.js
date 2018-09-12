import axios from './axios'

let $http = {
  post: function (url, param) {

    let requestUrl = '/api' + url;
    console.log('执行post方法', requestUrl);

    // 返回 axios.post().then() 方便后续链式调用
    return axios.post(requestUrl, param).then(resp => {

      let data = resp.data;
      let status = resp.status;

      switch (status) {
        case 200:
          return Promise.resolve(data);
        default:
          console.error('请求状态异常', status);
          return Promise.reject('请求状态异常');
      }
    });
  }
};

export default $http;