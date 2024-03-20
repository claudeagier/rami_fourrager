const path = require('path')

module.exports = {
  devServer: {
    disableHostCheck: true,
    watchOptions: {
      poll: true,
    },
  },
  transpileDependencies: ['vuetify', 'vue-echarts', 'resize-detector'],
  chainWebpack: (config) => {
    config.resolve.extensions.clear().add('.ts').add('.tsx').add('.js').add('.vue').add('.json')
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@plugins': path.resolve(__dirname, 'src/plugins/'),
        '@store': path.resolve(__dirname, 'src/store/'),
        '@components': path.resolve(__dirname, 'src/components/'),
        '@': path.resolve(__dirname, 'src/'),
      },
    },
  },
}
