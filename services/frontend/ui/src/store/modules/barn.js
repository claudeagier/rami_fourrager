export default {
  namespaced: true,
  state: {
    stockByPeriod: [],
    refusalRate: 0,
    initialStocks: [],
  },
  mutations: {
    setBarn(state, { initialStocks, stockByPeriod, refusalRate }) {
      state.initialStocks = initialStocks
      state.stockByPeriod = stockByPeriod
      state.refusalRate = refusalRate
    },
    // barn
    setInitialBarnStock(state, initialData) {
      state.initialStocks = initialData
    },
    deleteBarnStockItem(state, stock) {
      state.initialStocks = state.initialStocks.filter(
        (item) => !(item.code === stock.code && item.name === stock.name)
      )
    },
    setInitialStocks(state, initialStock) {
      const index = state.initialStocks.findIndex((el) => el.code === initialStock.code)
      if (index > -1) {
        state.initialStocks[index].quantity = initialStock.quantity
      } else {
        state.initialStocks.push(initialStock)
      }
    },
    setRefusalRate(state, refusalRate) {
      state.refusalRate = refusalRate
    },
    setTotalStrawStockProducted(state, stock) {
      state.totalStrawStockProducted = stock
    },
    setStockByPeriod(state, stockByPeriod) {
      state.stockByPeriod = stockByPeriod
    },
  },
  getters: {
    initialStocks: (state) => {
      return state.initialStocks.filter((el) => el.code !== 'STRAW' && el.code !== 'RP' && el.code !== 'RC')
    },
    getInitialStockQuantityByCode: (state) => (code) => {
      let quantity = 0
      if (state.initialStocks.length > 0) {
        const index = state.initialStocks.findIndex((el) => el.code === code)
        if (index > -1) {
          quantity = state.initialStocks[index].quantity
        }
      }
      return quantity
    },
    getTotalStrawStockProducted(state) {
      return state.totalStrawStockProducted
    },
    getRefusalRate: (state) => state.refusalRate,
  },
  actions: {
    setSimulation({ state, commit }) {
      commit('workspace/updateSimulation', { key: 'barn', value: state }, { root: true })
    },
  },
}
