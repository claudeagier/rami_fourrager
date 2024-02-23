import axios from '@plugins/axios'

export default {
  state: {
    simulationName: 'nom de la simulation',
    // l'objet site
    site: {},
    // l'objet climaticYear
    climaticYear: {},
    // la liste des périodes
    periods: [],
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
        SAU: 0,
        constrainedSurfaces: {
          irrigables: 0,
          ploughables: 0,
          superficial: 0,
          reachable: 0,
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
    // Mutation pour mettre à jour la liste des types d'aliment (feedTypes)
    setFeedTypes(state, feedTypes) {
      state.feedTypes = feedTypes
    },
    // Mutation pour mettre à jour la liste des concentrés (concentratedFeeds)
    setConcentratedFeeds(state, concentratedFeeds) {
      state.concentratedFeeds = concentratedFeeds
    },

    updateBarnStock(state, { type, name, quantity }) {
      const foundStock = state.barn.stock.find(
        (item) => item.type === type && item.name === name
      )
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
        const foundStock = state.periods[periodIndex].stock.find(
          (item) => item.type === type && item.name === name
        )
        if (!foundStock) {
          state.periods[periodIndex].stock.push({ type, name, quantity })
        } else {
          foundStock.quantity += quantity
        }
      }
      // Mettre à jour le stock global également
      const foundGlobalStock = state.barn.stock.find(
        (item) => item.type === type && item.name === name
      )
      if (!foundGlobalStock) {
        state.barn.stock.push({ type, name, quantity })
      } else {
        foundGlobalStock.quantity += quantity
      }
    },
    setPeriods(state, periods) {
      state.periods = periods
    },
  },
  actions: {
    // les périodes sont à récupérer sur le server avec axios
    async fetchPeriods({ commit }) {
      try {
        const response = await axios.get('/lists/period') // ajuster l'URL de l'API
        commit('setPeriods', response.data.periods)
      } catch (error) {
        console.error('Error fetching periods:', error)
      }
    },
    // Action pour récupérer les types d'aliment depuis la base de données
    async fetchFeedTypes({ commit }) {
      try {
        const response = await axios.get('/lists/feedType')
        commit('setFeedTypes', response.data.feedTypes)
      } catch (error) {
        console.error('Error fetching feed types:', error)
      }
    },
    // Action pour récupérer les concentrés depuis la base de données
    async fetchConcentratedFeeds({ commit }) {
      try {
        const response = await axios.get('/lists/concentratedFeed')
        commit('setConcentratedFeeds', response.data.concentratedFeeds)
      } catch (error) {
        console.error('Error fetching concentrated feeds:', error)
      }
    },
  },
  getters: {
    // Getter pour obtenir la liste des types d'aliment
    feedTypes: (state) => state.feedTypes,
    // Getter pour obtenir la liste des concentrés
    concentratedFeeds: (state) => state.concentratedFeeds,
    // Ajoutez d'autres getters au besoin

    // Getter pour obtenir le nom de la simulation
    simulationName: (state) => state.simulationName,

    // Getter pour obtenir les informations du site
    siteInfo: (state) => state.site,

    // Getter pour obtenir les informations sur l'année climatique
    climaticYearInfo: (state) => state.climaticYear,

    // Getter pour obtenir la liste des périodes
    periodsList: (state) => state.periods,

    // Getter pour obtenir la rotation des cultures de la ferme
    farmRotation: (state) => state.farm.rotation,

    // Getter pour obtenir les dimensions de la ferme
    farmDimensioning: (state) => state.farm.dimensioning,

    // Getter pour obtenir les informations sur le troupeau
    herdInfo: (state) => state.herd,

    // Getter pour obtenir le stock global de la grange
    barnStock: (state) => state.barn.stock,

    // Getter pour obtenir le stock par période de la grange
    barnStockByPeriod: (state) => state.barn.stock_by_period,

    // Getter pour obtenir le bilan
    balanceSheet: (state) => state.bilan,

    // Getter pour obtenir le nombre total de périodes
    totalPeriods: (state) => state.periods.length,

    // Getter pour obtenir la liste des types de stock disponibles dans la grange
    barnStockTypes: (state) => {
      return state.barn.stock.map((item) => item.type)
    },

    // Getter pour obtenir le stock total d'un type donné dans la grange
    totalBarnStockByType: (state) => (type) => {
      return state.barn.stock.reduce((total, item) => {
        if (item.type === type) {
          return total + item.quantity
        }
        return total
      }, 0)
    },

    // Getter pour obtenir le stock total d'un type donné dans la grange par période
    totalBarnStockByTypeAndPeriod: (state) => (type, period) => {
      const periodStock = state.barn.stock_by_period.find(
        (item) => item.period === period
      )
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
