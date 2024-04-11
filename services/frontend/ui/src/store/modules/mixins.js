import _ from 'lodash'

const fixFloatingPoint = (val, precision = 3) => Number.parseFloat(val.toPrecision(precision))

const calculateEnergeticBesoin = (ufl, toModerate = false, potential = 1) => {
  var moderator = 1
  if (toModerate) {
    moderator = 0.5367 * potential + 0.4582
  }
  return ufl * moderator
}
const calculateProteicBesoin = (pdi, toModerate = false, potential = 1) => {
  var moderator = 1
  if (toModerate) {
    moderator = 0.6431 * potential + 0.3522
  }
  return pdi * moderator
}
// H272
const calculateConcentratedUF = (batch) => {
  const precision = 4
  const concentratedFeedsByPeriod = batch.concentratedFeeds
  var sum = concentratedFeedsByPeriod.map(({ period, feeds }, index) => {
    const periodId = period.id
    // UFL de la ration (en fonction du type d’animaux on ne prend pas la même colonne)* le pourcentage de ration
    const sumUF = Object.values(feeds).reduce((acc, curr) => {
      const UFcolumn = batch.profil.batch_type.UF_concentrated_value_considered

      const UF = curr.type.nutritional_values[UFcolumn] * curr.quantity
      // console.log('UFL : %d - Quantity : %d - UF: %d', curr.type.nutritional_values[UFcolumn], curr.quantity, UF)
      return acc + UF
    }, 0.0)
    // console.log('period %d - sumUF: %d', periodId, fixFloatingPoint(sumUF, precision))
    return fixFloatingPoint(sumUF, precision)
  })
  return sum
}

const deepEqual = (obj1, obj2) => {
  // Si les deux objets sont du même type, on les compare
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    // On vérifie si les deux objets ont le même nombre de propriétés
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
      return false
    }
    // On compare récursivement les valeurs de chaque propriété
    for (const key of keys1) {
      if (!deepEqual(obj1[key], obj2[key])) {
        return false
      }
    }
    return true
  } else {
    // Si les objets sont de types différents, on les compare directement
    return obj1 === obj2
  }
}

