const apiUrl = `"http://172.27.4.71:9088"`;
const wsUrl = `"ws://172.27.4.71:9088/websocket/"`;
// 本地环境
module.exports = {
  NODE_ENV: '"development"',
  apiUrl: apiUrl,
  wsUrl: wsUrl,
  urlPrefix: '"/api"'
};
