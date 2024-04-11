import axios from '@plugins/axios'
import barn from './barn'
import farm from './farm'
import herd from './herd'

export default {
  namespaced: true,
  state: {
    simulationName: 'nom de la simulation',
    site: null,
    climaticYear: null,
    // TODO-BACK à aller chercher dans la base
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
    allFarmingMethods: {
      classicFeeds: {
        FH: { name: 'foin', feedType: '', unity: 'tMS/ha' },
        P: { name: 'Pature', feedType: '', unity: 'kgMS/ha/j' },
        EH: { name: "Ensilage et enrubannage d'herbe", feedType: '', unity: 'tMS/ha' },
        EM: { name: 'Ensilage de maïs et sorgho (riche UF)', feedType: '', unity: 'tMS/ha' },
        EL: { name: 'Ensilage de légumineuses (riche PDI)', feedType: '', unity: 'tMS/ha' },
        FL: { name: 'Foin de légumineuses (riche PDI)', feedType: '', unity: 'tMS/ha' },
      },
      concentratedFeeds: {
        RC: { name: 'Céréales en grain', feedType: '', unity: 'qtx/ha' },
        RP: { name: 'Protéagineux en grain', feedType: '', unity: 'qtx/ha' },
      },
    },
    // TODO-BACK à mettre dans la base après confirmation
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
    sites: [],
    climaticYears: [],
    feedTypes: [],
    concentratedFeeds: [],
    stics: [],
    batchTypes: [],
    animalProfils: [],
    housingTypes: [],
    isLoading: {
      animalProfilList: false,
      batchTypeList: false,
      concentratedFeedList: false,
      climaticYearList: false,
      feedTypeList: false,
      housingTypeList: false,
      periodList: false,
      siteList: false,
      sticList: false,
    },

    bilan: {},
  },
  mutations: {
    setIsLoading(state, { list, loaded }) {
      state.isLoading[list] = loaded
    },
    setPeriods(state, periods) {
      state.periods = periods
    },
    setSites(state, sites) {
      state.sites = sites
    },
    setFeedTypes(state, feedTypes) {
      state.feedTypes = feedTypes
    },
    setConcentratedFeeds(state, concentratedFeeds) {
      state.concentratedFeeds = concentratedFeeds
    },
    setClimaticYears(state, climaticYears) {
      state.climaticYears = climaticYears
    },
    setStics(state, stics) {
      state.stics = stics
    },
    setBatchTypes(state, batchTypes) {
      state.batchTypes = batchTypes
    },
    setAnimalProfils(state, animalProfils) {
      state.animalProfils = animalProfils
    },
    setHousingTypes(state, housingTypes) {
      state.housingTypes = housingTypes
    },

    setSite(state, site) {
      state.site = site
    },

    setClimaticYear(state, cy) {
      state.climaticYear = cy
    },
  },
  actions: {
    async fetchPeriods({ commit }) {
      try {
        const response = await axios.get('/lists/period') // ajuster l'URL de l'API
        commit('setPeriods', response.data)
      } catch (error) {
        console.error('Error fetching periods:', error)
      }
    },

    async fetchSites({ commit }) {
      try {
        const response = await axios.get('/lists/site') // ajuster l'URL de l'API
        commit('setSites', response.data)
      } catch (error) {
        console.error('Error fetching sites:', error)
      }
    },

    async fetchClimaticYears({ commit }, siteId) {
      try {
        const response = await axios.get(`/climatic-years?siteId=${siteId}`) // ajuster l'URL de l'API
        commit('setClimaticYears', response.data)
      } catch (error) {
        console.error('Error fetching climatic years:', error)
      }
    },

    async fetchStics({ commit }, climaticYearId) {
      // const climaticYearId = 1
      commit('setIsLoading', { list: 'sticList', loaded: true })
      try {
        const response = await axios.get(`/stics?climaticYearId=${climaticYearId}`) // ajuster l'URL de l'API
        commit('setIsLoading', { list: 'sticList', loaded: false })
        commit('setStics', response.data)
      } catch (error) {
        console.error('Error fetching climatic years:', error)
      }
    },

    async fetchBatchTypes({ commit }) {
      try {
        const response = await axios.get('/lists/batch-type')
        commit('setBatchTypes', response.data)
      } catch (error) {
        console.error('Error fetching batch types:', error)
      }
    },

    async fetchAnimalProfils({ commit }, batchTypeId) {
      try {
        const response = await axios.get(`/animal-profiles?batchTypeId=${batchTypeId}`) // ajuster l'URL de l'API
        commit('setAnimalProfils', response.data)
      } catch (error) {
        commit('setAnimalProfils', [])
      }
    },

    async fetchFeedTypes({ commit }) {
      try {
        const response = await axios.get('/lists/feed-type')
        commit('setFeedTypes', response.data)
      } catch (error) {
        console.error('Error fetching feed types:', error)
      }
    },

    async fetchConcentratedFeeds({ commit }) {
      try {
        const response = await axios.get('/lists/concentrated-feed')
        commit('setConcentratedFeeds', response.data)
      } catch (error) {
        console.error('Error fetching concentrated feeds:', error)
      }
    },

    async fetchHousingTypes({ commit }) {
      try {
        const response = await axios.get('/lists/housing-type')
        commit('setHousingTypes', response.data)
      } catch (error) {
        console.error('Error fetching housing types:', error)
      }
    },
  },
  getters: {
    // loaders
    isLoading: (state) => (list) => {
      return state.isLoading[list]
    },
    // select lists
    animalProfilList: (state) => state.animalProfils,
    batchTypeList: (state) => state.batchTypes,
    concentratedFeedList: (state) => state.concentratedFeeds,
    climaticYearList: (state) => state.climaticYears,
    feedTypeList: (state) => state.feedTypes,
    housingTypeList: (state) => state.housingTypes,
    periodList: (state) => state.periods,
    siteList: (state) => state.sites,
    sticList: (state) => state.stics,
    barnStockItemList: (state) => state.barnStockItems,

    // simulation values
    simulationName: (state) => state.simulationName,
    balanceSheet: (state) => state.bilan,
    climaticYearInfo: (state) => state.climaticYear,
    siteInfo: (state) => state.site,
    totalPeriods: (state) => state.periods.length,
    getAllByPeriod: (state) => () => {
      var all = [{ period: {}, herd: [] }]
    },
  },
  modules: {
    barn,
    farm,
    herd,
  },
}
