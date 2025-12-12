import _ from 'lodash'
import { deepCopy, fixFloatingPoint } from '@/plugins/utils'

const UGB = 4.75 // une constante 4.75 tMs ingérée pour 1 UGB
const DAYS_BY_PERIOD = 28

const getTotalProportion = (feeds) => {
  return Object.values(feeds).reduce((acc, curr) => {
    return acc + curr.proportion
  }, 0.0)
}
const proportionsCompleted = (feeds) => {
  const totalProportion = getTotalProportion(feeds)
  if (totalProportion < 100) {
    return false
    // add complement
  }
  return true
}
const calculateTotalUE = (UEcolumn, feeds) => {
  const precision = 4
  const newFeeds = deepCopy(feeds)
  if (!proportionsCompleted(feeds)) {
    // // add complement
    newFeeds.push({
      type: {
        name: 'Ecart ingestion potentiel',
        correspondingStock: 'EIP',
        nutritional_values: {
          UEL: 1,
          UEB: 1,
          UEM: 1,
          UFL: 1,
          PDI_inf: 1,
          UFV: 1,
          PDIN: 0,
          PDIE: 0,
          rejection: 0,
        },
      },
      proportion: 100 - getTotalProportion(feeds),
    })
    return 1
  }

  const val = Object.values(newFeeds).reduce((acc, curr) => {
    var DEF = 0
    if (curr.type.nutritional_values[UEcolumn]) {
      DEF = fixFloatingPoint((curr.proportion / 100) * curr.type.nutritional_values[UEcolumn], precision)
    }
    return acc + DEF
  }, 0.0)
  return val > 0 ? val : 1
}
// H233 besoin MS
const calculateBesoinMS = (ci = 1, toModerate = false, potential = 1, ueColumn, feeds) => {
  var moderator = 1
  if (toModerate) {
    moderator = 0.1582 * potential + 0.8392
  }
  const moderatedCI = ci * moderator

  return fixFloatingPoint(moderatedCI / calculateTotalUE(ueColumn, feeds), 4)
}
// H234
const calculateEnergeticBesoin = (ufl, toModerate = false, potential = 1) => {
  var moderator = 1
  if (toModerate) {
    moderator = 0.5367 * potential + 0.4582
  }
  return ufl * moderator
}
// H235
const calculateProteicBesoin = (pdi, toModerate = false, potential = 1) => {
  var moderator = 1
  if (toModerate) {
    moderator = 0.6431 * potential + 0.3522
  }
  return pdi * moderator
}

// *******************************************************//
// ****************** LES PATURES ************************//
// *******************************************************//

// H28 production pature totale, w29 energetic total et w30 proteic total
export const setTotalAvailablePasture = (simulation, periods, getStic) => {
  // periods = rootState.referential.periods

  const precision = 15
  const totalAvailablePastureByPeriod = {}
  periods.forEach((period) => {
    const key = 'period_id_' + period.id
    var total = 0
    var UF = 0
    var PDI = 0
    if (simulation.farm.rotations !== undefined && simulation.farm.rotations.length > 0) {
      total = Object.values(simulation.farm.rotations).reduce((total, rotation) => {
        // find stic in sticList
        const stic = getStic(simulation.climaticYear, rotation.name)
        const sp = stic.stic_periods.find((el) => el.period_id === period.id)
        var calcul = 0
        if (sp.farming_method === 'P' && sp.production > 0) {
          calcul = fixFloatingPoint(sp.production * rotation.surface, precision)
        }
        return total + calcul
      }, 0) // ok
      UF = Object.values(simulation.farm.rotations).reduce((uf, rotation) => {
        // find stic in sticList
        const stic = getStic(simulation.climaticYear, rotation.name)

        const sp = stic.stic_periods.find((el) => el.period_id === period.id)
        var num = 0
        if (sp.farming_method === 'P' && sp.production > 0) {
          num = fixFloatingPoint(
            ((sp.production * rotation.surface) / total) * stic.pasture_type.nutritional_values.UFL,
            precision
          )
        }
        return uf + num
      }, 0.0)

      PDI = Object.values(simulation.farm.rotations).reduce((pdi, rotation) => {
        // find stic in sticList
        const stic = getStic(simulation.climaticYear, rotation.name)

        const sp = stic.stic_periods.find((el) => el.period_id === period.id)
        if (sp.farming_method === 'P' && sp.production > 0) {
          const calcul = sp.production * rotation.surface
          const num = fixFloatingPoint((calcul / total) * stic.pasture_type.nutritional_values.PDI_inf, precision)
          return pdi + num
        }
        return pdi
      }, 0.0)
    }
    totalAvailablePastureByPeriod[key] = {
      production_total: total, // H28
      energeticTotal: UF, // W29
      proteicTotal: PDI, // W30
    }
  })

  return totalAvailablePastureByPeriod
}

