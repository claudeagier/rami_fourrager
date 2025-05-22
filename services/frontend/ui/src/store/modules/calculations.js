// calculations.js
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
  getRotationSurface,
} from './mixins'
import { replaceNan } from '@/plugins/utils'
import store from '@/store'
import _ from 'lodash'

const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']

function isValid(sim) {
  return sim?.farm?.rotations?.length > 0 && sim?.herd?.batchs?.length > 0
}

function getMilkProducted(sim) {
  var allAnimalsProductionVL = 0
  Object.values(sim.herd.batchs).forEach((batch) => {
    if (batch.profile.batch_type.code === 'VL') {
      allAnimalsProductionVL += batch.profile.milk_product_kg * batch.count
    }
  })
  return allAnimalsProductionVL
}
function extractParams(rootState = null, rootGetters = null) {
  if (!rootState || !rootGetters) {
    rootState = store.state
    rootGetters = store.getters
  }
  const sim = rootState.simulator
  return {
    sim,
    batchs: sim?.herd?.batchs ?? [],
    periods: rootState.referential?.periods ?? [],
    getStic: rootGetters['referential/getSticByName'],
    totalAvailablePastureByPeriod: sim?.farm?.totalAvailablePastureByPeriod ?? {},
  }
}

function wrap(fn) {
  return (params = null) => {
    const ctx = params || extractParams()
    return fn(ctx)
  }
}

export default {
  getNbAnimaux: wrap(({ sim }) => {
    if (!isValid(sim)) return ''
    return _.round(replaceNan(getTotalHerd(sim.herd.batchs), 0), 0)
  }),

  getUgbN: wrap(({ sim, periods, totalAvailablePastureByPeriod }) => {
    if (!isValid(sim)) return ''
    return _.round(replaceNan(getUGBSystem(sim, periods, stockCodeList, totalAvailablePastureByPeriod), 0), 0)
  }),

  getUgbAN: wrap(({ sim, periods }) => {
    if (!isValid(sim)) return ''
    return _.round(replaceNan(getUGBtoFeed(sim, periods), 0), 0)
  }),

  getChargeSAU: wrap(({ sim, periods, totalAvailablePastureByPeriod }) => {
    if (!isValid(sim)) return ''
    return _.round(
      replaceNan(getEstimatedLivestockDensities(sim, periods, totalAvailablePastureByPeriod, stockCodeList), 0),
      2
    )
  }),

  getChargeApparent: wrap(({ sim, periods, getStic, totalAvailablePastureByPeriod }) => {
    if (!isValid(sim)) return ''
    return _.round(
      replaceNan(getApparentLivestockDensities(sim, periods, getStic, stockCodeList, totalAvailablePastureByPeriod), 0),
      2
    )
  }),

  getChargeCorrige: wrap(({ sim, periods, getStic, totalAvailablePastureByPeriod }) => {
    if (!isValid(sim)) return ''
    return _.round(
      replaceNan(
        getCorrectedLivestockDensities(sim, periods, getStic, stockCodeList, totalAvailablePastureByPeriod),
        0
      ),
      2
    )
  }),

  getChargePotentiel: wrap(({ sim, periods, getStic }) => {
    if (!isValid(sim)) return ''
    return _.round(replaceNan(getPotentialLivestockDensities(sim, periods, getStic, stockCodeList), 0), 0)
  }),

  getAutonomy: wrap(({ sim, periods, getStic, totalAvailablePastureByPeriod }) => {
    if (!isValid(sim)) return ''
    return _.round(replaceNan(getAutonomy(sim, periods, getStic, stockCodeList, totalAvailablePastureByPeriod), 0), 4)
  }),

  getFourragesRecoltes: wrap(({ sim, periods, getStic, totalAvailablePastureByPeriod }) => {
    if (!isValid(sim)) return ''
    return _.round(
      replaceNan(getHarvestedFodder(sim, periods, getStic, stockCodeList, totalAvailablePastureByPeriod), 0),
      2
    )
  }),

  getSfpSau: wrap(({ sim, periods, getStic }) => {
    if (!isValid(sim)) return ''
    return _.round(replaceNan(getSFP_SAU(sim, periods, getStic), 0), 0)
  }),

  getPpSau: wrap(({ sim, periods, getStic }) => {
    if (!isValid(sim)) return ''
    return _.round(replaceNan(getPP_SAU(sim, periods, getStic), 0), 0)
  }),

  getPtSau: wrap(({ sim, periods, getStic }) => {
    if (!isValid(sim)) return ''
    return _.round(replaceNan(getPT_SAU(sim, periods, getStic), 0), 0)
  }),
  getPotential: wrap(({ sim, periods, getStic, totalAvailablePastureByPeriod }) => {
    if (!isValid(sim)) return ''
    try {
      return _.round(
        replaceNan(
          getPotential(sim, periods, getStic, ['FH', 'EH', 'EM', 'EL', 'FL'], totalAvailablePastureByPeriod),
          0
        ),
        0
      )
    } catch (error) {
      console.warn('[calculations/getPotential] Erreur :', error)
      return ''
    }
  }),
  getPP: wrap(({ sim, periods, getStic }) => {
    if (!isValid(sim)) return ''
    return getRotationSurface('PP', sim, getStic)
  }),
  getPT: wrap(({ sim, periods, getStic }) => {
    if (!isValid(sim)) return ''
    return getRotationSurface('PT', sim, getStic)
  }),
  getCorn: wrap(({ sim, periods, getStic }) => {
    if (!isValid(sim)) return ''
    return getRotationSurface('PCF', sim, getStic)
  }),
  getMilkProdcution: wrap(({ sim }) => {
    if (!isValid(sim)) return ''
    return getMilkProducted(sim)
  }),
  getSoldedMilk: wrap(({ sim }) => {
    if (!isValid(sim)) return ''
    var allAnimalsProductionVL = 0
    Object.values(sim.herd.batchs).forEach((batch) => {
      if (batch.profile.batch_type.code === 'VL') {
        allAnimalsProductionVL += batch.profile.milk_product_kg * batch.count
      }
    })
    return allAnimalsProductionVL * 0.95
  }),
  getMilkConsum: wrap(({ sim }) => {
    if (!isValid(sim)) return ''

    return getMilkProducted(sim) - getMilkProducted(sim) * 0.95
  }),

  isToComplet: () => {
    return 'TO_COMPLETE'
  },
  extractParams,
}
