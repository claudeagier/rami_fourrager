import axios from '@plugins/axios'
import localForage from 'localforage'

function getCurrentDateTime() {
  var now = new Date()
  var year = now.getFullYear()
  var month = ('0' + (now.getMonth() + 1)).slice(-2) // Les mois sont 0-indexés, donc on ajoute 1
  var day = ('0' + now.getDate()).slice(-2)
  var hours = ('0' + now.getHours()).slice(-2)
  var minutes = ('0' + now.getMinutes()).slice(-2)
  var seconds = ('0' + now.getSeconds()).slice(-2)
  var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  return formattedDateTime
}

// TODO-FRONT test all and continu
async function fetch(what, since, commit, dispatch) {
  if (since === null || since < getCurrentDateTime()) {
    try {
      const response = await axios.get(`/lists/${what}?lastConnectionDate=${since}`) // ajuster l'URL de l'API
      if (response.data.length > 0) {
        // commit('addSites', response.data)
        commit('addToList', { whats: response.data, to: what + 's' })
        dispatch(
          'toaster/addNotification',
          {
            message: `notifications.fetch.${what}.success`,
            color: 'success', // ou 'error', 'warning', 'info', etc.
            show: true,
          },
          { root: true }
        )
      } else {
        // TODO-FRONT faire quelquechose pour dire que c'est à jour return true
      }
    } catch (error) {
      console.error(`Error fetching ${what} :`, error)
      dispatch(
        'toaster/addNotification',
        {
          message: `notifications.fetch.${what}.error`,
          color: 'error', // ou 'error', 'warning', 'info', etc.
          show: true,
        },
        { root: true }
      )
    }
  }
}
async function getLastConnectionDate() {
  const workspace = await localForage.getItem('workspace')
  const lcd = workspace.auth.lastConnectionDate
  return lcd
}
export default {
  namespaced: true,
  state: {
    sites: [],
    climatic_years: [],
    feed_types: [],
    concentrated_feeds: [],
    stics: [],
    batch_types: [],
    animal_profiles: [],
    housing_types: [],
    periods: [
      { id: 1, name: 'P1' },
      { id: 2, name: 'P2' },
      { id: 3, name: 'P3' },
      { id: 4, name: 'P4' },
      { id: 5, name: 'P5' },
      { id: 6, name: 'P6' },
      { id: 7, name: 'P7' },
      { id: 8, name: 'P8' },
      { id: 9, name: 'P9' },
      { id: 10, name: 'P10' },
      { id: 11, name: 'P11' },
      { id: 12, name: 'P12' },
      { id: 13, name: 'P13' },
    ],
    barnStockItems: [
      { code: 'FH', name: 'foin', unity: 'tMS' },
      // { code: 'P', name: 'Pature', unity: 'kgMS/ha/j' },
      { code: 'EH', name: "Ensilage et enrubannage d'herbe", unity: 'tMS' },
      { code: 'EM', name: 'Ensilage de maïs et sorgho (riche UF)', unity: 'tMS' },
      { code: 'RC', name: 'Céréales en grain', unity: 'qtx', concentrated: true },
      { code: 'RP', name: 'Protéagineux en grain', unity: 'qtx', concentrated: true },
      { code: 'AS', name: 'autre stock', unity: 'tMS' },
      { code: 'EL', name: 'Ensilage de légumineuses (riche PDI)', unity: 'tMS' },
      { code: 'FL', name: 'Foin de légumineuses (riche PDI)', unity: 'tMS' },
    ],
  },
  mutations: {
    addToList(state, { whats, to }) {
      const uniqueNew = whats.filter((what) => {
        return !state[to].some((existing) => existing.id === what.id)
      })
      state[to].push(...uniqueNew)
    },
  },
  actions: {
    async fetchPeriods({ commit, dispatch }, refresh) {
      const since = !refresh ? await getLastConnectionDate() : null
      fetch('period', since, commit, dispatch)
    },

    async fetchSites({ commit, dispatch }, refresh) {
      const since = !refresh ? await getLastConnectionDate() : null
      fetch('site', since, commit, dispatch)
    },

    async fetchClimaticYears({ commit, dispatch }, refresh) {
      const since = !refresh ? await getLastConnectionDate() : null
      fetch('climatic_year', since, commit, dispatch)
    },

    async fetchStics({ commit, dispatch }, refresh) {
      const since = !refresh ? await getLastConnectionDate() : null
      fetch('stic', since, commit, dispatch)
    },

    async fetchBatchTypes({ commit, dispatch }, refresh) {
      const since = !refresh ? await getLastConnectionDate() : null
      fetch('batch_type', since, commit, dispatch)
    },

    async fetchAnimalProfiles({ commit, dispatch }, refresh) {
      const since = !refresh ? await getLastConnectionDate() : null
      fetch('animal_profile', since, commit, dispatch)
    },

    async fetchFeedTypes({ commit, dispatch }, refresh) {
      const since = !refresh ? await getLastConnectionDate() : null
      fetch('feed_type', since, commit, dispatch)
    },

    async fetchConcentratedFeeds({ commit, dispatch }, refresh) {
      const since = !refresh ? await getLastConnectionDate() : null
      fetch('concentrated_feed', since, commit, dispatch)
    },

    async fetchHousingTypes({ commit, dispatch }, refresh) {
      const since = !refresh ? await getLastConnectionDate() : null
      fetch('housing_type', since, commit, dispatch)
    },
  },
  getters: {
    // select lists
    animalProfileList: (state) => (batchTypeId) => {
      return state.animal_profiles.filter((ap) => {
        return ap.batch_type_id === batchTypeId
      })
    },
    batchTypeList: (state) => state.batch_types,
    concentratedFeedList: (state) => state.concentrated_feeds,
    climaticYearList: (state) => (siteId) => {
      return state.climatic_years.filter((cy) => {
        return cy.site_id === siteId
      })
    },
    feedTypeList: (state) => state.feed_types,
    housingTypeList: (state) => state.housing_types,
    periodList: (state) => state.periods,
    siteList: (state) => state.sites,
    sticList: (state) => (climaticYearId) => {
      return state.stics.filter((stic) => {
        return stic.climatic_year_id === climaticYearId
      })
    },
    barnStockItemList: (state) => state.barnStockItems,
  },
}
