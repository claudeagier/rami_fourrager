import axios from '@plugins/axios'
import localForage from 'localforage'
import { getCurrentDateTime, deepCopy } from '@/plugins/utils'

// TODO-FRONT test all and continu
async function fetch(what, since, commit, dispatch) {
  if (since === null || since < getCurrentDateTime()) {
    try {
      const response = await axios.get(`/lists/${what}?lastConnectionDate=${since}`) // ajuster l'URL de l'API
      if (response.data.length > 0) {
        commit('addToList', { whats: response.data, to: what + 's' })
      } else {
        // TODO-FRONT faire quelquechose pour dire que c'est à jour return true
      }
    } catch (error) {
      console.error(`Error fetching ${what} :`, error)
      throw error
    }
  }
}
async function getLastConnectionDate() {
  const workspace = await localForage.getItem('workspace')
  const lcd = workspace.auth.lastConnectionDate
  return lcd
}

function mergeLists(dbList, customList) {
  const lastItem = dbList[dbList.length - 1]
  if (Object.prototype.hasOwnProperty.call(lastItem, 'id')) {
    dbList.push(
      ...customList.map((cl, index) => {
        return { id: lastItem.id + index + 1, ...deepCopy(cl) }
      })
    )
  }
  return dbList
}
export default {
  namespaced: true,
  state: {
    animal_profiles: [],
    barnStockItems: [
      // { code: 'P', name: 'Pature', unity: 'kgMS/ha/j' },
      { code: 'FH', name: 'foin', unity: 'tMS', color: '' },
      { code: 'EH', name: "Ensilage et enrubannage d'herbe", unity: 'tMS', color: '' },
      { code: 'EM', name: 'Ensilage de maïs et sorgho (riche UF)', unity: 'tMS', color: '' },
      { code: 'RC', name: 'Céréales en grain', unity: 'qtx', concentrated: true, color: '' },
      { code: 'RP', name: 'Protéagineux en grain', unity: 'qtx', concentrated: true, color: '' },
      { code: 'AS', name: 'autre stock', unity: 'tMS', color: '' },
      { code: 'EL', name: 'Ensilage de légumineuses (riche PDI)', unity: 'tMS', color: '' },
      { code: 'FL', name: 'Foin de légumineuses (riche PDI)', unity: 'tMS', color: '' },
      // { code: 'STRAW', name: 'Paille', unity: '', color: 'yellow' }
    ],
    batch_types: [],
    climatic_years: [],
    concentrated_feeds: [],
    farming_methods: [
      { code: 'FH', name: 'foin', feedType: '', unity: 'tMS/ha' },
      { code: 'P', name: 'Pature', feedType: '', unity: 'kgMS/ha/j' },
      { code: 'EH', name: "Ensilage et enrubannage d'herbe", feedType: '', unity: 'tMS/ha' },
      { code: 'EM', name: 'Ensilage de maïs et sorgho (riche UF)', feedType: '', unity: 'tMS/ha' },
      { code: 'EL', name: 'Ensilage de légumineuses (riche PDI)', feedType: '', unity: 'tMS/ha' },
      { code: 'FL', name: 'Foin de légumineuses (riche PDI)', feedType: '', unity: 'tMS/ha' },
      { code: 'RC', name: 'Céréales en grain', feedType: '', unity: 'qtx/ha' },
      { code: 'RP', name: 'Protéagineux en grain', feedType: '', unity: 'qtx/ha' },
    ],
    feed_types: [],
    housing_types: [],
    pasture_types: [],
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
    sites: [],
    stics: [],
  },
  mutations: {
    addToList(state, { whats, to }) {
      const uniqueNew = whats.filter((what) => {
        return !state[to].some((existing) => existing.id === what.id)
      })
      state[to].push(...uniqueNew)
    },
    addCustomList(state, { whats, to }) {
      const customList = whats.map((w) => {
        return {}
      })
      state[to].push(...customList)
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
    async fetchPastureTypes({ commit, dispatch }, refresh) {
      const since = !refresh ? await getLastConnectionDate() : null
      fetch('pasture_type', since, commit, dispatch)
    },
  },
  getters: {
    // select lists
    animalProfileList: (state, getters, rootState) => (batchTypeId) => {
      var list = state.animal_profiles
      if (rootState.workspace.workspace.animalProfiles.length > 0) {
        list = mergeLists([...state.animal_profiles], [...rootState.workspace.workspace.animalProfiles])
      }
      return list.filter((ap) => {
        return ap.batch_type_id === batchTypeId
      })
    },
    barnStockItemList: (state) => state.barnStockItems,
    batchTypeList: (state) => state.batch_types,
    climaticYearList: (state) => (siteId) => {
      return state.climatic_years.filter((cy) => {
        return cy.site_id === siteId
      })
    },
    concentratedFeedList: (state) => state.concentrated_feeds,
    farmingMethodList: (state) => state.farming_methods,
    feedTypeList: (state, getters, rootState) => {
      var list = state.feed_types
      if (rootState.workspace.workspace.classicFeeds.length > 0) {
        list = mergeLists([...state.feed_types], [...rootState.workspace.workspace.classicFeeds])
      }
      return list
    },
    housingTypeList: (state) => state.housing_types,
    pastureTypeList: (state) => state.pasture_types,
    periodList: (state) => state.periods,
    siteList: (state) => state.sites,
    getSiteByClimaticYearId: (state) => (climaticYearId) => {
      const cy = state.climatic_years.find((el) => el.id === climaticYearId)
      if (cy) {
        return state.sites.find((el) => el.id === cy.site_id)
      }
    },
    getClimaticYearById: (state) => (id) => {
      return state.climatic_years.find((el) => el.id === id)
    },
    sticList: (state, getters, rootState) => (climaticYearId) => {
      var list = state.stics
      if (rootState.workspace.workspace.stics.length > 0) {
        list = mergeLists([...state.stics], [...rootState.workspace.workspace.stics])
      }
      const filtered = list.filter((stic) => {
        return stic.climatic_year_id === climaticYearId
      })
      return filtered
    },
  },
}