// 240 Pâture verte disponible (kg MS/animal/jour ou kgMS/jour si nb anx=0) les valeurs à afficher dans la simu
export const getAvailableGreenPastureByAnimal = (batch, period, totalAvailablePastureByPeriod, batchs) => {
  // il faut prendre en compte tous les lots
  // le modele nourri en premier le premier lot et ensuite les autres s'il reste des patures

  const priority = batch.priorityOrder
  if (priority === 0) {
    // youpi c'est le premier lot à nourrire
    return fixFloatingPoint(
      totalAvailablePastureByPeriod['period_id_' + (period + 1)].production_total /
        batch.housing.presence[period].animalCount,
      3
    )
  } else {
    // il y a d'autre lot à nourrire en premier
    const previousBatch = batchs.find((b) => b.priorityOrder === priority - 1)

    const h240 = getAvailableGreenPastureByAnimal(previousBatch, period, totalAvailablePastureByPeriod, batchs)
    const h246 = getGreenPastureConsumption(previousBatch, period, totalAvailablePastureByPeriod, batchs)

    // reste du premier lot (I$240-I$246)*$LOT1.I$7
    // retour consommation du second lot : reste de premier lot/nb animaux lot2
    return fixFloatingPoint(
      ((h240 - h246) * previousBatch.housing.presence[period].animalCount) / batch.housing.presence[period].animalCount,
      3
    )
  }
}
// 650 : excès pâture après passage des lots (kgMS/jour)
const excessPastureCache = {}
export const getExcessPastureAfterBatchesPassed = (batchs, totalAvailablePastureByPeriod, period) => {
  if (period < 0) {
    return 0
  }

  const cacheKey = `${period}`
  if (excessPastureCache[cacheKey] !== undefined) {
    return excessPastureCache[cacheKey]
  }

  const sumPastureConsumption = Object.values(batchs).reduce((acc, curr) => {
    const h246 = getGreenPastureConsumption(curr, period, totalAvailablePastureByPeriod, batchs)
    const h7 = curr.housing.presence[period].animalCount
    const consoForBatch = h246 * h7
    return acc + consoForBatch
  }, 0.0)

  const excess = fixFloatingPoint(
    totalAvailablePastureByPeriod['period_id_' + (period + 1)].production_total - sumPastureConsumption,
    3
  )

  excessPastureCache[cacheKey] = excess
  return excess
}
// 241 Consommation pâture prévue par la ration (kgMS/animal/j)
export const getPastureConsumptionPlannedByClassicFeed = (batch, period) => {
  // la proprotion de la ration pature * besoin en mmatière seche 233
  const feed = batch.classicFeeds[period].feeds.find((el) => el.type.correspondingStock === 'P')
  if (feed === undefined) {
    return 0
  }
  const pastureProportion = feed.proportion / 100 // c'et un pourcentage à passer en proportion
  const ci = batch.profile.animal_profile_periods[period].CI
  const toModerate = batch.profile.batch_type.code === 'VL'
  const potential = 1
  const UEcolumn = batch.profile.batch_type.UE_value_considered
  const feeds = batch.classicFeeds[period].feeds
  const needed = calculateBesoinMS(ci, toModerate, potential, UEcolumn, feeds)

  return pastureProportion * needed
}
// 242 Consommation max pâture "verte"
export const getMaxConsumptionGreenPasture = (batch, period, totalAvailablePastureByPeriod, batchs) => {
  // le plus petit entre 240 et 241
  const h240 = getAvailableGreenPastureByAnimal(batch, period, totalAvailablePastureByPeriod, batchs)
  const h241 = getPastureConsumptionPlannedByClassicFeed(batch, period)
  const val = [h240, h241]
  return _.min(val)
}
// 243 Pâture reportée disponible (kgMS/animal/j)
export const getAvailableCarryOverPastureByAnimal = (batch, period, totalAvailablePastureByPeriod, batchs) => {
  const priority = batch.priorityOrder
  const nbAnimals = batch.housing.presence[period].animalCount === 0 ? 1 : batch.housing.presence[period].animalCount
  if (priority === 0) {
    // youpi c'est le premier lot à nourrir
    var excess = 0
    if (period > 0) {
      const h650 = getExcessPastureAfterBatchesPassed(batchs, totalAvailablePastureByPeriod, period - 1)

      excess = fixFloatingPoint(h650 / nbAnimals, 3)
    }
    return excess
  } else {
    // pour le lot 2
    const previousBatch = batchs.find((b) => b.priorityOrder === priority - 1)
    const i243 = getAvailableCarryOverPastureByAnimal(previousBatch, period, totalAvailablePastureByPeriod, batchs)
    const i247 = getCarryOverPastureConsumption(previousBatch, period, totalAvailablePastureByPeriod, batchs)

    // reste du premier lot (I$240-I$246)*$LOT1.I$7
    // retour consommation du second lot : reste de premier lot/nb animaux lot2
    return fixFloatingPoint(((i243 - i247) * previousBatch.housing.presence[period].animalCount) / nbAnimals, 3)
  }
}
// 244 Consommation max du pool de pâture "reportée"  (kg MS/animal/jour)
export const getAllPastureMaxConsumption = (batch, period, totalAvailablePastureByPeriod, batchs) => {
  // le plus petit entre 243 et 241
  const i243 = getAvailableCarryOverPastureByAnimal(batch, period, totalAvailablePastureByPeriod, batchs)
  const i241 = getPastureConsumptionPlannedByClassicFeed(batch, period) // OK
  const val = [i243, i241]
  return _.min(val)
}
// 246 consommation pature verte
const greenPastureConsumptionCache = {}
export const getGreenPastureConsumption = (
  batch,
  period,
  totalAvailablePastureByPeriod,
  batchs,
  pasture_strategy = null
) => {
  const cacheKey = `${batch.id}-${period}`
  if (greenPastureConsumptionCache[cacheKey] !== undefined) {
    return greenPastureConsumptionCache[cacheKey]
  }

  const strategy =
    pasture_strategy != null
      ? pasture_strategy
      : batch.pastureStrategy[period].carryOver !== null
        ? batch.pastureStrategy[period].carryOver
        : 0

  const h242 = getMaxConsumptionGreenPasture(batch, period, totalAvailablePastureByPeriod, batchs)
  let result
  if (strategy === 1) {
    const h241 = getPastureConsumptionPlannedByClassicFeed(batch, period)
    const h244 = period > 0 ? getAllPastureMaxConsumption(batch, period, totalAvailablePastureByPeriod, batchs) : 0
    result = Math.max(0, _.min([h242, h241 - h244]))
  } else {
    result = Math.max(0, h242)
  }

  greenPastureConsumptionCache[cacheKey] = result
  return result
}
// 247 consommation pature reporté si report
export const getCarryOverPastureConsumption = (batch, period, totalAvailablePastureByPeriod, batchs) => {
  // si report pature = 1
  const strategy = batch.pastureStrategy[period].carryOver !== null ? batch.pastureStrategy[period].carryOver : 0
  if (strategy === 1) {
    // 244
    return Math.max(0, getAllPastureMaxConsumption(batch, period, totalAvailablePastureByPeriod, batchs))
  } else {
    // MIN(I244;I241-I242)
    const i244 = getAllPastureMaxConsumption(batch, period, totalAvailablePastureByPeriod, batchs)
    const i241 = getPastureConsumptionPlannedByClassicFeed(batch, period)
    const i242 = getMaxConsumptionGreenPasture(batch, period, totalAvailablePastureByPeriod, batchs)

    const val = [i244, i241 - i242]
    return Math.max(0, _.min(val))
  }
}
export const getPasturesByPeriod = (coverage, batch, period, totalAvailablePastureByPeriod, batchs) => {
  const precision = 3
  if (batch === undefined) {
    console.error('batch_not_found')
    return
  }
  if (
    !totalAvailablePastureByPeriod ||
    totalAvailablePastureByPeriod['period_id_' + (period + 1)] === undefined
  ) {
    return 0
  }
  const i246 =
    getGreenPastureConsumption(batch, period, totalAvailablePastureByPeriod, batchs) || 0
  const i247 =
    getCarryOverPastureConsumption(batch, period, totalAvailablePastureByPeriod, batchs) || 0
  // =I$246*X29+I$247*W29*0,92
  // (consommation pature verte * x 29 correspondant à la période) + (consommation pature reporté si report * w29 correspondant à la période précédente* 0.92)
  // x29 = totalAvailablePasture[period].energeticTotal
  // w29 = totalAvailablePasture[period-1].energeticTotal
  var previous = 0
  if (period > 0) {
    // const factor = coverage === 'energeticTotal' ? 0.92 : 1 si unoquement pour energeticTotal
    const factor = 0.92
    previous = i247 * totalAvailablePastureByPeriod['period_id_' + period][coverage] * factor
  }

  const currentVal = i246 * totalAvailablePastureByPeriod['period_id_' + (period + 1)][coverage]
  return fixFloatingPoint(currentVal + previous, 6)
}
// 248 Consommation pâture totale 246+247
const getTotalPastureConsumption = (batch, period, totalAvailablePastureByPeriod, batchs) => {
  return (
    getGreenPastureConsumption(batch, period, totalAvailablePastureByPeriod, batchs) +
    getCarryOverPastureConsumption(batch, period, totalAvailablePastureByPeriod, batchs)
  )
}

