const apiUrl = `"http://localhost:9088"`;
const wsUrl = `"ws://localhost:9088/ws/"`;
// 本地环境
module.exports = {
  NODE_ENV: '"development"',
  apiUrl: apiUrl,
  wsUrl: wsUrl,
  urlPrefix: '"/api"'
};
