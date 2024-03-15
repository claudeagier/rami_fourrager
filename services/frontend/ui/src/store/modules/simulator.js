import axios from '@plugins/axios'

export default {
  state: {
    simulationName: 'nom de la simulation',
    // l'objet site
    site: null,
    // l'objet climaticYear
    climaticYear: null,
    // la liste des périodes
    periods: [],
    sites: [],
    climaticYears: [],
    feedTypes: [],
    concentratedFeeds: [],
    stics: [],
    batchTypes: [],
    animalProfils: [],
    housingTypes: [],
    farm: {
      rotation: [
        // exemple de contenu de la rotation
        // {
        //   soil: 'code baguettes',
        //   name: 'nom de la baguette',
        //   constraint:'constraintSurfaces_key or null',
        //   surface: 15,
        //   production: [{ periods }],
        // },
        // {
        //   soil: 'code baguettes',
        //   name: 'nom de la baguette',
        //   constraint:'constraintSurfaces_key or null',
        //   surface: 15,
        //   production: [{ periods }],
        // },
      ],
      dimensioning: {
        SAU: null,
        constrainedSurfaces: {
          irrigable: null,
          ploughable: null,
          superficial: null,
          reachable: null,
        },
      },
    },
    herd: {
      batchs: [],
    },
    barn: {
      stock: [
        // exemple de contenue du stock
        // {
        //   type: 'concentrated_feed',
        //   name: 'Sorgot',
        //   quantity: 0,
        //   capacity: 200,
        // },
        // {
        //   type: 'concentrated_feed',
        //   name: 'Sorgot',
        //   quantity: 0,
        //   capacity: 200,
        // },
      ],
      stock_by_period: [
        // exemple de contenu du stock par period
        // {
        //   period: 1,
        //   stock: [
        //     { type: 'concentratedFeed', name: '', quantity: 5 },
        //     { type: 'Feed', name: '', quantity: 22 },
        //   ],
        // },
        // {
        //   period: 1,
        //   stock: [
        //     { type: 'concentratedFeed', name: '', quantity: 5 },
        //     { type: 'Feed', name: '', quantity: 2 },
        //   ],
        // },
      ],
    },
    bilan: {},
  },
  mutations: {
    // setters
    setFeedTypes(state, feedTypes) {
      state.feedTypes = feedTypes
    },
    setConcentratedFeeds(state, concentratedFeeds) {
      state.concentratedFeeds = concentratedFeeds
    },
    setInitialBarnStock(state, initialData) {
      state.barn.stock = initialData
    },
    setPeriods(state, periods) {
      state.periods = periods
    },
    setSite(state, site) {
      state.site = site
    },
    setSites(state, sites) {
      state.sites = sites
    },
    setClimaticYear(state, cy) {
      state.climaticYear = cy
    },
    setClimaticYears(state, climaticYears) {
      state.climaticYears = climaticYears
    },
    setStics(state, stics) {
      state.stics = stics
    },
    setBatchs(state, batchs) {
      state.herd.batchs = batchs
    },
    setBatchTypes(state, batchTypes) {
      state.batchTypes = batchTypes
    },
    setAnimalProfils(state, animalProfils) {
      state.animalProfils = animalProfils
    },

    setDimensioning(state, dim) {
      state.farm.dimensioning = dim
    },
    setRotations(state, rotation) {
      state.farm.rotation = rotation
    },

    setHousingTypes(state, housingTypes) {
      console.log('set state', housingTypes)
      state.housingTypes = housingTypes
    },

    // mutations
    updateBarnStock(state, { type, name, quantity }) {
      const foundStock = state.barn.stock.find((item) => item.type === type && item.name === name)
      if (!foundStock) {
        state.barn.stock.push({ type, name, quantity })
      } else {
        foundStock.quantity += quantity
      }
    },
    // ajouter les mutations pour permettre la mise à jour des valeurs
    // Pour la gestion de stock et de stock_by_period de barn
    updateBarnStockByPeriod(state, { period, type, name, quantity }) {
      const periodIndex = state.periods.findIndex((p) => p.period === period)
      if (periodIndex === -1) {
        state.periods.push({ period, stock: [{ type, name, quantity }] })
      } else {
        const foundStock = state.periods[periodIndex].stock.find((item) => item.type === type && item.name === name)
        if (!foundStock) {
          state.periods[periodIndex].stock.push({ type, name, quantity })
        } else {
          foundStock.quantity += quantity
        }
      }
      // Mettre à jour le stock global également
      const foundGlobalStock = state.barn.stock.find((item) => item.type === type && item.name === name)
      if (!foundGlobalStock) {
        state.barn.stock.push({ type, name, quantity })
      } else {
        foundGlobalStock.quantity += quantity
      }
    },
    deleteBarnStockItem(state, { type, name }) {
      state.barn.stock = state.barn.stock.filter((item) => !(item.type === type && item.name === name))
    },
  },
  actions: {
    // les périodes sont à récupérer sur le server avec axios
    async fetchPeriods({ commit }) {
      try {
        const response = await axios.get('/lists/period') // ajuster l'URL de l'API
        commit('setPeriods', response.data)
      } catch (error) {
        console.error('Error fetching periods:', error)
      }
    },
    // les périodes sont à récupérer sur le server avec axios
    async fetchSites({ commit }) {
      try {
        const response = await axios.get('/lists/site') // ajuster l'URL de l'API
        commit('setSites', response.data)
      } catch (error) {
        console.error('Error fetching sites:', error)
      }
    },

    // les périodes sont à récupérer sur le server avec axios
    async fetchClimaticYears({ commit }, siteId) {
      try {
        const response = await axios.get(`/climatic-years?siteId=${siteId}`) // ajuster l'URL de l'API
        commit('setClimaticYears', response.data)
      } catch (error) {
        console.error('Error fetching climatic years:', error)
      }
    },
    // les périodes sont à récupérer sur le server avec axios
    async fetchStics({ commit }, climaticYearId) {
      // const climaticYearId = 1
      try {
        const response = await axios.get(`/stics?climaticYearId=${climaticYearId}`) // ajuster l'URL de l'API
        commit('setStics', response.data)
      } catch (error) {
        console.error('Error fetching climatic years:', error)
      }
    },
    // Action pour récupérer les types d'aliment depuis la base de données
    async fetchBatchTypes({ commit }) {
      try {
        const response = await axios.get('/lists/batch-type')
        commit('setBatchTypes', response.data)
      } catch (error) {
        console.error('Error fetching batch types:', error)
      }
    },
    // les périodes sont à récupérer sur le server avec axios
    async fetchAnimalProfils({ commit }, batchTypeId) {
      try {
        const response = await axios.get(`/animal-profiles?batchTypeId=${batchTypeId}`) // ajuster l'URL de l'API
        commit('setAnimalProfils', response.data)
      } catch (error) {
        commit('setAnimalProfils', [])
        // console.error('Error fetching animal profils:', error)
      }
    },
    // Action pour récupérer les types d'aliment depuis la base de données
    async fetchFeedTypes({ commit }) {
      try {
        const response = await axios.get('/lists/feed-type')
        commit('setFeedTypes', response.data)
      } catch (error) {
        console.error('Error fetching feed types:', error)
      }
    },
    // Action pour récupérer les concentrés depuis la base de données
    async fetchConcentratedFeeds({ commit }) {
      try {
        const response = await axios.get('/lists/concentrated-feed')
        commit('setConcentratedFeeds', response.data)
      } catch (error) {
        console.error('Error fetching concentrated feeds:', error)
      }
    },
    // Action pour récupérer les concentrés depuis la base de données
    async fetchHousingTypes({ commit }) {
      try {
        const response = await axios.get('/lists/housing-type')
        console.log('receive', response.data)
        commit('setHousingTypes', response.data)
      } catch (error) {
        console.error('Error fetching housing types:', error)
      }
    },
  },
  getters: {
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

    // simulation values
    simulationName: (state) => state.simulationName,
    balanceSheet: (state) => state.bilan,
    barnStock: (state) => state.barn.stock,
    barnStockByPeriod: (state) => state.barn.stock_by_period,
    barnStockTypes: (state) => {
      return state.barn.stock.map((item) => item.type)
    },
    climaticYearInfo: (state) => state.climaticYear,
    farmInfo: (state) => state.farm,
    farmDimensioning: (state) => state.farm.dimensioning,
    farmRotation: (state) => state.farm.rotation,
    herdInfo: (state) => state.herd,
    siteInfo: (state) => state.site,
    totalPeriods: (state) => state.periods.length,
    totalBarnStockByType: (state) => (type) => {
      return state.barn.stock.reduce((total, item) => {
        if (item.type === type) {
          return total + item.quantity
        }
        return total
      }, 0)
    },
    totalBarnStockByTypeAndPeriod: (state) => (type, period) => {
      const periodStock = state.barn.stock_by_period.find((item) => item.period === period)
      if (periodStock) {
        return periodStock.stock.reduce((total, item) => {
          if (item.type === type) {
            return total + item.quantity
          }
          return total
        }, 0)
      }
      return 0
    },
  },
  modules: {},
}