// *******************************************************//
// ********************** LES UF *************************//
// *******************************************************//
// H267
const getUFFeedsByPeriod = (batch, after = false) => {
  const precision = 6
  if (batch === undefined) {
    console.error('batch_not_found')
    return
  }

  const UFcolumn = batch.profile.batch_type.UF_value_considered
  const UEcolumn = batch.profile.batch_type.UE_value_considered

  return batch.classicFeeds.map(({ period, feeds }, index) => {
    const batchValuesForPeriod = batch.profile.animal_profile_periods[index]
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1

    const sumUF = Object.values(feeds).reduce((acc, curr) => {
      var UF = 0
      if (curr.type.name !== 'Pâture') {
        if (after) {
          // ( H254 = proportion * (H233 = besoin MS)) * uf ration correspondant
          const besoinMS = calculateBesoinMS(batchValuesForPeriod.CI, toModerate, potential, UEcolumn, feeds) // ok
          UF = (curr.proportion / 100) * besoinMS * curr.type.nutritional_values[UFcolumn]
        } else {
          UF = (curr.proportion / 100) * curr.type.nutritional_values[UFcolumn]
        }
      }
      return acc + UF
    }, 0.0)
    return fixFloatingPoint(sumUF, precision)
  })
}
// uniquement pour energeticCoverage
const getUFPasturesByPeriodBefore = (batch, totalAvailablePastureByPeriod) => {
  const precision = 3
  if (batch === undefined) {
    console.error('batch_not_found')
    return
  }

  return batch.classicFeeds.map(({ period, feeds }, index) => {
    const periodId = period.id
    const sumUF = Object.values(feeds).reduce((acc, curr) => {
      const UFcolumn = batch.profile.batch_type.UF_value_considered
      // si c'est des patures
      var DEF = 0
      if (curr.type.name === 'Pâture') {
        // ajout des patures
        if (
          totalAvailablePastureByPeriod === null ||
          totalAvailablePastureByPeriod['period_id_' + periodId] === undefined
        ) {
          return
        }
        const energyPasture = totalAvailablePastureByPeriod['period_id_' + periodId].energeticTotal
        DEF = energyPasture * (curr.proportion / 100)
      }
      return acc + DEF
    }, 0.0)
    return sumUF
  })
}
// 272 uf apporté par les concentrés pour finalEnergeticCoverage
const getUFConcentratedByPeriod = (batch) => {
  const precision = 4
  if (batch === undefined) {
    console.error('batch_not_found')
    return
  }
  return batch.concentratedFeeds.map(({ period, feeds }, index) => {
    // UFL de la ration (en fonction du type d’animaux on ne prend pas la même colonne)* le pourcentage de ration
    const sumUF = Object.values(feeds).reduce((acc, curr) => {
      const UFcolumn =
        batch.profile.batch_type.UF_concentrated_value_considered != null
          ? batch.profile.batch_type.UF_concentrated_value_considered
          : 'UFL'

      const UF = curr.type.nutritional_values[UFcolumn] * curr.quantity
      return acc + UF
    }, 0.0)
    return fixFloatingPoint(sumUF, precision)
  })
}
// H249 UF apporté par les patures pour le final
const getUFPasturesByPeriod = (batch, period, totalAvailablePastureByPeriod, batchs) => {
  const p = getPasturesByPeriod('energeticTotal', batch, period, totalAvailablePastureByPeriod, batchs)
  return p
}
export const getFinalEnergeticCoverage = function (batch, simulation, periods, totalAvailablePastureByPeriod, getStic) {
  // c'est juste pour faire le test des différentes fonction
  const finalEnergeticCoverage = []

  const h272 = getUFConcentratedByPeriod(batch) // ok
  const h267 = getUFFeedsByPeriod(batch, true) // OK

  // for test
  const pasture_uf = []
  // par periode
  periods.forEach((period, index) => {
    const periodId = period.id
    const h249 = getUFPasturesByPeriod(batch, index, totalAvailablePastureByPeriod, simulation.herd.batchs)
    pasture_uf[index] = h249
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1
    // par period
    const aprpr = batch.profile.animal_profile_periods.find((element) => element.period_id === periodId)
    const ufl = aprpr.UFL
    // H274 = H272+H267+h249 UF total

    const h274 = fixFloatingPoint(h272[index] + h267[index] + h249, 12)
    const h234 = fixFloatingPoint(calculateEnergeticBesoin(ufl, toModerate, potential), 12)
    // H276 = H274 / H234 couverture UF
    const h276 = h274 / h234

    finalEnergeticCoverage[index] = _.round(h276 * 100)
  })
  return finalEnergeticCoverage
  // return { concentratedUF: h272, feedsUF: h267, pastureUF: pasture_uf, final_coverage: finalEnergeticCoverage }
}

// *******************************************************//
// ******************** LES PDI **************************//
// *******************************************************//
const getPDIPasturesByPeriod = (batch, period, totalAvailablePastureByPeriod, batchs) => {
  return getPasturesByPeriod('proteicTotal', batch, period, totalAvailablePastureByPeriod, batchs)
}
const getPDIByFeedTypeByPeriod = (batch, feedType) => {
  const precision = 6
  if (batch === undefined) {
    console.error('batch_not_found')
    return
  }

  return batch[feedType].map(({ period, feeds }, index) => {
    // UFL de la ration (en fonction du type d’animaux on ne prend pas la même colonne)* le pourcentage de ration
    const batchValuesForPeriod = batch.profile.animal_profile_periods[index]
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1
    const UEcolumn = batch.profile.batch_type.UE_value_considered

    const sumPDI = Object.values(feeds).reduce((acc, curr) => {
      let PDI = 0
      let quantity = 0
      if (curr.type.name !== 'Pâture') {
        if (feedType === 'concentratedFeeds') {
          quantity = curr.quantity
          PDI = curr.type.nutritional_values.PDI_inf * quantity
        } else {
          const besoinMS = calculateBesoinMS(batchValuesForPeriod.CI, toModerate, potential, UEcolumn, feeds) // ok
          PDI = (curr.proportion / 100) * besoinMS * curr.type.nutritional_values.PDI_inf
        }
      }
      return acc + PDI
    }, 0.0)
    return fixFloatingPoint(sumPDI, precision)
  })
}
export const getFinalProteicCoverage = function (batch, simulation, periods, totalAvailablePastureByPeriod, getStic) {
  // c'est juste pour faire le test des différentes fonction
  const finalProteicCoverage = []
  const pasturePdi = []

  const h272 = getPDIByFeedTypeByPeriod(batch, 'concentratedFeeds')
  const h267 = getPDIByFeedTypeByPeriod(batch, 'classicFeeds')

  // par periode
  periods.forEach((period, index) => {
    const periodId = period.id
    const h249 = getPDIPasturesByPeriod(batch, index, totalAvailablePastureByPeriod, simulation.herd.batchs)
    pasturePdi[index] = h249
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1
    // par period
    const aprpr = batch.profile.animal_profile_periods.find((element) => element.period_id === periodId)
    const pdi = aprpr.PDI
    // H274 = H272+H267+h249 UF total
    const h274 = fixFloatingPoint(h272[index] + h267[index] + h249, 12)
    const h234 = fixFloatingPoint(calculateProteicBesoin(pdi, toModerate, potential), 12)

    // H276 = H274 / H234 couverture UF
    const h276 = h274 / h234

    finalProteicCoverage[index] = _.round(h276 * 100)
  })
  return finalProteicCoverage
  // return { concentratedPDI: h272, pasturePDI: pasturePdi, feedsPDI: h267, final_coverage: finalProteicCoverage }
}

