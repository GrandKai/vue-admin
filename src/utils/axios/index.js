import axios from './axios'
import router from '@/router';

let $http = {
  post: function (url, param) {

    console.info('....................................', process.env);
    let requestUrl = `${urlPrefix + url}`;
    let requestParam = Object.assign({}, param, {
      accessToken: sessionStorage.getItem('accessToken')
    });
    console.info('...........请求url接口地址：', requestUrl, '参数：', requestParam);

    // 返回 Promise 对象方便后续链式调用
    return axios.post(requestUrl, requestParam).then(resp => {

      let data = resp.data;
      let httpStatus = resp.status;

      console.info('...........请求url接口地址结果：', httpStatus, data);

      switch (httpStatus) {
        // 响应 http 状态码
        case 200:
          let code = data.code;
          switch (code) {
            case 200, 2004:
              return Promise.resolve(data);
            case 1001:
              // accessToken 是空，跳转到登录页面
              console.warn('accessToken 是空，跳转到登录页面');
              sessionStorage.clear();
              router.push('/login');
              return Promise.reject(data);
            case 1002:
            case 1003:
              console.warn('移除过期的 accessToken，用 refreshToken 发送请求刷新 accessToken');
              sessionStorage.removeItem("accessToken");

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
                // refresh 过期处理
                if (1013 === data.code) {
                  console.warn('移除过期的 refreshToken, 并跳转到登录页面');
                  sessionStorage.removeItem("refreshToken");
                  router.push('/login');
                  return Promise.resolve(data);
                }
              });

            default:
              console.error('请求数据异常，直接拒绝请求', code, data);
              return Promise.resolve(data);
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
    console.warn('用【refreshToken】刷新【accessToken】结果：', resp);
    if (200 === resp.status) {
      if (200 === resp.data.code) {

        let content = resp.data.content;
        sessionStorage.setItem('accessToken', content.accessToken);
        sessionStorage.setItem('refreshToken', content.refreshToken);
        return Promise.resolve(resp.data);
      } else {
        console.error('用【refreshToken】刷新【accessToken】异常，即将跳转到登录页面，重新登录', resp);
        router.push('/login');
        return Promise.resolve(resp.data);
      }
    } else {
      return Promise.reject("用【refreshToken】刷新【accessToken】响应状态码异常");
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
        return Promise.resolve(resp.data);
      }
    } else {
      console.error("二次请求响应响应状态码异常", resp);
      return Promise.reject("二次请求响应响应状态码异常");
    }
  });
}

export default $http;