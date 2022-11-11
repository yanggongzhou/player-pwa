const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Dz Theater', // 名字
    themeColor: "#373737", // 背景颜色
    appleMobileWebAppCapable: true, // 苹果WebApp支持
    // manifestPath: 'public/manifest.json',
    // // manifest 设置
    manifestOptions: {
      name: '点众剧场',
      short_name: "DzTheater",
      theme_color: "#373737",
      start_url: ".",
      display: "standalone",
      background_color: "#000000",
      icons: [
        {
          "src": "img/icons/manifest-icon-192.maskable.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "img/icons/manifest-icon-192.maskable.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "img/icons/manifest-icon-512.maskable.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "img/icons/manifest-icon-512.maskable.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ]
    },
    //
    // 图标
    iconPaths: {
      faviconSVG: 'img/icons/manifest-icon-192.maskable.png',
      favicon32: 'img/icons/manifest-icon-512.maskable.png',
      favicon16: 'img/icons/manifest-icon-192.maskable.png',
      appleTouchIcon: 'img/icons/apple-icon.png',
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
  productionSourceMap: false,
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
  }
})
