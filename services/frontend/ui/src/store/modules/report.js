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
  getUGBtoFeed,
  getPastureProductionTotal,
  getPastureConsumptionTotal,
  getPastureFinalStock,
  getPastureFinalMinInitialStock,
  getPasturePurchaseValue,
  getAutonomy,
  getPotential,
  getSticProductionByBarnStockItemByPeriod,
  getConsumptionByBarnStockItemByPeriod,
  getSFP,
  getSAU,
  getStrawSurface,
  getCostIndicator,
  getCostIndicatorsKpis,
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
      if (
        Object.keys(rootState.simulator.farm.totalAvailablePastureByPeriod).length === 0 ||
        rootState.simulator.farm.rotations.length === 0 ||
        rootState.simulator.herd.batchs.length === 0
      ) {
        return []
      }
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
      if (rootState.simulator.farm.rotations.length === 0 || rootState.simulator.herd.batchs.length === 0) {
        return []
      }
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
      if (rootState.simulator.farm.rotations.length === 0 || rootState.simulator.herd.batchs.length === 0) {
        return []
      }
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
      if (rootState.simulator.farm.rotations.length === 0 || rootState.simulator.herd.batchs.length === 0) {
        return []
      }
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
          // production: replaceNan(getSticProductionByBarnStockItem(simulation, stockCode, periods, getStic), 0),
          production: replaceNan(rootGetters['simulator/barn/getTotalStrawStockProducted'], 0),
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
      if (rootState.simulator.farm.rotations.length === 0 || rootState.simulator.herd.batchs.length === 0) {
        return false
      }
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const getStic = rootGetters['referential/getSticByName']
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
      const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod
      var autonomy
      try {
        autonomy = getAutonomy(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod)
      } catch (error) {
        autonomy = null
      }
      return autonomy
    },
    getPotential: (state, getters, rootState, rootGetters) => {
      if (rootState.simulator.farm.rotations.length === 0 || rootState.simulator.herd.batchs.length === 0) {
        return 0
      }
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const getStic = rootGetters['referential/getSticByName']
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
      const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod
      // IF(E8 / E9 >= 0.9, 'au potentiel', 'pas au potentiel')
      var potential
      try {
        potential = _.round(
          replaceNan(getPotential(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod), 0),
          0
        )
      } catch (error) {
        potential = null
      }
      return potential
    },
    getDimensioning: (state, getters, rootState, rootGetters) => {
      const dimensioning = {
        nbAnimaux: 0,
        ugbN: 0,
        ugbAN: 0,
        chargeSAU: 0,
        chargeApparent: 0,
        chargeCorrige: 0,
        chargePotentiel: 0,
        autonomy: 0,
        fourragesRecoltes: 0,
        sfpSau: 0,
        ppSau: 0,
        ptSau: 0,
      }

      if (rootState.simulator.farm.rotations.length > 0 && rootState.simulator.herd.batchs.length > 0) {
        const simulation = rootState.simulator
        const batchs = rootState.simulator.herd.batchs
        const periods = rootState.referential.periods
        const getStic = rootGetters['referential/getSticByName']
        const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
        const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod

        try {
          dimensioning.nbAnimaux = _.round(replaceNan(getTotalHerd(batchs), 0), 0)
          dimensioning.ugbN = _.round(
            replaceNan(getUGBSystem(simulation, periods, stockCodeList, totalAvailablePastureByPeriod), 0),
            0
          )
          dimensioning.ugbAN = _.round(replaceNan(getUGBtoFeed(simulation, periods), 0), 0)
          dimensioning.chargeSAU = _.round(
            replaceNan(
              getEstimatedLivestockDensities(simulation, periods, totalAvailablePastureByPeriod, stockCodeList),
              0
            ),
            2
          )
          dimensioning.chargeApparent = _.round(
            replaceNan(
              getApparentLivestockDensities(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod),
              0
            ),
            2
          )
          dimensioning.chargeCorrige = _.round(
            replaceNan(
              getCorrectedLivestockDensities(
                simulation,
                periods,
                getStic,
                stockCodeList,
                totalAvailablePastureByPeriod
              ),
              0
            ),
            2
          )
          dimensioning.chargePotentiel = _.round(
            replaceNan(getPotentialLivestockDensities(simulation, periods, getStic, stockCodeList), 0),
            0
          )
          dimensioning.autonomy = getAutonomy(
            simulation,
            periods,
            getStic,
            stockCodeList,
            totalAvailablePastureByPeriod
          )
          dimensioning.fourragesRecoltes = _.round(
            replaceNan(
              getHarvestedFodder(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod),
              0
            ),
            2
          )
          dimensioning.sfpSau = _.round(replaceNan(getSFP_SAU(simulation, periods, getStic), 0), 0)
          dimensioning.ppSau = _.round(replaceNan(getPP_SAU(simulation, periods, getStic), 0), 0)
          dimensioning.ptSau = _.round(replaceNan(getPT_SAU(simulation, periods, getStic), 0), 0)
        } catch (error) {
          return dimensioning
        }
      }
      return dimensioning
    },
    getStockEvolution: (state, getters, rootState, rootGetters) => {
      const stocks = []

      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const initialStocks = simulation.barn.initialStocks

      // s'il y a de la paille alimentaire, on ajoute la paille ?!
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL', 'AS']

      stockCodeList.forEach((stockCode) => {
        // Attention décalage d'index pour injecter le stock initial
        const data = []

        // stock initial pour la periode 0
        const initialStock = initialStocks.find((item) => item.code === stockCode)
        data[0] = initialStock ? initialStock.quantity : 0
        if (rootState.simulator.farm.rotations.length > 0 && rootState.simulator.herd.batchs.length > 0) {
          // les autres periodes
          periods.forEach((period, index) => {
            const previousProduction = data[index]
            const sticProd = getSticProductionByBarnStockItemByPeriod(simulation, stockCode, index)
            const conso = getConsumptionByBarnStockItemByPeriod(simulation, period.id, stockCode)
            data[index + 1] = previousProduction + sticProd - conso
          })
        }

        const item = {
          name: rootState.referential.barnStockItems.find((item) => item.code === stockCode).name,
          code: stockCode,
          data: data.map((item) => _.round(replaceNan(item, 0))),
        }
        stocks.push(item)
      })
      return stocks
    },
    getCostIndicators: (state, getters, rootState, rootGetters) => (data) => {
      const simulation = rootState.simulator
      const periods = rootState.referential.periods
      const getStic = rootGetters['referential/getSticByName']
      const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
      const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod
      return getCostIndicator(data, periods, simulation, totalAvailablePastureByPeriod, stockCodeList, getStic)
    },
    getCIKpis: (state) => (data) => {
      return getCostIndicatorsKpis(data)
    },
  },
  actions: {
    setSimulation({ state, commit }) {
      commit('workspace/updateSimulation', { key: 'report', value: state }, { root: true })
    },
  },
}
