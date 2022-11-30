const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {
    name: 'Dz Theater', // 名字
    themeColor: "#373737", // 背景颜色
    appleMobileWebAppCapable: true, // 苹果WebApp支持
    // // manifest 设置
    manifestOptions: {
      name: '点众剧场',
      short_name: "DzTheater",
      theme_color: "#373737",
      start_url: ".",
      display: "standalone",
      background_color: "#000000",
      appleMobileWebAppStatusBarStyle: 'black',
      // "theme_color": "white",
      // "display": "standalone",
      // "start_url": "./index.html",
      // "background_color": "#3367D6",
      // "id": "index.html",
      icons: [
        {
          'src': "img/logo.png",
          'sizes': '192x192',
          'type': 'image/png'
        },
        {
          'src': "img/logo.png",
          'sizes': '512x512',
          'type': 'image/png'
        },
        {
          'src': "img/logo.png",
          'sizes': '192x192',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': "img/logo.png",
          'sizes': '512x512',
          'type': 'image/png',
          'purpose': 'maskable'
        }
      ],
      // "shortcuts": [
      //   {
      //     "name": "How's weather today?",
      //     "short_name": "Today",
      //     "description": "View weather information for today",
      //     // "url": "index.html",
      //     "icons": [{ "src": "img/icons/logo.png", "sizes": "192x192" }]
      //   }
      // ],
      // "description": "Weather forecast information"
    },
    //
    // 图标
    iconPaths: {
      faviconSVG: "img/logo.png", // 'img/icons/manifest-icon-192.maskable.png',
      favicon32: "img/logo.png", // 'img/icons/manifest-icon-512.maskable.png',
      favicon16: "img/logo.png", // 'img/icons/manifest-icon-192.maskable.png',
      appleTouchIcon: "img/logo.png", // 'img/icons/apple-icon.png',
      maskIcon: '',
      msTileImage: ''
    },

    workboxOptions: {
      // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
      skipWaiting: true,
      clientsClaim: true,
      // importWorkboxFrom: 'local',
      // importsDirectory: 'js',
      // navigateFallback: '/',
      // navigateFallbackBlacklist: [/\/api\//]
    }
  },
  publicPath: '.',
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      })
    ]
  },
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  css: { // css相关配置
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps?
    loaderOptions: {}, // css预设器配置项
    // requireModuleExtension: true // 启用 CSS modules for all css / pre-processor files.
  },
  lintOnSave: false,
  chainWebpack: (config) => {
    // 解决警告You are running the esm-bundler build of vue-i18n. It is recommended to configure your bundler to explicitly replace feature flag globals with boolean literals to get proper tree-shaking in the final bundle.
    config.resolve.alias
      .set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
      .set('components', '@/components')
    config.performance.maxAssetSize(30000000) // 打包文件大小配置
    config.performance.maxEntrypointSize(10000000)
  },
  devServer: {
    // server: 'https',
    port: 8000,
    proxy: {
      '/asg/portal': {
        // target: 'http://192.168.8.142:8080', // 后端
        target: 'http://192.168.0.241:4080',
        changeOrigin: true, // 是否跨域
      },
      '/api': {
        target: 'https://zf.jxjzwh.cn',
        changeOrigin: true, // 是否跨域
      }
    },
  }
})
