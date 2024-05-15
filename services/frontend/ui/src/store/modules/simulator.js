import barn from './barn'
import farm from './farm'
import herd from './herd'

export default {
  namespaced: true,
  state: {
    name: '',
    description: '',
    loaded: false,
    createdAt: '',
    site: null,
    climaticYear: null,
    // allFarmingMethods: {
    //   classicFeeds: {
    //     FH: { name: 'foin', feedType: '', unity: 'tMS/ha' },
    //     P: { name: 'Pature', feedType: '', unity: 'kgMS/ha/j' },
    //     EH: { name: "Ensilage et enrubannage d'herbe", feedType: '', unity: 'tMS/ha' },
    //     EM: { name: 'Ensilage de maïs et sorgho (riche UF)', feedType: '', unity: 'tMS/ha' },
    //     EL: { name: 'Ensilage de légumineuses (riche PDI)', feedType: '', unity: 'tMS/ha' },
    //     FL: { name: 'Foin de légumineuses (riche PDI)', feedType: '', unity: 'tMS/ha' },
    //   },
    //   concentratedFeeds: {
    //     RC: { name: 'Céréales en grain', feedType: '', unity: 'qtx/ha' },
    //     RP: { name: 'Protéagineux en grain', feedType: '', unity: 'qtx/ha' },
    //   },
    // },
    // isLoading: {
    //   animalProfileList: false,
    //   batchTypeList: false,
    //   concentratedFeedList: false,
    //   climaticYearList: false,
    //   feedTypeList: false,
    //   housingTypeList: false,
    //   periodList: false,
    //   siteList: false,
    //   sticList: false,
    // },

    // bilan: {},
  },
  mutations: {
    setSimulation(state, { name, site, climaticYear }) {
      state.simulationName = name
      state.site = site
      state.climaticYear = climaticYear
    },
    // setIsLoading(state, { list, loaded }) {
    //   state.isLoading[list] = loaded
    // },

    setSite(state, site) {
      state.site = site
    },

    setClimaticYear(state, cy) {
      state.climaticYear = cy
    },
  },
  actions: {},
  getters: {
    // loaders
    // isLoading: (state) => (list) => {
    //   return state.isLoading[list]
    // },
    simulationName: (state) => state.name,
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
