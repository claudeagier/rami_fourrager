module.exports = {
  devServer: {
    disableHostCheck: true,
    watchOptions: {
      poll: true,
    },
  },
  transpileDependencies: ['vuetify'],
  chainWebpack: (config) => {
    config.resolve.extensions
      .clear()
      .add('.ts')
      .add('.tsx')
      .add('.js')
      .add('.vue')
      .add('.json')
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
