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
  getAutonomy,
  getPotential,
  getSticProductionByBarnStockItemByPeriod,
  getConsumptionByBarnStockItemByPeriod,
} from './mixins'
import { replaceNan } from '@/plugins/utils'

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
  mutations: {
    setReport(state, { soldedStock }) {
      state.soldedStock = soldedStock
    },
    setSoldedStock(state, stock) {
      state.soldedStock[stock.code][stock.key] = stock.value
    },
  },
  getters: {
    getPastureStock: (state, getters, rootState) => {
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      // patures
      return [
        {
          name: 'Pâtures',
          category: '1_fourrage',
          code: 'P',
          initialStock: 0,
          production: replaceNan(getPastureProductionTotal(simulation), 0),
          consommation: replaceNan(getPastureConsumptionTotal(simulation, periods), 0),
          finalStock: replaceNan(getPastureFinalStock(simulation, periods), 0),
          final_initialStock: replaceNan(getPastureFinalMinInitialStock(simulation, periods), 0),
          purchase: replaceNan(getPasturePurchaseValue(simulation, periods), 0),
          purchaseCost: state.soldedStock['P'].purchaseCost,
          sale: state.soldedStock['P'].sale,
          costOfSell: state.soldedStock['P'].costOfSell,
          productionCost: state.soldedStock['P'].productionCost,
          total: 0,
        },
      ]
    },
    getClassicFeedsStock: (state, getters, rootState, rootGetters) => {
      const stock = []
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const getStic = rootGetters['referential/getSticByName']
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
      stockCodeList.forEach((stockCode) => {
        const stockItem = {
          name: rootState.referential.barnStockItems.find((item) => item.code === stockCode).name,
          category: '1_fourrage',
          code: stockCode,
          initialStock: replaceNan(getInitialStockByBarnStockItem(simulation, stockCode), 0),
          production: replaceNan(getSticProductionByBarnStockItem(simulation, stockCode, periods, getStic), 0),
          consommation: replaceNan(getConsumptionByBarnStockItem(simulation, periods, stockCode), 0),
          finalStock: replaceNan(getFinalStockByBarnStockItem(simulation, stockCode, periods, getStic), 0),
          final_initialStock: replaceNan(
            getFinalMinInitialStockByBarnStockItem(simulation, stockCode, periods, getStic),
            0
          ),
          purchase: replaceNan(getPurchaseValueByBarnStockItem(simulation, stockCode, periods, getStic), 0),
          purchaseCost: state.soldedStock[stockCode].purchaseCost,
          sale: state.soldedStock[stockCode].sale,
          costOfSell: state.soldedStock[stockCode].costOfSell,
          productionCost: state.soldedStock[stockCode].productionCost,
          total: 0,
        }
        stock.push(stockItem)
      })

      return stock
    },

    getConcentratedFeedsStock: (state, getters, rootState, rootGetters) => {
      // FIXME et les conso?

      const stock = []
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const stockCodeList = ['RC', 'RP']
      const getStic = rootGetters['referential/getSticByName']
      stockCodeList.forEach((stockCode) => {
        const stockItem = {
          name: rootState.referential.barnStockItems.find((item) => item.code === stockCode).name,
          code: stockCode,
          category: '2_concentrated',
          initialStock: replaceNan(getInitialStockByBarnStockItem(simulation, stockCode), 0),
          production: replaceNan(getSticProductionByBarnStockItem(simulation, stockCode, periods, getStic), 0),
          consommation: replaceNan(getConsumptionByBarnStockItem(simulation, periods, stockCode), 0),
          finalStock: replaceNan(getFinalStockByBarnStockItem(simulation, stockCode, periods, getStic), 0),
          final_initialStock: replaceNan(
            getFinalMinInitialStockByBarnStockItem(simulation, stockCode, periods, getStic),
            0
          ),
          purchase: replaceNan(getPurchaseValueByBarnStockItem(simulation, stockCode, periods, getStic), 0),
          purchaseCost: state.soldedStock[stockCode].purchaseCost,
          sale: state.soldedStock[stockCode].sale,
          costOfSell: state.soldedStock[stockCode].costOfSell,
          productionCost: state.soldedStock[stockCode].productionCost,
          total: 0,
        }
        stock.push(stockItem)
      })
      return stock
    },

    getStrawStock: (state, getters, rootState, rootGetters) => {
      // FIXME et les conso?
      const stock = []
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const stockCodeList = ['STRAW']
      const getStic = rootGetters['referential/getSticByName']
      stockCodeList.forEach((stockCode) => {
        const stockItem = {
          name: 'paille',
          category: '3_straw',
          code: stockCode,
          initialStock: replaceNan(getInitialStockByBarnStockItem(simulation, stockCode), 0),
          production: replaceNan(getSticProductionByBarnStockItem(simulation, stockCode, periods, getStic), 0),
          consommation: replaceNan(getConsumptionByBarnStockItem(simulation, periods, stockCode), 0),
          finalStock: replaceNan(getFinalStockByBarnStockItem(simulation, stockCode, periods, getStic), 0),
          final_initialStock: replaceNan(
            getFinalMinInitialStockByBarnStockItem(simulation, stockCode, periods, getStic),
            0
          ),
          purchase: replaceNan(getPurchaseValueByBarnStockItem(simulation, stockCode, periods, getStic), 0),
          purchaseCost: state.soldedStock['STRAW'].purchaseCost,
          sale: state.soldedStock['STRAW'].sale,
          costOfSell: state.soldedStock['STRAW'].costOfSell,
          productionCost: state.soldedStock['STRAW'].productionCost,
          total: 0,
        }
        stock.push(stockItem)
      })
      return stock
    },

    getAutonomy: (state, getters, rootState, rootGetters) => {
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const getStic = rootGetters['referential/getSticByName']
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
      const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod

      return getAutonomy(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod)
    },
    getPotential: (state, getters, rootState, rootGetters) => {
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const getStic = rootGetters['referential/getSticByName']
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
      const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod
      // IF(E8 / E9 >= 0.9, 'au potentiel', 'pas au potentiel')
      return _.round(
        replaceNan(getPotential(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod), 0),
        0
      )
    },
    getDimensioning: (state, getters, rootState, rootGetters) => {
      const simulation = rootState.simulator
      const batchs = rootState.simulator.herd.batchs
      const periods = rootState.referential.periods
      const getStic = rootGetters['referential/getSticByName']
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
      const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod

      return {
        nbAnimaux: _.round(replaceNan(getTotalHerd(batchs), 0), 0),
        ugb: _.round(replaceNan(getUGBSystem(simulation, periods, stockCodeList, totalAvailablePastureByPeriod), 0), 0),
        chargeSAU: _.round(
          replaceNan(
            getEstimatedLivestockDensities(simulation, periods, totalAvailablePastureByPeriod, stockCodeList),
            0
          ),
          2
        ),
        chargeApparent: _.round(
          replaceNan(
            getApparentLivestockDensities(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod),
            0
          ),
          2
        ),
        chargeCorrige: _.round(
          replaceNan(
            getCorrectedLivestockDensities(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod),
            0
          ),
          2
        ),
        chargePotentiel: _.round(
          replaceNan(getPotentialLivestockDensities(simulation, periods, getStic, stockCodeList), 0),
          0
        ),
        autonomy: getAutonomy(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod),
        fourragesRecoltes: _.round(
          replaceNan(getHarvestedFodder(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod), 0),
          2
        ),
        sfpSau: _.round(replaceNan(getSFP_SAU(simulation, periods, getStic), 0), 0),
        ppSau: _.round(replaceNan(getPP_SAU(simulation, periods, getStic), 0), 0),
        ptSau: _.round(replaceNan(getPT_SAU(simulation, periods, getStic), 0), 0),
      }
    },
    getStockEvolution: (state, getters, rootState, rootGetters) => {
      // par period le récolté de la même période + celui d'avant - (la conso prévu par les rations pour chaque lot)
      const simulation = rootState.simulator
      const periods = rootState.referential.periods

      // s'il y a de la paille alimentaire, on ajoute la paille ?!
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL', 'AS']
      const initialStocks = simulation.barn.initialStocks

      const stocks = []
      stockCodeList.forEach((stockCode) => {
        // Attention décalage d'index pour injecter le stock initial
        const data = []

        // stock initial pour la periode 0
        const initialStock = initialStocks.find((item) => item.code === stockCode)
        data[0] = initialStock ? initialStock.quantity : 0

        // les autres periodes
        periods.forEach((period, index) => {
          const previousProduction = data[index]
          const sticProd = getSticProductionByBarnStockItemByPeriod(simulation, stockCode, index)
          const conso = getConsumptionByBarnStockItemByPeriod(simulation, period.id, stockCode)
          data[index + 1] = previousProduction + sticProd - conso
        })

        const item = {
          name: rootState.referential.barnStockItems.find((item) => item.code === stockCode).name,
          code: stockCode,
          data: data.map((item) => _.round(replaceNan(item, 0))),
        }
        stocks.push(item)
      })
      return stocks
    },
  },
  actions: {
    setSimulation({ state, commit }) {
      commit('workspace/updateSimulation', { key: 'report', value: state }, { root: true })
    },
  },
}