export default {
  deepEqual: function (obj1, obj2) {
    // Si les deux objets sont du même type, on les compare
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      // On vérifie si les deux objets ont le même nombre de propriétés
      const keys1 = Object.keys(obj1)
      const keys2 = Object.keys(obj2)
      if (keys1.length !== keys2.length) {
        return false
      }
      // On compare récursivement les valeurs de chaque propriété
      for (const key of keys1) {
        if (!deepEqual(obj1[key], obj2[key])) {
          return false
        }
      }
      return true
    } else {
      // Si les objets sont de types différents, on les compare directement
      return obj1 === obj2
    }
  },
  getConcentratedUfSum: function (state, batchId) {
    const batch = state.batchs[batchId]
    if (batch === undefined) {
      console.error('batch_not_found', batchId)
      return
    }
    return calculateConcentratedUF(batch)
  },
  getEnergeticCoverage: function (state, rootState, batchId, withConcentrated = false) {
    const precision = 3
    const batch = state.batchs[batchId]
    if (batch === undefined) {
      console.error('batch_not_found', batchId)
      return
    }
    const feedsByPeriod = batch.classicFeeds

    var energeticCoverage = feedsByPeriod.map(({ period, feeds }, index) => {
      const periodId = period.id
      const aprpr = batch.profil.animal_profil_periods.find((element) => element.period_id === periodId)
      // UFL de la ration (en fonction du type d’animaux on ne prend pas la même colonne)* le pourcentage de ration
      const sumUF = Object.values(feeds).reduce((acc, curr) => {
        const UFcolumn = batch.profil.batch_type.UF_value_considered
        // si c'est des patures
        // on calcule l'UF pour l'ensemble des patures
        var DEF = 0
        if (curr.type.name === 'Pâture') {
          // ajout des patures
          if (rootState.simulator.farm.totalAvailablePastureByPeriod['period_id_' + periodId] === undefined) {
            console.error('farm dimensionning is not apply to the simulation')
            return
          }
          const energyPasture =
            rootState.simulator.farm.totalAvailablePastureByPeriod['period_id_' + periodId].energeticTotal
          DEF = energyPasture * (curr.proportion / 100)
        } else {
          // ajout des rations
          DEF = (curr.proportion / 100) * curr.type.nutritional_values[UFcolumn]
        }

        return acc + DEF
      }, 0.0)
      const totalUE = Object.values(feeds).reduce((acc, curr) => {
        const UEcolumn = batch.profil.batch_type.UE_value_considered
        const DEF = (curr.proportion / 100) * curr.type.nutritional_values[UEcolumn]
        return acc + DEF
      }, 0.0)

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
        if (batch.profil.batch_type.code === 'VL') {
          toModerate = true
          const potential = 1
          ci_moderator = 0.1582 * potential + 0.8392
        }

        const besoin = calculateEnergeticBesoin(UFL, toModerate)

        if (CI > 0) {
          DERm = fixFloatingPoint(besoin / (CI * ci_moderator), precision)
        }

        if (DERm > 0 && DEF > 0) {
          nrj = fixFloatingPoint(DEF / DERm, precision)
        }
        // console.log(
        //   ' NRJ period %d - DEF: %d - besoin FU : %d- ci : %d, DERm: %d - nrj: %d',
        //   periodId,
        //   DEF,
        //   UFL * pdi_moderator,
        //   CI * ci_moderator,
        //   DERm,
        //   nrj
        // )
        return _.round(nrj * 100)
      } else {
        return 0
      }
    })

    return energeticCoverage
  },
  getProteicCoverage: function (state, rootState, batchId, withConcentrated = false) {
    const batch = state.batchs[batchId]
    const precision = 4
    if (batch === undefined) {
      console.error('batch_not_found', batchId)
      return
    }
    const feedsByPeriod = batch.classicFeeds
    // console.log('getEC profil', batch.profil)
    var proteicCoverage = feedsByPeriod.map(({ period, feeds }, index) => {
      const periodId = period.id
      const aprpr = batch.profil.animal_profil_periods.find((element) => element.period_id === periodId)

      //    H237= somme pour chaque ration :UFL de la ration (en fonction du type d’animaux on ne prend pas la même colonne)* le pourcentage de ration
      const sumPDI = Object.values(feeds).reduce((acc, curr) => {
        // si c'est des patures
        // on calcule l'UF pour l'ensemble des patures
        var PDI = 0
        if (curr.type.name === 'Pâture') {
          if (rootState.simulator.farm.totalAvailablePastureByPeriod['period_id_' + periodId] === undefined) {
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
        const UEcolumn = batch.profil.batch_type.UE_value_considered
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
        if (batch.profil.batch_type.code === 'VL') {
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
        // console.log(
        //   ' PROT period %d - DPF: %d - besoin FU : %d- DPRm: %d - prot: %d',
        //   periodId,
        //   DPF,
        //   PDI * pdi_moderator,
        //   DPRm,
        //   prot * 100
        // )
        return _.round(prot * 100) // floor
      } else {
        return 0
      }
    })

    return proteicCoverage
  },
  setTotalAvailablePasture: (state, rootState) => {
    const precision = 15
    const totalAvailablePastureByPeriod = {}
    rootState.simulator.periods.forEach((period) => {
      const key = 'period_id_' + period.id

      const total = Object.values(state.rotations).reduce((total, rotation) => {
        const sp = rotation.stic.stic_periods.find((el) => el.period_id === period.id)
        var calcul = 0
        if (sp.farming_method === 'P' && sp.production > 0) {
          calcul = fixFloatingPoint(sp.production * rotation.surface, precision)
        }
        return total + calcul
      }, 0) // ok

      const UF = Object.values(state.rotations).reduce((uf, rotation) => {
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
        production_total: total,
        energeticTotal: UF,
        proteicTotal: PDI,
      }
    })

    return totalAvailablePastureByPeriod
  },
  dispatchProduction: (state, rootState, commit) => {
    const barnStock = []
    const precision = 15
    const barnStockItems = rootState.simulator.barnStockItems
    for (let index = 0; index < rootState.simulator.periods.length; index++) {
      console.log(index)
      for (const rotation of state.rotations) {
        const sp = rotation.stic.stic_periods[index]
        console.log(sp)
        if (sp.farming_method !== '' && sp.production > 0) {
          const foundStock = barnStock.find((item) => item.code === sp.farming_method)
          if (!foundStock) {
            barnStock.push({
              ...barnStockItems.find((item) => item.code === sp.farming_method),
              ...{ code: sp.farming_method, quantity: sp.production },
            })
          } else {
            foundStock.quantity.tons += sp.production
          }
        }
      }
    }
    return []
  },
}
