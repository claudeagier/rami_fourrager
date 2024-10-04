export default {
  namespaced: true,
  state: {
    totalStock: [],
    stockByPeriod: [],
    initialStrawStock: 0,
    refusalRate: 0,
    initialConcentratedStock: { energeticQuantity: 0, proteicQuantity: 0 },
    initialFeedStock: [],
  },
  mutations: {
    setBarn(
      state,
      { totalStock, initialFeedStock, stockByPeriod, initialStrawStock, initialConcentratedStock, refusalRate }
    ) {
      state.totalStock = totalStock
      state.initialFeedStock = initialFeedStock
      state.initialConcentratedStock = initialConcentratedStock
      state.initialStrawStock = initialStrawStock
      state.stockByPeriod = stockByPeriod
      state.refusalRate = refusalRate
    },
    // barn
    setInitialBarnStock(state, initialData) {
      state.initialFeedStock = initialData
    },
    saveInitialFeedStock(state, initialFeedStock) {
      const foundStock = state.initialFeedStock.find(
        (item) => item.code === initialFeedStock.code && item.name === initialFeedStock.name
      )
      if (!foundStock) {
        state.initialFeedStock.push(initialFeedStock)
      } else {
        foundStock.quantity += initialFeedStock.quantity
      }
    },
    deleteBarnStockItem(state, stock) {
      state.initialFeedStock = state.initialFeedStock.filter(
        (item) => !(item.code === stock.code && item.name === stock.name)
      )
    },
    setTotalStock(state, totalStock) {
      state.totalStock = totalStock
    },
    setInitialStrawStock(state, initialStrawStock) {
      state.initialStrawStock = initialStrawStock
    },
    setRefusalRate(state, refusalRate) {
      state.refusalRate = refusalRate
    },
    setTotalStrawStockProducted(state, stock) {
      state.totalStrawStockProducted = stock
    },
    setEnergeticQuantity(state, q) {
      state.initialConcentratedStock.energeticQuantity = q
    },
    setProteicQuantity(state, q) {
      state.initialConcentratedStock.proteicQuantity = q
    },
    setStockByPeriod(state, stockByPeriod) {
      state.stockByPeriod = stockByPeriod
    },
  },
  getters: {
    initialFeedStock: (state) => state.initialFeedStock,
    initialConcentratedStock: (state) => state.initialConcentratedStock,
    totalConcentratedStock: (state) => {
      return state.initialConcentratedStock.energeticQuantity + state.initialConcentratedStock.proteicQuantity
    },
    getInitialStrawStock: (state) => state.initialStrawStock,
    getRefusalRate: (state) => state.refusalRate,
  },
  actions: {
    setStock({ state, commit }) {
      commit('workspace/updateSimulation', { key: 'barn', value: state }, { root: true })
    },
  },
}
