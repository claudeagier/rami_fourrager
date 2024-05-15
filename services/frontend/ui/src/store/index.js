import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import localForage from 'localforage'
import simulator from './modules/simulator'
import auth from './modules/auth'
import settings from './modules/settings'
import drawer from './modules/drawer'
import toaster from './modules/toaster'
import referential from './modules/referential'
import workspace from './modules/workspace'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

// Configuration de localForage pour utiliser IndexedDB
localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'rami',
  storeName: 'rami',
})

// Définir une fonction de filtrage pour VuexPersist
const saveSubsetOfState = (state) => ({
  auth: { lastConnectionDate: state.auth.lastConnectionDate },
  referential: {
    sites: state.referential.sites,
    climatic_years: state.referential.climatic_years,
    feed_types: state.referential.feed_types,
    concentrated_feeds: state.referential.concentrated_feeds,
    stics: state.referential.stics,
    batch_types: state.referential.batch_types,
    animal_profiles: state.referential.animal_profiles,
    housing_types: state.referential.housing_types,
  },
  workspace: state.workspace,
})

const localStorage = new VuexPersist({
  key: 'workspace',
  storage: localForage,
  asyncStorage: true,
  reducer: saveSubsetOfState,
  // modules: ['auth'],
})
// const sessionStorage = null
const vuexStore = new Vuex.Store({
  state: {},
  modules: {
    auth,
    settings,
    simulator,
    drawer,
    toaster,
    referential,
    workspace,
  },
  mutations: { RESTORE_MUTATION: localStorage.RESTORE_MUTATION },
  strict: debug,
  plugins: [localStorage.plugin],
  // plugins: debug ? [] : [],
})

export default vuexStore
