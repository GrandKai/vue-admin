let path = require('path');

const resolve = dir => {
  return path.join(__dirname, dir);
};

let proEnv = require('./config/pro.env');  // 生产环境
let uatEnv = require('./config/uat.env');  // 测试环境
let devEnv = require('./config/dev.env');  // 本地环境

const env = process.env.NODE_ENV;

let target = '';
// 默认是本地环境
if (env === 'production') {  // 生产环境
  target = proEnv.hosturl;
} else if (env === 'test') { // 测试环境
  target = uatEnv.hosturl;
} else {  // 本地环境
  target = devEnv.hosturl;
}

const devProxy = ['/api'];  // 代理
// 生成代理配置对象
let proxyObj = {};
devProxy.forEach((value, index) => {
  proxyObj[value] = {
    target: target,
    changeOrigin: true,
    pathRewrite: {
      [`^${value}`]: ''
    }
  };
});

module.exports = {
  lintOnSave: false,
  // 打包时不生成.map文件
  // productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'source-map'
      // mutate config for production...
    }
  },
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('styles', resolve('src/assets/styles'))
      .set('images', resolve('src/assets/images'))
      .set('components', resolve('src/components'))
      .set('layout', resolve('src/layout'))
      .set('views', resolve('src/views'))
  },
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    // open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: proxyObj, // string | Object
    before: app => {
    }
  },

};