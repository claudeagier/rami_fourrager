import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n'
import ConfirmationDialog from '@/components/core/ConfirmationDialog'

const DialogConstructor = Vue.extend(ConfirmationDialog)

const ConfirmPlugin = {
  install(vue) {
    const instance = new DialogConstructor({
      vuetify,
      i18n,
    })
    instance.$mount()

    Vue.prototype.$confirmNavigation = (callback) => {
      document.body.appendChild(instance.$el)
      instance.open(callback)
    }
  },
}

Vue.use(ConfirmPlugin)
