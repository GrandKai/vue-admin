import axios from './axios'

let $http = {
  post: function (url, param) {

    console.debug('....................................', process.env);
    let requestUrl = `${urlPrefix + url}`;
    let requestParam = Object.assign({}, param, {
      accessToken: sessionStorage.getItem('accessToken')
    });
    console.debug('...........请求url接口地址：', requestUrl, '参数：', requestParam);

    // 返回 Promise 对象方便后续链式调用
    return axios.post(requestUrl, requestParam).then(resp => {

      let data = resp.data;
      let httpStatus = resp.status;

      console.debug('...........请求url接口地址结果：', httpStatus, data);

      switch (httpStatus) {
        // 响应 http 状态码
        case 200:
          let code = data.code;
          switch (code) {
            case 200:
              return Promise.resolve(data);
            case 1002:
            case 1003:
              // 过期 token 需要重新刷新 token, 再发送请求
              console.warn('过期 token 需要重新刷新 token');

              let refreshParam = {
                refreshToken: sessionStorage.getItem('refreshToken')
              };
              let refreshUrl = `${urlPrefix}/auth/refresh/token`;

              return refreshToken(refreshUrl, refreshParam).then(data => {
                console.warn('refreshToken刷新结果', data);
                if (200 === data.code) {
                  requestParam.accessToken = sessionStorage.getItem('accessToken');
                  return sendSecondRequest(requestUrl, requestParam);
                }
              });

            default:
              console.error('请求数据异常', code, data);
              return Promise.reject('请求数据异常');
          }
        default:
          console.error('请求状态异常', httpStatus);
          return Promise.reject('请求状态异常');
      }
    });
  }
};

function refreshToken(requestUrl, requestParam) {
  return axios.post(requestUrl, requestParam).then((resp) => {
    console.warn('过期 token 需要重新刷新 token 结果', resp);
    if (200 === resp.status) {
      if (200 === resp.data.code) {

        let content = resp.data.content;
        sessionStorage.setItem('accessToken', content.accessToken);
        sessionStorage.setItem('refreshToken', content.refreshToken);
        return Promise.resolve(resp.data);
      } else {
        console.error('刷新token响应code异常', resp);
        console.error('TODO:刷新 accessToken 异常，应该直接跳转到登录页面，重新登录');

        //TODO: 如果刷新 accessToken 异常，直接跳转到登录页面，重新登录
        return Promise.resolve(resp.data);
      }
    } else {
      console.error("刷新 Token 响应状态码异常", resp);
      return Promise.reject("刷新 Token 响应状态码异常");
    }
  });
}

function sendSecondRequest(requestUrl, requestParam) {
  return axios.post(requestUrl, requestParam).then((resp) => {
    console.warn('二次请求响应结果', resp);
    if (200 === resp.status) {
      if (200 === resp.data.code) {
        console.info('二次请求成功', resp.data);
        return Promise.resolve(resp.data);
      } else {
        console.error('二次请求响应响应code异常', resp);
        return Promise.reject(resp.data);
      }
    } else {
      console.error("二次请求响应响应状态码异常", resp);
      return Promise.reject("二次请求响应响应状态码异常");
    }
  });
}

export default $http;