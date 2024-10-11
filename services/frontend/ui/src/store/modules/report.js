import _ from 'lodash'
import {
  getApparentLivestockDensities,
  getConsumptionByBarnStockItem,
  getCorrectedLivestockDensities,
  getEstimatedLivestockDensities,
  getFinalMinInitialStockByBarnStockItem,
  getFinalStockByBarnStockItem,
  getHarvestedFodder,
  getInitialStockByBarnStockItem,
  getPotentialLivestockDensities,
  getPP_SAU,
  getPT_SAU,
  getPurchaseValueByBarnStockItem,
  getSFP_SAU,
  getSticProductionByBarnStockItem,
  getTotalHerd,
  getUGBSystem,
  getPastureProductionTotal,
  getPastureConsumptionTotal,
  getPastureFinalStock,
  getPastureFinalMinInitialStock,
  getPasturePurchaseValue,
} from './mixins'

export default {
  namespaced: true,
  state: {
    soldedStock: {
      P: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
      FH: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
      EH: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
      EM: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
      RC: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
      RP: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
      AS: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
      EL: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
      FL: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
      STRAW: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
    },
  },
  getters: {
    getTotalHerd: (state, getters, rootState, rootGetters) => {
      console.log('rootgetters', rootGetters)
      console.log('rootState', rootState)
      return rootGetters
    },

    getPastureStock: (state, getters, rootState) => {
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      // patures
      return [
        {
          name: 'Pâtures',
          initialStock: 0,
          production: _.round(getPastureProductionTotal(simulation), 0),
          consommation: _.round(getPastureConsumptionTotal(simulation, periods), 0),
          finalStock: _.round(getPastureFinalStock(simulation, periods), 0),
          final_initialStock: _.round(getPastureFinalMinInitialStock(simulation, periods), 0),
          purchase: _.round(getPasturePurchaseValue(simulation, periods), 0),
          sold: simulation.report.soldedStock['P'].sale, // valeur à saisir
        },
      ]
    },
    getClassicFeedsStock: (state, getters, rootState) => {
      const stock = []
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
      stockCodeList.forEach((stockCode) => {
        const stockItem = {
          name: rootState.referential.barnStockItems.find((item) => item.code === stockCode).name,
          initialStock: getInitialStockByBarnStockItem(simulation, stockCode),
          production: getSticProductionByBarnStockItem(simulation, stockCode, periods),
          consommation: getConsumptionByBarnStockItem(simulation, periods, stockCode),
          finalStock: getFinalStockByBarnStockItem(simulation, stockCode, periods),
          final_initialStock: getFinalMinInitialStockByBarnStockItem(simulation, stockCode, periods),
          purchase: getPurchaseValueByBarnStockItem(simulation, stockCode, periods),
          sold: state.soldedStock[stockCode], // valeur à saisir
        }
        stock.push(stockItem)
      })

      return stock
    },

    getConcentratedFeedsStock: (state, getters, rootState) => {
      const stock = []
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const stockCodeList = ['RC', 'RP']
      stockCodeList.forEach((stockCode) => {
        const stockItem = {
          name: rootState.referential.barnStockItems.find((item) => item.code === stockCode).name,
          initialStock: getInitialStockByBarnStockItem(simulation, stockCode),
          production: getSticProductionByBarnStockItem(simulation, stockCode, periods),
          consommation: getConsumptionByBarnStockItem(simulation, periods, stockCode),
          finalStock: getFinalStockByBarnStockItem(simulation, stockCode, periods),
          final_initialStock: getFinalMinInitialStockByBarnStockItem(simulation, stockCode, periods),
          purchase: getPurchaseValueByBarnStockItem(simulation, stockCode, periods),
          sold: state.soldedStock[stockCode], // valeur à saisir
        }
        stock.push(stockItem)
      })
      return stock
    },
    getStrawStock: (state, getters, rootState) => {
      const stock = []
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const stockCodeList = ['STRAW']
      stockCodeList.forEach((stockCode) => {
        const stockItem = {
          name: 'paille',
          initialStock: getInitialStockByBarnStockItem(simulation, stockCode),
          production: getSticProductionByBarnStockItem(simulation, stockCode, periods),
          consommation: getConsumptionByBarnStockItem(simulation, periods, stockCode),
          finalStock: getFinalStockByBarnStockItem(simulation, stockCode, periods),
          final_initialStock: getFinalMinInitialStockByBarnStockItem(simulation, stockCode, periods),
          purchase: getPurchaseValueByBarnStockItem(simulation, stockCode, periods),
          sold: state.soldedStock[stockCode], // valeur à saisir
        }
        stock.push(stockItem)
      })
      return stock
    },

    getDimensioning: (state, getters, rootState, rootGetters) => {
      const simulation = rootState.simulator
      const batchs = rootState.simulator.herd.batchs
      const periods = rootState.referential.periods
      const getStic = rootGetters['referential/getSticByName']
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
      const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod
      return {
        nbAnimaux: getTotalHerd(batchs),
        ugb: getUGBSystem(simulation, periods, stockCodeList, totalAvailablePastureByPeriod),
        chargeSAU: getEstimatedLivestockDensities(simulation, periods, totalAvailablePastureByPeriod, stockCodeList),
        chargeApparent: getApparentLivestockDensities(
          simulation,
          periods,
          getStic,
          stockCodeList,
          totalAvailablePastureByPeriod
        ),
        chargeCorrige: getCorrectedLivestockDensities(
          simulation,
          periods,
          getStic,
          stockCodeList,
          totalAvailablePastureByPeriod
        ),
        chargePotentiel: getPotentialLivestockDensities(simulation, periods, getStic, stockCodeList),
        fourragesRecoltes: getHarvestedFodder(simulation, periods, getStic),
        sfpSau: getSFP_SAU(simulation, periods, getStic),
        ppSau: getPP_SAU(simulation, periods, getStic),
        ptSau: getPT_SAU(simulation, periods, getStic),
      }
    },
  },
}