// *******************************************************//
// *************** stocks et couts ***********************//
// *******************************************************//

// D stock debut à déplacer directement dans le store c'est plus simple
export function getInitialStockByBarnStockItem(simulation, stockCode) {
  const stock = simulation.barn.initialStocks.find((item) => item.code === stockCode)
  return stock === undefined ? 0 : stock.quantity
}
// E production
export function getSticProductionByBarnStockItem(simulation, stockCode, periods, getStic) {
  // // SUM($calcul_interface.H52:T52) la somme de toutes les production des baguettes de même type par periode
  const prodTotal = Object.values(periods).reduce((acc, curr, index) => {
    return acc + getSticProductionByBarnStockItemByPeriod(simulation, stockCode, index)
  }, 0.0)
  return prodTotal
}
export function getPastureProductionTotal(simulation) {
  const prodTotal = Object.values(simulation.farm.totalAvailablePastureByPeriod).reduce((acc, curr) => {
    return acc + curr.production_total
  }, 0.0)

  return (prodTotal * DAYS_BY_PERIOD) / 1000
}
export function getConsumptionForOthers(simulation, periods, stockCode) {
  var consumption = 0
  simulation.herd.batchs.forEach((batch) => {
    var barnStockConsumptionByBatch = 0
    periods.forEach((p, i) => {
      const c = getBatchConsumption(batch, p.id, stockCode) * batch.housing.presence[i].animalCount
      barnStockConsumptionByBatch += c
    })
    consumption += (barnStockConsumptionByBatch * DAYS_BY_PERIOD) / 1000
  })
  const rt = consumption * (1 + simulation.barn.refusalRate / 100)
  return rt
}
export function getConsumptionForConcentrated(simulation, periods, stockCode) {
  var consumption = 0
  simulation.herd.batchs.forEach((batch) => {
    var barnStockConsumptionByBatch = 0
    periods.forEach((p, i) => {
      const c = getBatchConcentratedConsumption(batch, p.id, stockCode) * batch.housing.presence[i].animalCount
      barnStockConsumptionByBatch += c
    })
    consumption += barnStockConsumptionByBatch * DAYS_BY_PERIOD
  })
  const rt = consumption / 100
  return rt
}
export function getConsumptionForStraw(simulation, periods) {
  return (
    getConsumptionForOthers(simulation, periods, 'STRAW') + // conso aliment
    getConsumptionOfNonFoodStraw(simulation, periods)
  ) // conso logement
}
// F la somme consommation pour chaque type de baguettes groupé par grand type de production
export function getConsumptionByBarnStockItem(simulation, periods, stockCode) {
  switch (stockCode) {
    case 'RP':
    case 'RC':
      return getConsumptionForConcentrated(simulation, periods, stockCode)
    case 'STRAW':
      return getConsumptionForStraw(simulation, periods)
    default:
      return getConsumptionForOthers(simulation, periods, stockCode)
  }
}
export function getPastureConsumptionTotal(simulation, periods) {
  const batchs = simulation.herd.batchs
  let cons = 0
  batchs.forEach((batch) => {
    periods.forEach((p, i) => {
      cons +=
        getTotalPastureConsumption(batch, i, simulation.farm.totalAvailablePastureByPeriod, simulation.herd.batchs) *
        batch.housing.presence[i].animalCount
    })
  })
  return (cons * 28) / 1000
}
// G stock fin
export function getFinalStockByBarnStockItem(simulation, stockCode, periods, getStic) {
  if (stockCode === 'STRAW') {
    return simulation.barn.totalStrawStockProducted - getConsumptionForStraw(simulation, periods)
  }
  return (
    getInitialStockByBarnStockItem(simulation, stockCode) +
    getSticProductionByBarnStockItem(simulation, stockCode, periods, getStic) -
    getConsumptionByBarnStockItem(simulation, periods, stockCode)
  )
}
export function getPastureFinalStock(simulation, periods) {
  return getPastureProductionTotal(simulation) - getPastureConsumptionTotal(simulation, periods)
}
// H stock fin-debut
export function getFinalMinInitialStockByBarnStockItem(simulation, stockCode, periods, getStic) {
  return (
    getFinalStockByBarnStockItem(simulation, stockCode, periods, getStic) -
    getInitialStockByBarnStockItem(simulation, stockCode)
  )
}
export function getPastureFinalMinInitialStock(simulation, periods) {
  return getPastureFinalStock(simulation, periods)
}
// J achat
export function getPurchaseValueByBarnStockItem(simulation, stockCode, periods, getStic) {
  const h32 = getFinalMinInitialStockByBarnStockItem(simulation, stockCode, periods, getStic)
  return h32 < 0 ? -h32 : 0
}
export function getPasturePurchaseValue(simulation, periods) {
  const h32 = getPastureFinalMinInitialStock(simulation, periods)
  return h32 < 0 ? -h32 : 0
}
export const getBatchConcentratedConsumption = (batch, periodId, stockCode) => {
  // somme des consommation de chaque aliment
  const feedsForPeriod = batch.concentratedFeeds.find((item) => item.period.id === periodId).feeds
  const result = Object.values(feedsForPeriod).reduce((acc, curr) => {
    var calcul = 0
    if (curr.type.correspondingStock === stockCode) {
      calcul = curr.quantity
    }
    return acc + calcul
  }, 0.0)

  return result
}
// consommation des stock par lot, par period et par type de stock
export const getBatchConsumption = (batch, periodId, stockCode) => {
  // somme des consommation de chaque aliment
  const batchValuesForPeriod = batch.profile.animal_profile_periods.find((item) => item.period_id === periodId)
  const toModerate = batch.profile.batch_type.code === 'VL'
  const potential = 1
  const UEcolumn = batch.profile.batch_type.UE_value_considered
  const feedsForPeriod = batch.classicFeeds.find((item) => item.period.id === periodId).feeds
  const besoinMS = calculateBesoinMS(batchValuesForPeriod.CI, toModerate, potential, UEcolumn, feedsForPeriod)

  const result = Object.values(feedsForPeriod).reduce((acc, curr) => {
    var calcul = 0
    if (curr.type.correspondingStock === stockCode) {
      calcul = (curr.proportion / 100) * besoinMS
    }
    return acc + calcul
  }, 0.0)

  return result
}
// // Pour le graph des stocks
// export function getConcentratedConsumptionByBarnStockItemByPeriod(simulation, periodId, stockCode) {
//   var consumption = 0
//   simulation.herd.batchs.forEach((batch) => {
//     if (stockCode === 'RC' || stockCode === 'RP') {
//       consumption +=
//         getBatchConcentratedConsumption(batch, periodId, stockCode) *
//         batch.housing.presence[periodId - 1].animalCount *
//         DAYS_BY_PERIOD
//     }
//   })
//   return consumption / 100
// }
// Pour le graph des stocks
export function getConsumptionByBarnStockItemByPeriod(simulation, periodId, stockCode) {
  var consumption = 0
  simulation.herd.batchs.forEach((batch) => {
    consumption +=
      (getBatchConsumption(batch, periodId, stockCode) *
        batch.housing.presence[periodId - 1].animalCount *
        DAYS_BY_PERIOD) /
      1000
  })
  return consumption * (1 + simulation.barn.refusalRate / 100)
}
// conso paille non alim V676
export function getConsumptionOfNonFoodStraw(simulation, periods) {
  var consumption = 0
  periods.forEach((p, i) => {
    var c = 0
    simulation.herd.batchs.forEach((batch) => {
      const UEcolumn = batch.profile.batch_type.UE_value_considered
      const batchValuesForPeriod = batch.profile.animal_profile_periods[i]
      const feeds = batch.classicFeeds[i].feeds
      const toModerate = batch.profile.batch_type.code === 'VL'
      const potential = 1
      const besoinMS = calculateBesoinMS(batchValuesForPeriod.CI, toModerate, potential, UEcolumn, feeds) // ok

      const besoin = batch.housing.type ? batch.housing.type.straw_requirement : 0
      const presence = batch.housing.presence[i].days
      const nbAni = batch.housing.presence[i].animalCount
      const byBatch = (besoin * presence * besoinMS * nbAni) / 13
      c += byBatch
    })
    consumption += c
  })
  return consumption / 1000
}
export function getSticProductionByBarnStockItemByPeriod(simulation, stockCode, period) {
  // // SUM($calcul_interface.H52:T52) la somme de toutes les production des baguettes de même type par periode

  var quantity = 0
  if (simulation.barn.stockByPeriod[period] && simulation.barn.stockByPeriod[period].stock !== null) {
    const stock = simulation.barn.stockByPeriod[period].stock.find((item) => item.code === stockCode)
    quantity = stock === undefined ? 0 : stock.quantity
  }
  return quantity
}
export function getCostIndicator(data, periods, simulation, totalAvailablePastureByPeriod, stockCodeList, getStic) {
  const x55 = getSFP(simulation, getStic)
  const x647 = getUGBSystem(simulation, periods, stockCodeList, totalAvailablePastureByPeriod)
  const sauE6 = getSAU(simulation, getStic)

  let allAnimalsCountVL = 0
  let allAnimalsProductionVL = 0
  Object.values(simulation.herd.batchs).forEach((batch) => {
    if (batch.profile.batch_type.code === 'VL') {
      allAnimalsProductionVL += batch.profile.milk_product_kg * batch.count
      allAnimalsCountVL += batch.count
    }
  })

  // 1_fourrage
  // without
  let sommProd = 0
  let sommPature = 0
  // somme des prod
  let productions = 0
  //  F32 : conso pature
  let consoPature = 0

  // with
  // cout fourrage hors paille
  let o39 = 0
  let sommeAchat = 0
  let sommeVente = 0

  Object.values(data['1_fourrage']).forEach((item) => {
    o39 += item.total
    sommeAchat += item.purchase
    sommeVente += item.sale
    if (item.code === 'P') {
      consoPature += item.consommation
      sommPature += item.consommation * item.productionCost
    } else {
      productions += item.production
      sommProd += item.production * item.productionCost
    }
  })
  const coutprodtotal = sommProd + sommPature

  // 2_concentrated
  // without
  let sommeCulture = 0
  let sommeProdCulture = 0
  const haCultiveDenum = sauE6 - x55
  // with
  let o44 = 0

  Object.values(data['2_concentrated']).forEach((item) => {
    o44 += item.total
    sommeProdCulture += item.production
    sommeCulture += item.production * item.productionCost
  })

  // 3_straw
  // without
  // surface paille
  const y55 = getStrawSurface(simulation, getStic)
  const strawCoutProd = data['3_straw'][0].production * data['3_straw'][0].productionCost
  const o47 = Object.values(data['3_straw']).reduce((acc, curr) => acc + curr.total, 0.0)

  // 4_cost
  // with
  const o49 = o39 + o44

  const response = {
    '1_fourrage': {
      without: {
        haSFP: coutprodtotal / x55,
        tms: coutprodtotal / (productions + consoPature),
        ugb: coutprodtotal / x647,
        vl: coutprodtotal / allAnimalsCountVL,
        milleLitre: (coutprodtotal * 1000) / allAnimalsProductionVL,
      },
      with: {
        haSFP: o39 / x55,
        tms: o39 / (consoPature + productions + sommeAchat - sommeVente), // probleme
        ugb: o39 / x647,
        vl: o39 / allAnimalsCountVL,
        milleLitre: (o39 * 1000) / allAnimalsProductionVL, // probleme
      },
    },
    '2_concentrated': {
      without: {
        haCultive: sommeCulture / 10 / haCultiveDenum,
        tms: sommeCulture / 10 / sommeProdCulture,
        ugb: sommeCulture / x647,
      },
      with: {
        vl: o44 / allAnimalsCountVL,
        milleLitre: (o44 * 1000) / allAnimalsProductionVL,
        ugb: o44 / x647,
      },
    },
    '3_straw': {
      without: {
        ha: (strawCoutProd / 10) * y55,
        tms: strawCoutProd / 10,
        ugb: strawCoutProd / x647,
      },
      with: {
        vl: o47 / allAnimalsCountVL,
        milleLitre: (o47 * 1000) / allAnimalsProductionVL,
        ugb: o47 / x647,
      },
    },
    '4_cost': {
      with: {
        ugb: o49 / x647,
        milleLitre: (o49 * 1000) / allAnimalsProductionVL,
      },
    },
  }
  return response
}

