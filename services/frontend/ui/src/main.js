import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@mdi/font/css/materialdesignicons.css'

import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'
import '@/plugins/iconFont'
import '@/plugins/base'
import '@/plugins/chartist'
import '@/plugins/echart'
import '@/plugins/toaster'
import '@/plugins/vee-validate'
import '@/plugins/vueFinalModal'
import '@/plugins/confirmationDialog'
import '@/plugins/axios'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
