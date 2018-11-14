let path = require('path');
const webpack = require('webpack');

const resolve = dir => {
  return path.join(__dirname, dir);
};

// 加载自定义环境配置信息
let customEnv = require('./config/' + process.env.env_config + '.env');
// 生成代理配置对象
let proxyObj = {};

let hostUrl = customEnv.hostUrl.replace(/"/g, "");
let urlPrefix = customEnv.urlPrefix.replace(/"/g, "");
console.debug('自定义环境变量信息', hostUrl, urlPrefix);
// 代理
const devProxy = [urlPrefix];

devProxy.forEach((value, index) => {
  proxyObj[value] = {
    target: hostUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^${value}`]: ''
    }
  };
});

console.debug('代理对象信息', proxyObj);
let vueConfig = {
  // 基本路径
  baseUrl: '/',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
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
    console.log("webpack配置信息：", config.externals);
    config.externals({
      CKEDITOR: 'window.CKEDITOR'
    });
    config.resolve.alias
      .set('@', resolve('src'))
      .set('static', resolve('static'))
      .set('apis', resolve('src/apis'))
      .set('assets', resolve('src/assets'))
      .set('styles', resolve('src/assets/styles'))
      .set('images', resolve('src/assets/images'))
      .set('components', resolve('src/components'))
      .set('layout', resolve('src/layout'))
      .set('utils', resolve('src/utils'))
      .set('views', resolve('src/views'));


    config.plugin('define').tap(definitions => {
      // 注意 Object.assign 只是浅层拷贝
      definitions[0]['process.env'] = Object.assign({}, definitions[0]['process.env'], customEnv);
      console.error("process.env", definitions);
      return definitions
    })
  },
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },// use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    // open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8089,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: proxyObj, // string | Object
    before: app => {
    }
  },
  // 第三方插件配置
  pluginOptions: {}

};

module.exports = vueConfig;