export function getCostIndicatorsKpis(data) {
  const totalAlim = Object.values(data['1_fourrage']).reduce((acc, curr) => acc + curr.total, 0.0)
  const concentrates = Object.values(data['2_concentrated']).reduce((acc, curr) => acc + curr.total, 0.0)
  const totalCost = totalAlim + concentrates
  const concentratedPart = (concentrates / totalCost) * 100

  return {
    totalCost: totalCost,
    concentratedPart: concentratedPart,
  }
}

// *******************************************************//
// *************** Dimensionnement ***********************//
// *******************************************************//

// h647 Consommation totale hors concentrés par période et par lot
export const getTotalConsumptionExcludingConcentrates = function (
  period,
  batchs,
  totalAvailablePastureByPeriod,
  stockCodeList
) {
  return Object.values(batchs).reduce((acc, batch) => {
    const h248 = getTotalPastureConsumption(batch, period, totalAvailablePastureByPeriod, batchs)
    // Consommation stock (kg MS/animal/jour)
    const h266 = Object.values(stockCodeList).reduce((hi269, code) => {
      const calcul = getBatchConsumption(batch, period + 1, code)
      return hi269 + calcul
    }, 0.0)
    // Consommation stock (tMS)
    const h269 = (h266 * batch.housing.presence[period].animalCount * DAYS_BY_PERIOD) / 1000

    const calcul = (h248 * batch.housing.presence[period].animalCount * DAYS_BY_PERIOD) / 1000 + h269
    return acc + calcul
  }, 0.0)
}
// V647
export const getV647 = (batchs, periods, totalAvailablePastureByPeriod, stockCodeList) => {
  var v647 = 0
  periods.forEach((period, index) => {
    v647 += getTotalConsumptionExcludingConcentrates(index, batchs, totalAvailablePastureByPeriod, stockCodeList)
  })
  return v647
}
// surface de pature en fonction du code baguette
export const getRotationSurface = function (type, simulation, getStic) {
  return Object.values(simulation.farm.rotations).reduce((acc, curr) => {
    const stic = getStic(simulation.climaticYear, curr.name)
    var calcul = 0
    if (stic.type.startsWith(type)) {
      calcul = curr.surface
    }
    return acc + calcul
  }, 0.0)
}
// x55 SFP total surface pature ajouter toutes les surfaces qui contiennent un P dans leur code type baguette
export const getSFP = function (simulation, getStic) {
  return getRotationSurface('P', simulation, getStic)
}
// SAU
export const getSAU = function (simulation, getStic) {
  return getRotationSurface('', simulation, getStic)
}
// Total troupeau : nb animaux
export const getTotalHerd = function (batchs) {
  // la somme des lot de sum($LOT.C7(nb animaux) * (profil_ainmaux.age_mois si type=GEN sinon 12) / 12)
  const total = Object.values(batchs).reduce((acc, curr) => {
    const parsed = parseInt(curr.profile.age_mois)
    const profilAgeMois = !isNaN(parsed) ? parsed : 12
    const age_mois = curr.profile.batch_type.code === 'GEN' ? profilAgeMois : 12

    const calcul = curr.count * (age_mois / 12)

    return acc + calcul
  }, 0.0)
  return _.round(total, 0)
}
// UGB nourri par le système
export const getUGBSystem = function (simulation, periods, stockCodeList, totalAvailablePastureByPeriod) {
  return fixFloatingPoint(getV647(simulation.herd.batchs, periods, totalAvailablePastureByPeriod, stockCodeList) / UGB)
}
export const getHerdNeeds = function (periodIndex, batchs) {
  const needs = Object.values(batchs).reduce((acc, batch) => {
    const UEcolumn = batch.profile.batch_type.UE_value_considered
    const batchValuesForPeriod = batch.profile.animal_profile_periods[periodIndex]
    const feeds = batch.classicFeeds[periodIndex].feeds
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1
    const besoinMS = calculateBesoinMS(batchValuesForPeriod.CI, toModerate, potential, UEcolumn, feeds) // ok
    const calcul = (besoinMS * batch.housing.presence[periodIndex].animalCount * DAYS_BY_PERIOD) / 1000
    return acc + calcul
  }, 0.0)

  return needs
}
// UGB à nourrir objectif
export const getUGBtoFeed = function (simulation, periods) {
  // h646
  const batchs = simulation.herd.batchs
  return Object.values(periods).reduce((acc, period) => {
    const calcul = getHerdNeeds(period.id - 1, batchs) / UGB
    return acc + calcul
  }, 0.0)
}
// E6 Estimation chargement SAU
export const getEstimatedLivestockDensities = function (
  simulation,
  periods,
  totalAvailablePastureByPeriod,
  stockCodeList
) {
  const v647 = getV647(simulation.herd.batchs, periods, totalAvailablePastureByPeriod, stockCodeList) / UGB
  return v647 / simulation.farm.dimensioning.SAU
}
// E7 Chargement apparent
export const getApparentLivestockDensities = function (
  simulation,
  periods,
  getStic,
  stockCodeList,
  totalAvailablePastureByPeriod
) {
  const v647 = getV647(simulation.herd.batchs, periods, totalAvailablePastureByPeriod, stockCodeList) / UGB
  const x55 = getSFP(simulation, getStic)
  return v647 / x55
}
// E8 Chargement corrigé
export const getCorrectedLivestockDensities = function (
  simulation,
  periods,
  getStic,
  stockCodeList,
  totalAvailablePastureByPeriod
) {
  const x647 = getV647(simulation.herd.batchs, periods, totalAvailablePastureByPeriod, stockCodeList) / UGB
  const x55 = getSFP(simulation, getStic)

  var sumH = 0
  var sumJ = 0
  var sumL = 0
  stockCodeList.forEach((stock) => {
    const barnStockItemCode = stock
    sumH += getFinalMinInitialStockByBarnStockItem(simulation, barnStockItemCode, periods, getStic) // surplus
    sumJ += getPurchaseValueByBarnStockItem(simulation, barnStockItemCode, periods, getStic) // achat
    sumL += simulation.report.soldedStock[barnStockItemCode].sale // n'éxiste pas encore
  })

  return (x647 + (sumH - sumJ + sumL) / UGB) / x55
}
//  E9 Chargement potentiel Y648
export const getPotentialLivestockDensities = function (simulation, periods, getStic, stockCodeList) {
  const sfp = getSFP(simulation, getStic)
  let prodTotalWithPasture = 0
  stockCodeList.forEach((stockCode) => {
    const prod = getSticProductionByBarnStockItem(simulation, stockCode, periods, getStic)
    prodTotalWithPasture += prod
  })
  // ajouter la prod des patures
  const p = getPastureProductionTotal(simulation, periods, getStic)
  prodTotalWithPasture += p

  return prodTotalWithPasture / UGB / sfp
}
// autonomie et potentiel ...
export const getAutonomy = function (simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod) {
  // IF((E8-E7)>0,"Autonome","Pas autonome")
  const e8 = getCorrectedLivestockDensities(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod)
  const e7 = getApparentLivestockDensities(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod)
  return e8 - e7
}
// renvoie le pourcentage
export const getPotential = function (simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod) {
  // IF(E8/E9>=0.9,"au potentiel","pas au potentiel")
  // ROUND(100*$calcul_interface.Y651,0)
  // Y651 réalisaion du potenteil $Bilan.$E$8/$Y$648
  const e8 = getCorrectedLivestockDensities(simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod)
  const e9 = getPotentialLivestockDensities(simulation, periods, getStic, stockCodeList)
  return (e8 / e9) * 100
}
// Fourrages récoltés
export const getHarvestedFodder = (simulation, periods, getStic, stockCodeList, totalAvailablePastureByPeriod) => {
  const v647 = getV647(simulation.herd.batchs, periods, totalAvailablePastureByPeriod, stockCodeList) / UGB
  let prodTotal = 0
  stockCodeList.forEach((stockCode) => {
    prodTotal += getSticProductionByBarnStockItem(simulation, stockCode, periods, getStic)
  })

  return prodTotal / v647
}
// SFP/SAU
export const getSFP_SAU = (simulation, periods, getStic) => {
  const x55 = getSFP(simulation, getStic)
  const sau = getSAU(simulation, getStic)
  return (x55 * 100) / sau
}
// %PP/SAU
export const getPP_SAU = (simulation, periods, getStic) => {
  const surfacesPP = getRotationSurface('PP', simulation, getStic)
  const sau = getSAU(simulation, getStic)
  const d129 = surfacesPP / sau
  return d129 * 100
}
// %PT/SAU
export const getPT_SAU = (simulation, periods, getStic) => {
  const surfacesPT = getRotationSurface('PT', simulation, getStic)
  const sau = getSAU(simulation, getStic)
  const d130 = surfacesPT / sau
  return fixFloatingPoint(d130 * 100)
}

