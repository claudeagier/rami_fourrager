import _ from 'lodash'

export const fixFloatingPoint = (val, precision = 3) => Number.parseFloat(val.toPrecision(precision))

// OK
const calculateTotalUE = (UEcolumn, feeds) => {
  const precision = 4

  const totalProportion = Object.values(feeds).reduce((acc, curr) => {
    return fixFloatingPoint(acc + curr.proportion / 100, 15)
  }, 0.0)
  if (totalProportion < 1) {
    return 1
  }

  const val = Object.values(feeds).reduce((acc, curr) => {
    var DEF = 0
    if (curr.proportion > 0 && curr.type.nutritional_values[UEcolumn]) {
      DEF = fixFloatingPoint((curr.proportion / 100) * curr.type.nutritional_values[UEcolumn], precision)
    }
    return acc + DEF
  }, 0.0)
  return val > 0 ? val : 1
}

// H233 besoin MS OK
const calculateBesoinMS = (ci = 1, toModerate = false, potential = 1, ueColumn, feeds) => {
  // pourquoi est il fonction de totalUE des rations, le besoins de la vache devrait être indépendant.?
  // réponse le besoin en matière sèche dépend des valeurs nutritives des aliments apportés aliments apportés

  var moderator = 1
  if (toModerate) {
    moderator = 0.1582 * potential + 0.8392
  }
  const moderatedCI = ci * moderator
  return fixFloatingPoint(moderatedCI / calculateTotalUE(ueColumn, feeds), 4)
}
// H234 OK
const calculateEnergeticBesoin = (ufl, toModerate = false, potential = 1) => {
  var moderator = 1
  if (toModerate) {
    moderator = 0.5367 * potential + 0.4582
  }
  return ufl * moderator
}
// H235 OK
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
export const setTotalAvailablePasture = (state, rootState) => {
  const precision = 15
  const totalAvailablePastureByPeriod = {}
  rootState.referential.periods.forEach((period) => {
    if (state.rotations !== undefined && state.rotations.length > 0) {
      const key = 'period_id_' + period.id
      const total = Object.values(state.rotations).reduce((total, rotation) => {
        // find stic in sticList
        const sp = rotation.stic.stic_periods.find((el) => el.period_id === period.id)
        var calcul = 0
        if (sp.farming_method === 'P' && sp.production > 0) {
          calcul = fixFloatingPoint(sp.production * rotation.surface, precision)
        }
        return total + calcul
      }, 0) // ok
      const UF = Object.values(state.rotations).reduce((uf, rotation) => {
        // find stic in sticList
        const sp = rotation.stic.stic_periods.find((el) => el.period_id === period.id)
        var num = 0
        if (sp.farming_method === 'P' && sp.production > 0) {
          num = fixFloatingPoint(
            ((sp.production * rotation.surface) / total) * rotation.stic.pasture_type.nutritional_values.UFL,
            precision
          )
        }
        return uf + num
      }, 0.0)

      const PDI = Object.values(state.rotations).reduce((pdi, rotation) => {
        // find stic in sticList
        const sp = rotation.stic.stic_periods.find((el) => el.period_id === period.id)
        if (sp.farming_method === 'P' && sp.production > 0) {
          const calcul = sp.production * rotation.surface
          const num = fixFloatingPoint(
            (calcul / total) * rotation.stic.pasture_type.nutritional_values.PDI_inf,
            precision
          )
          return pdi + num
        }
        return pdi
      }, 0.0)
      totalAvailablePastureByPeriod[key] = {
        production_total: total, // H28
        energeticTotal: UF, // W29
        proteicTotal: PDI, // W30
      }
    }
  })

  return totalAvailablePastureByPeriod
}
export const getAvailableGreenPasture = (state, rootState, batchId) => {
  const availablePasture = []
  const batch = state.batchs[batchId]
  const tap = rootState.simulator.farm.totalAvailablePastureByPeriod
  rootState.referential.periods.forEach((period, index) => {
    availablePasture[index] = _.round(getAvailableGreenPastureByAnimal(batch, index, tap, state.batchs))
  })
  return availablePasture
}
// 240 Pâture verte disponible (kg MS/animal/jour ou kgMS/jour si nb anx=0) les valeurs à afficher dans la simu OK
const getAvailableGreenPastureByAnimal = (batch, period, totalAvailablePastureByPeriod, batchs) => {
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
// c'est un global, il faut rendre ce calcule indépendant
// problème de récursion car appel en boucle entre getGreenPastureConsumption par l'intermédiaire de 244 et getExcessPastureAfterBatchesPassed
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

// 241 Consommation pâture prévue par la ration (kgMS/animal/j) OK
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
// 242 Consommation max pâture "verte" OK
export const getMaxConsumptionGreenPasture = (batch, period, totalAvailablePastureByPeriod, batchs) => {
  // le plus petit entre 240 et 241
  const h240 = getAvailableGreenPastureByAnimal(batch, period, totalAvailablePastureByPeriod, batchs)
  const h241 = getPastureConsumptionPlannedByClassicFeed(batch, period)
  const val = [h240, h241]
  return _.min(val)
}
// 243 Pâture reportée disponible (kgMS/animal Lot1/j) les valeurs à afficher dans la simu
// attention pour le lot 1 uniquement
// une fois que tous les lots ont mangé il en reste
export const getAvailableCarryOverPastureByAnimal = (batch, period, totalAvailablePastureByPeriod, batchs) => {
  // pour le lot1
  // h650 / nombre d'animaux pour la période du lot
  // h650 : excès pâture après passage des lots (kgMS/jour) de la période précédente

  const priority = batch.priorityOrder
  const nbAnimals = batch.housing.presence[period].animalCount === 0 ? 1 : batch.housing.presence[period].animalCount
  if (priority === 0) {
    // youpi c'est le premier lot à nourrire
    var excess = 0
    if (period > 0) {
      const h650 = getExcessPastureAfterBatchesPassed(batchs, totalAvailablePastureByPeriod, period - 1)

      excess = fixFloatingPoint(h650 / nbAnimals, 3)
    }
    return excess
  } else {
    // pour le lot 2
    // =(I243-I247)*IF($LOT1.I7=0;1;$LOT1.I7)/IF($LOT2.I7=0;1;$LOT2.I7)
    // il y a d'autre lot à nourrire en premier
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
    result = _.min([h242, h241 - h244])
  } else {
    result = h242
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
    return getAllPastureMaxConsumption(batch, period, totalAvailablePastureByPeriod, batchs)
  } else {
    // MIN(I244;I241-I242)
    const i244 = getAllPastureMaxConsumption(batch, period, totalAvailablePastureByPeriod, batchs)
    const i241 = getPastureConsumptionPlannedByClassicFeed(batch, period)
    const i242 = getMaxConsumptionGreenPasture(batch, period, totalAvailablePastureByPeriod, batchs)

    const val = [i244, i241 - i242]
    return _.min(val)
  }
}
export const getPasturesByPeriod = (coverage, batch, period, totalAvailablePastureByPeriod, batchs) => {
  const precision = 3
  if (batch === undefined) {
    console.error('batch_not_found')
    return
  }
  const i246 = getGreenPastureConsumption(batch, period, totalAvailablePastureByPeriod, batchs)
  const i247 = getCarryOverPastureConsumption(batch, period, totalAvailablePastureByPeriod, batchs)

  // =I$246*X29+I$247*W29*0,92
  // (consommation pature verte * x 29 correspondant à la période) + (consommation pature reporté si report * w29 correspondant à la période précédente* 0.92)
  // x29 = totalAvailablePasture[period].energeticTotal
  // w29 = totalAvailablePasture[period-1].energeticTotal
  var previous = 0
  if (period > 0) {
    previous = i247 * totalAvailablePastureByPeriod['period_id_' + period][coverage] * 0.92
  }

  return i246 * totalAvailablePastureByPeriod['period_id_' + (period + 1)][coverage] + previous
}

// *******************************************************//
// ********************** LES UF *************************//
// *******************************************************//

// H267 ~ OK à préciser si nécessaire
const getUFFeedsByPeriod = (batch, after = false) => {
  const precision = 3
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
          UF = fixFloatingPoint((curr.proportion / 100) * besoinMS * curr.type.nutritional_values[UFcolumn], precision)
        } else {
          UF = fixFloatingPoint((curr.proportion / 100) * curr.type.nutritional_values[UFcolumn], precision)
        }
      }
      return acc + UF
    }, 0.0)
    return sumUF
  })
}
// uniquement pour energeticCoverage OK
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
          console.error('farm dimensionning is not apply to the simulation')
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
// 272 uf apporté par les concentrés pour finalEnergeticCoverage OK
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
  return getPasturesByPeriod('energeticTotal', batch, period, totalAvailablePastureByPeriod, batchs)
}
export const getFinalEnergeticCoverage = function (state, rootState, batchId) {
  // c'est juste pour faire le test des différentes fonction
  const finalEnergeticCoverage = []
  const batch = state.batchs[batchId]
  if (batch === undefined) {
    console.error('batch_not_found', batchId)
    return
  }
  const h272 = getUFConcentratedByPeriod(batch) // ok
  const h267 = getUFFeedsByPeriod(batch, true) // OK
  const totalAvailablePastureByPeriod = setTotalAvailablePasture(rootState.simulator.farm, rootState)

  // for test
  const pasture_uf = []
  // par periode
  rootState.referential.periods.forEach((period, index) => {
    const periodId = period.id
    const h249 = getUFPasturesByPeriod(batch, index, totalAvailablePastureByPeriod, rootState.simulator.herd.batchs)
    pasture_uf[index] = h249
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1
    // par period
    const aprpr = batch.profile.animal_profile_periods.find((element) => element.period_id === periodId)
    const ufl = aprpr.UFL
    // H274 = H272+H267+h249 UF total
    const h274 = h272[index] + h267[index] + h249
    const h234 = calculateEnergeticBesoin(ufl, toModerate, potential)

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
  const precision = 4
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
          PDI = fixFloatingPoint((curr.proportion / 100) * besoinMS * curr.type.nutritional_values.PDI_inf, precision)
        }
      }
      return acc + PDI
    }, 0.0)
    return fixFloatingPoint(sumPDI, precision)
  })
}
export const getFinalProteicCoverage = function (state, rootState, batchId) {
  // c'est juste pour faire le test des différentes fonction
  const finalProteicCoverage = []
  const batch = state.batchs[batchId]
  const pasturePdi = []
  if (batch === undefined) {
    console.error('batch_not_found', batchId)
    return
  }
  const h272 = getPDIByFeedTypeByPeriod(batch, 'concentratedFeeds')
  const h267 = getPDIByFeedTypeByPeriod(batch, 'classicFeeds')
  const totalAvailablePastureByPeriod = setTotalAvailablePasture(rootState.simulator.farm, rootState)

  // par periode
  rootState.referential.periods.forEach((period, index) => {
    const periodId = period.id
    const h249 = getPDIPasturesByPeriod(batch, index, totalAvailablePastureByPeriod, rootState.simulator.herd.batchs)
    pasturePdi[index] = h249
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1
    // par period
    const aprpr = batch.profile.animal_profile_periods.find((element) => element.period_id === periodId)
    const pdi = aprpr.PDI
    // H274 = H272+H267+h249 UF total
    const h274 = h272[index] + h267[index] + h249
    const h234 = calculateProteicBesoin(pdi, toModerate, potential)

    // H276 = H274 / H234 couverture UF
    const h276 = h274 / h234

    finalProteicCoverage[index] = _.round(h276 * 100)
  })
  return finalProteicCoverage
  // return { concentratedPDI: h272, pasturePDI: pasturePdi, feedsPDI: h267, final_coverage: finalProteicCoverage }
}
export function getEnergeticCoverage(state, rootState, batchId) {
  const precision = 3
  const batch = state.batchs[batchId]
  if (batch === undefined) {
    console.error('batch_not_found', batchId)
    return
  }
  const pastureUF = getUFPasturesByPeriodBefore(batch, rootState.simulator.farm.totalAvailablePastureByPeriod, true)
  const feedsUF = getUFFeedsByPeriod(batch, false)
  // const concentratedUF = getUFConcentratedByPeriod(batch)

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
export function getProteicCoverage(state, rootState, batchId) {
  const batch = state.batchs[batchId]
  const precision = 4
  if (batch === undefined) {
    console.error('batch_not_found', batchId)
    return
  }
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
          rootState.simulator.farm.totalAvailablePastureByPeriod === null ||
          rootState.simulator.farm.totalAvailablePastureByPeriod['period_id_' + periodId] === undefined
        ) {
          console.error('farm dimensionning is not apply to the simulation')
          return
        }
        const proteicPasture =
          rootState.simulator.farm.totalAvailablePastureByPeriod['period_id_' + periodId].proteicTotal
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
export function dispatchProduction(state, rootState) {
  var totalBarnStock = []
  var barnStockByPeriod = Array.from({ length: 13 }, () => null)
  const precision = 15
  const barnStockItems = rootState.referential.barnStockItems
  for (let index = 0; index < rootState.referential.periods.length; index++) {
    for (const rotation of state.rotations) {
      // find stic in sticList
      const sp = rotation.stic.stic_periods[index]
      if (sp.farming_method !== '' && sp.production > 0) {
        // répartition du stock au global
        const foundTotalStock = totalBarnStock.find((item) => item.code === sp.farming_method)
        if (!foundTotalStock) {
          const selectedStock = barnStockItems.find((item) => item.code === sp.farming_method)
          if (!selectedStock) {
            // break
          }
          const stock = {
            ...selectedStock,
            quantity: fixFloatingPoint(sp.production, 4),
          }
          totalBarnStock.push(stock)
        } else {
          foundTotalStock.quantity += sp.production
        }

        // repartition du stock par période
        const barnStockPeriod = barnStockByPeriod[index]
        if (barnStockPeriod === null) {
          const stockByPeriod = {
            period_id: rootState.referential.periods[index].id,
            stock: [
              {
                ...barnStockItems.find((item) => item.code === sp.farming_method),
                quantity: fixFloatingPoint(sp.production, 4),
              },
            ],
          }
          barnStockByPeriod[index] = stockByPeriod
        } else {
          const foundStock = barnStockPeriod.stock.find((item) => item.code === sp.farming_method)
          if (foundStock) {
            foundStock.quantity += sp.production
          } else {
            barnStockPeriod.stock.push({
              ...barnStockItems.find((item) => item.code === sp.farming_method),
              quantity: fixFloatingPoint(sp.production, 4),
            })
          }
        }
      }
    }
  }
  return { totalBarnStock: totalBarnStock, barnStockByPeriod: barnStockByPeriod }
}
export function getDryMatterProvided(state, rootState, batchId) {
  const precision = 3
  const batch = state.batchs[batchId]
  if (batch === undefined) {
    console.error('batch_not_found', batchId)
    return
  }

  const UEcolumn = batch.profile.batch_type.UE_value_considered
  const UFcolumn = batch.profile.batch_type.UF_value_considered

  // const finalEnergeticCoverage = getFinalEnergeticCoverage(state, rootState, batchId).final_coverage
  // var totalEnergeticCoverage = { name: 'totalEnergeticCoverage', data: finalEnergeticCoverage }
  // const finalProteicCoverage = getFinalProteicCoverage(state, rootState, batchId)
  // var totalProteicCoverage = { name: 'totalProteicCoverage', data: finalProteicCoverage }

  var dryMatterProvidedPerFeed = {
    P: { name: 'Pâture', code: 'P', color: '#27AE60', data: Array.from({ length: 13 }, () => 0) },
  }
  rootState.referential.barnStockItems.forEach((item) => {
    if (item.code !== 'RC' && item.code !== 'RP') {
      dryMatterProvidedPerFeed[item.code] = {
        name: item.name,
        code: item.code,
        data: Array.from({ length: 13 }, () => 0),
      }
    }
  })

  var dryMatterNeeded = { name: 'dryMatterNeeded', data: [] }

  rootState.referential.periods.forEach((period, index) => {
    // la quantité de matière sèche de chaque aliment
    const batchValuesForPeriod = batch.profile.animal_profile_periods[index]
    const feeds = batch.classicFeeds[index].feeds
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1
    const besoinMS = calculateBesoinMS(batchValuesForPeriod.CI, toModerate, potential, UEcolumn, feeds) // ok
    dryMatterNeeded.data[index] = _.floor(besoinMS, 1)

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

    // une série par aliment
    // + une série pour les besoins MS
  })
  return {
    dry_matter_provided_per_feed: dryMatterProvidedPerFeed,
    dry_matter_needed: dryMatterNeeded,
    // total_energetic_coverage: totalEnergeticCoverage,
    // "totalProteicCoverage": totalProteicCoverage
  }
}
