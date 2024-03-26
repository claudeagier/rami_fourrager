import Vue from 'vue'
import Vuex from 'vuex'
import simulator from './modules/simulator'
import auth from './modules/auth'
import settings from './modules/settings'
import drawer from './modules/drawer'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    settings,
    simulator,
    drawer,
  },
  strict: debug,
  // plugins: debug ? [] : [],
})