// *******************************************************//
// ****************** TRAVAIL ****************************//
// *******************************************************//
export const getRotationSurfaceHarvestedByPeriod = function (periodId, simulation, getStic) {
  return Object.values(simulation.farm.rotations).reduce((acc, curr) => {
    const stic = getStic(simulation.climaticYear, curr.name)
    var calcul = 0
    const sp = stic.stic_periods.find((item) => item.period_id === periodId)
    if (sp.farming_method !== '' && sp.farming_method !== 'P' && sp.production > 0) {
      calcul = curr.surface
    }
    return acc + calcul
  }, 0.0)
}
// 653 % de la perte par rapport à la production annuelle à la pâture 651*100/$U$28
export const getPastureSurplusesByPeriod = function (periodIndex, simulation, totalAvailablePastureByPeriod, periods) {
  const batchs = simulation.herd.batchs
  if (batchs.length <= 0 || Object.keys(totalAvailablePastureByPeriod).length <= 0) {
    return 0
  }
  const lastPriorityOrder = batchs[batchs.length - 1].priorityOrder
  const batch = {
    priorityOrder: lastPriorityOrder + 1,
    housing: {},
  }
  batch.housing.presence = Array.from(periods, (period) => ({
    period: period,
    animalCount: 0,
    days: 0,
  }))
  const patureReport = getAvailableCarryOverPastureByAnimal(batch, periodIndex, totalAvailablePastureByPeriod, batchs)
  const totalProdPasture = Object.values(totalAvailablePastureByPeriod).reduce((acc, curr) => {
    var calcul = curr.production_total
    return acc + calcul
  }, 0.0)

  if (totalProdPasture === 0) return 0

  const surplus = (patureReport / totalProdPasture) * 100

  // le retour doit être un pourcentage
  return surplus
}

