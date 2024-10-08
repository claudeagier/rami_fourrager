import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from 'vuetify/lib/locale/en'
import fr from 'vuetify/lib/locale/fr'

Vue.use(VueI18n)

const messages = {
  fr: {
    ...require('@/locales/fr.json'),
    $vuetify: fr,
  },
  en: {
    ...require('@/locales/en.json'),
    $vuetify: en,
  },
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages,
})
