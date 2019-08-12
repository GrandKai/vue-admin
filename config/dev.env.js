const hostUrl = '"http://172.27.4.71:9088"';
// 本地环境
module.exports = {
  NODE_ENV: '"development"',
  hostUrl: hostUrl,
  WS_API: hostUrl + '/websocket/',
  urlPrefix: '"/api"'
};