// *******************************************************//
// ******************** HERD *****************************//
// *******************************************************//
export function getEnergeticCoverage(batch, totalAvailablePastureByPeriod) {
  const precision = 3
  const pastureUF = getUFPasturesByPeriodBefore(batch, totalAvailablePastureByPeriod, true)
  const feedsUF = getUFFeedsByPeriod(batch, false)

  const feedsByPeriod = batch.classicFeeds

  var energeticCoverage = feedsByPeriod.map(({ period, feeds }, index) => {
    const periodId = period.id
    const aprpr = batch.profile.animal_profile_periods.find((element) => element.period_id === periodId)

    var sumUF = pastureUF[index] + feedsUF[index]
    // if (withConcentrated) {
    //   sumUF += concentratedUF[index]
    // }
    const totalUE = calculateTotalUE(batch.profile.batch_type.UE_value_considered, feeds)

    const DEF = fixFloatingPoint(sumUF / totalUE, precision)

    if (batch.housing.presence[index]?.animalCount > 0) {
      var DERm = 0
      var nrj = 0
      // besoin UF (/animal/jour) UF par périod de la baguettes profil
      const UFL = aprpr.UFL

      // Capacité d'ingestion (UE/animal/j) CI par période de la baguette profil
      const CI = aprpr.CI

      // Modérateur : si batchType = VL on multiplie le résultat avec
      // %Fraction exprimée du potentiel de production de la vache laitière
      // pas saisie pour l'instant
      var ci_moderator = 1
      var toModerate = false
      if (batch.profile.batch_type.code === 'VL') {
        toModerate = true
        const potential = 1
        ci_moderator = 0.1582 * potential + 0.8392
      }
      // H234
      const besoin = calculateEnergeticBesoin(UFL, toModerate)

      if (CI > 0) {
        // H234 / H232
        DERm = fixFloatingPoint(besoin / (CI * ci_moderator), precision)
      }

      if (DERm > 0 && DEF > 0) {
        nrj = fixFloatingPoint(DEF / DERm, precision)
      }
      return _.round(nrj * 100)
    } else {
      return 0
    }
  })

  return energeticCoverage
}
export function getProteicCoverage(batch, totalAvailablePastureByPeriod) {
  const precision = 4

  const feedsByPeriod = batch.classicFeeds
  var proteicCoverage = feedsByPeriod.map(({ period, feeds }, index) => {
    const periodId = period.id
    const aprpr = batch.profile.animal_profile_periods.find((element) => element.period_id === periodId)

    //    H237= somme pour chaque ration :UFL de la ration (en fonction du type d’animaux on ne prend pas la même colonne)* le pourcentage de ration
    const sumPDI = Object.values(feeds).reduce((acc, curr) => {
      // si c'est des patures
      // on calcule l'UF pour l'ensemble des patures
      var PDI = 0
      if (curr.type.name === 'Pâture') {
        if (
          totalAvailablePastureByPeriod === null ||
          totalAvailablePastureByPeriod['period_id_' + periodId] === undefined
        ) {
          return
        }
        const proteicPasture = totalAvailablePastureByPeriod['period_id_' + periodId].proteicTotal
        // ce n'est que le numérateur de l'opération en dessous
        // somme(surface * production) * proportion
        PDI = proteicPasture * (curr.proportion / 100)
      } else {
        PDI = (curr.proportion / 100) * curr.type.nutritional_values.PDI_inf
      }
      return acc + PDI
    }, 0)
    const totalUE = Object.values(feeds).reduce((acc, curr) => {
      const UEcolumn = batch.profile.batch_type.UE_value_considered
      const UE = (curr.proportion / 100) * curr.type.nutritional_values[UEcolumn]
      return acc + UE
    }, 0)
    const DPF = fixFloatingPoint(sumPDI / totalUE, precision)
    //    H236: DERm :
    //  s’il n’y a pas d’animaux présent tu mets 0 sinon
    if (batch.housing.presence[index]?.animalCount > 0) {
      var DPRm = 0
      var prot = 0
      // besoin PDI (/animal/jour) UF par périod de la baguettes profil
      const PDI = aprpr.PDI

      // H232: Capacité d'ingestion (UE/animal/j) CI par période de la baguette profil
      const CI = aprpr.CI

      // Modérateur : si batchType = VL on multiplie le résultat avec
      // %Fraction exprimée du potentiel de production de la vache laitière
      // pas saisie pour l'instant
      var ci_moderator = 1
      var toModerate = false
      if (batch.profile.batch_type.code === 'VL') {
        toModerate = true
        const potential = 1
        ci_moderator = 0.1582 * potential + 0.8392
      }
      const besoin = calculateProteicBesoin(PDI, toModerate)

      // H234 / H232
      if (CI > 0) {
        DPRm = _.round(besoin / (CI * ci_moderator), 2)
      }
      if (DPRm > 0 && DPF > 0) {
        prot = DPF / DPRm
      }
      return _.round(prot * 100) // floor
    } else {
      return 0
    }
  })

  return proteicCoverage
}
export function getDryMatterProvided(batch, referential) {
  const precision = 3

  const UEcolumn = batch.profile.batch_type.UE_value_considered
  const UFcolumn = batch.profile.batch_type.UF_value_considered
  var dryMatterProvidedPerFeed = {
    P: { name: 'Pâture', code: 'P', color: '#27AE60', data: Array.from({ length: 13 }, () => 0) },
  }
  referential.barnStockItems.forEach((item) => {
    if (item.code !== 'RC' && item.code !== 'RP') {
      dryMatterProvidedPerFeed[item.code] = {
        name: item.name,
        code: item.code,
        data: Array.from({ length: 13 }, () => 0),
      }
    }
  })
  referential.periods.forEach((period, index) => {
    // la quantité de matière sèche de chaque aliment
    const batchValuesForPeriod = batch.profile.animal_profile_periods[index]
    const feeds = batch.classicFeeds[index].feeds
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1
    const besoinMS = calculateBesoinMS(batchValuesForPeriod.CI, toModerate, potential, UEcolumn, feeds) // ok
    feeds.forEach((feed) => {
      if (feed.type.correspondingStock !== 'RC' && feed.type.correspondingStock !== 'RP') {
        const q = fixFloatingPoint((feed.proportion / 100) * besoinMS, precision)
        if (dryMatterProvidedPerFeed[feed.type.correspondingStock].data[index] > 0) {
          dryMatterProvidedPerFeed[feed.type.correspondingStock].data[index] += q
        } else {
          dryMatterProvidedPerFeed[feed.type.correspondingStock].data[index] = q
        }
      }
    })
  })
  return dryMatterProvidedPerFeed
}
export function getDryMatterNeeded(batch, periods, batchId) {
  const precision = 3

  const UEcolumn = batch.profile.batch_type.UE_value_considered
  const UFcolumn = batch.profile.batch_type.UF_value_considered

  var dryMatterNeeded = []
  periods.forEach((period, index) => {
    const batchValuesForPeriod = batch.profile.animal_profile_periods[index]
    const feeds = batch.classicFeeds[index].feeds
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1
    const besoinMS = calculateBesoinMS(batchValuesForPeriod.CI, toModerate, potential, UEcolumn, feeds) // ok
    dryMatterNeeded[index] = fixFloatingPoint(besoinMS, precision)
  })
  return dryMatterNeeded
}

