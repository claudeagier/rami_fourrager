import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
// import './plugins/modal'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import './plugins/echart'
import i18n from './plugins/i18n'
import ConfirmationDialog from '@/components/core/ConfirmationDialog'

Vue.config.productionTip = false

// Vue.component('confirmation-dialog', ConfirmationDialog)

Vue.prototype.$confirmNavigation = (callback) => {
  const DialogConstructor = Vue.extend(ConfirmationDialog)
  const instance = new DialogConstructor({
    vuetify,
    i18n, // Passez l'instance de Vuetify ici
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.open(callback)
}

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
