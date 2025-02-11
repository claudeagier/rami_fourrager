import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import Toaster from '@/components/core/Toaster.vue'

const ToastConstructor = Vue.extend(Toaster)

const ToastPlugin = {
  install(Vue) {
    const instance = new ToastConstructor({
      vuetify,
    })

    instance.$mount()

    Vue.prototype.$toast = function (toast) {
      const app = document.querySelector('#app')
      if (app && !app.querySelector('.toast-container')) {
        app.appendChild(instance.$el)
      }
      instance.addToast(toast)
    }
  },
}

Vue.use(ToastPlugin)
