export default {
  namespaced: true,
  state: {
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
    // stock_by_period: [
    //   // exemple de contenu du stock par period
    //   // {
    //   //   period: 1,
    //   //   stock: [
    //   //     { type: 'concentratedFeed', name: '', quantity: 5 },
    //   //     { type: 'Feed', name: '', quantity: 22 },
    //   //   ],
    //   // },
    //   // {
    //   //   period: 1,
    //   //   stock: [
    //   //     { type: 'concentratedFeed', name: '', quantity: 5 },
    //   //     { type: 'Feed', name: '', quantity: 2 },
    //   //   ],
    //   // },
    // ],
  },
  mutations: {
    // barn
    setInitialBarnStock(state, initialData) {
      state.stock = initialData
    },
    updateBarnStock(state, { type, name, quantity }) {
      const foundStock = state.stock.find((item) => item.type === type && item.name === name)
      if (!foundStock) {
        state.stock.push({ type, name, quantity })
      } else {
        foundStock.quantity += quantity
      }
    },
    // // ajouter les mutations pour permettre la mise à jour des valeurs
    // // Pour la gestion de stock et de stock_by_period de barn
    // updateBarnStockByPeriod(state, { period, type, name, quantity }) {
    //   const periodId = state.periods.findIndex((p) => p.period === period)
    //   if (periodId === -1) {
    //     state.periods.push({ period, stock: [{ type, name, quantity }] })
    //   } else {
    //     const foundStock = state.periods[periodId].stock.find((item) => item.type === type && item.name === name)
    //     if (!foundStock) {
    //       state.periods[periodId].stock.push({ type, name, quantity })
    //     } else {
    //       foundStock.quantity += quantity
    //     }
    //   }
    //   // Mettre à jour le stock global également
    //   const foundGlobalStock = state.stock.find((item) => item.type === type && item.name === name)
    //   if (!foundGlobalStock) {
    //     state.stock.push({ type, name, quantity })
    //   } else {
    //     foundGlobalStock.quantity += quantity
    //   }
    // },
    deleteBarnStockItem(state, { type, name }) {
      state.stock = state.stock.filter((item) => !(item.type === type && item.name === name))
    },
  },
  getters: {
    barnStock: (state) => state.stock,
    // barnStockByPeriod: (state) => state.stock_by_period,
    barnStockTypes: (state) => {
      return state.stock.map((item) => item.type)
    },
    // totalBarnStockByType: (state) => (type) => {
    //   return state.stock.reduce((total, item) => {
    //     if (item.type === type) {
    //       return total + item.quantity
    //     }
    //     return total
    //   }, 0)
    // },
    // totalBarnStockByTypeAndPeriod: (state) => (type, period) => {
    //   const periodStock = state.stock_by_period.find((item) => item.period === period)
    //   if (periodStock) {
    //     return periodStock.stock.reduce((total, item) => {
    //       if (item.type === type) {
    //         return total + item.quantity
    //       }
    //       return total
    //     }, 0)
    //   }
    //   return 0
    // },
  },
}
