export default {
  namespaced: true,
  state: {
    initialStock: [],
    totalStock: [],
    stockByPeriod: [],
  },
  mutations: {
    setBarn(state, { totalStock, initialStock, stockByPeriod }) {
      state.totalStock = totalStock
      state.initialStock = initialStock
      state.stockByPeriod = stockByPeriod
    },
    // barn
    setInitialBarnStock(state, initialData) {
      state.initialStock = initialData
    },
    saveInitialStock(state, initialStock) {
      const foundStock = state.initialStock.find(
        (item) => item.code === initialStock.code && item.name === initialStock.name
      )
      if (!foundStock) {
        state.initialStock.push(initialStock)
      } else {
        foundStock.quantity += initialStock.quantity
      }
    },
    deleteBarnStockItem(state, stock) {
      state.initialStock = state.initialStock.filter((item) => !(item.code === stock.code && item.name === stock.name))
    },
    setTotalStock(state, totalStock) {
      state.totalStock = totalStock
    },
    setStockByPeriod(state, stockByPeriod) {
      state.stockByPeriod = stockByPeriod
    },
  },
  getters: {
    initialStock: (state) => state.initialStock,
    // barnStockTypes: (state) => {
    //   return state.initialStock.map((item) => item.type)
    // },
  },
  actions: {
    setStock({ state, commit }) {
      // commit('setStock', state.initialStock)
    },
  },
}