// *******************************************************//
// ******************** FARM *****************************//
// *******************************************************//
export function setTotalStrawStock(simulation, getStic) {
  let totalStrawStock = 0
  simulation.farm.rotations.forEach((rotation) => {
    const stic = getStic(simulation.climaticYear, rotation.name)
    // le stock de paille produit en kg car rendement en kg/ha et surface en ha
    if (stic.rendement) {
      totalStrawStock += stic.rendement * rotation.surface
    }
  })
  return totalStrawStock / 1000
}
// straw surface
export function getStrawSurface(simulation, getStic) {
  let totalSurface = 0
  simulation.farm.rotations.forEach((rotation) => {
    const stic = getStic(simulation.climaticYear, rotation.name)
    // le stock de paille produit en kg car rendement en kg/ha et surface en ha
    if (stic.rendement) {
      totalSurface += rotation.surface
    }
  })
  return totalSurface
}
export function dispatchProductionByPeriod(rotations, referential, simulation, getStic) {
  // production:
  // pour les patures : kgMS/ha/j
  // pour les récoltes stock : tMS/ha
  // pour recoltes grain : qtx/ha

  var barnStockByPeriod = []
  const precision = 15
  const barnStockItems = referential.barnStockItems
  referential.periods.forEach((p, index) => {
    if (!barnStockByPeriod[index]) {
      // la period n'existe pas
      barnStockByPeriod.push({
        period_id: p.id,
        stock: [],
      })
    }
    rotations.forEach((rotation, i) => {
      const stic = getStic(simulation.climaticYear, rotation.name)
      const sp = stic.stic_periods.find((item) => item.period_id === index + 1)
      if (sp.farming_method !== '' && sp.farming_method !== 'P' && sp.production > 0) {
        const foundStock = barnStockByPeriod[index].stock.findIndex((item) => item.code === sp.farming_method)
        // UN STOCK EST IL DÉJÀ CONSTITUÉ?
        if (foundStock < 0) {
          // non, créer le stock avec la nouvelle q
          // je crée le stock pour la period
          barnStockByPeriod[index].stock.push({
            ...barnStockItems.find((item) => item.code === sp.farming_method),
            quantity: fixFloatingPoint(sp.production * rotation.surface, 4),
          })
        } else {
          // oui ajouter la production au stock
          barnStockByPeriod[index].stock[foundStock].quantity += sp.production * rotation.surface
        }
      }
    })
  })
  return barnStockByPeriod
}
