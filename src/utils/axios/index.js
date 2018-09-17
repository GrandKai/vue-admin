import axios from './axios'

let $http = {
  post: function (url, param) {

    let requestUrl = '/api' + url;
    let requestParam = Object.assign({}, param, {
      accessToken: sessionStorage.getItem('accessToken')
    });
    console.log('...........请求url接口地址：', requestUrl, '参数：', requestParam);

    // 返回 Promise 对象方便后续链式调用
    return axios.post(requestUrl, requestParam).then(resp => {

      let data = resp.data;
      let status = resp.status;

      console.log('...........请求url接口地址结果：', status, data);
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