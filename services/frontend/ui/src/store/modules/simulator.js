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
  },
  mutations: {
    setSimulation(state, { name, site, climaticYear, loaded, description }) {
      state.name = name
      state.loaded = loaded
      state.description = description
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
  actions: {
    applyTo({ state, commit }, key) {
      commit('workspace/updateSimulation', { key: key, value: state[key] }, { root: true })
    },
  },
  getters: {
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
