import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/plugins/base'
import '@/plugins/chartist'
// import './plugins/modal'
import '@/plugins/echart'
import '@/plugins/toaster'
import '@/plugins/vee-validate'
import '@/plugins/confirmationDialog'
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
