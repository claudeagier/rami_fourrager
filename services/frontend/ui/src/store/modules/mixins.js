import _ from 'lodash'

const fixFloatingPoint = (val, precision = 3) => Number.parseFloat(val.toPrecision(precision))

// ok
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
// H233 besoin MS
// pourquoi est il fonction de totalUE des rations, le besoins de la vache devrait être indépendant.?
// réponse le besoin en matière sèche dépend des valeurs nutritives des aliments apportés aliments apportés
// ok
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

// uniquement pour energeticCoverage
// ok
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

// 240 Pâture verte disponible (kg MS/animal/jour ou kgMS/jour si nb anx=0) les valeurs à afficher dans la simu
const getAvailableGreenPastureByAnimal = (batch) => {
  // pature disponible / nombre d'animaux pour la période du lot
  // il faut prendre en compte tous les lots
  // le modele nourri en premier le premier lot et ensuite les autres s'il reste des patures
  // production total des patures / nb animaux total de tous les lots
  // onmultiplie par le nombre d'animaux par lot,
  // le problème c'est que chaque lot est nourri équitablement
}

// 243 Pâture reportée disponible (kgMS/animal Lot1/j) les valeurs à afficher dans la simu
const getAvailableCarryOverPastureByAnimal = (batch) => {}

// H249 uf apporté par les patures
// il faut intégrer la stratégie de report
// =I$246*X29+I$247*W29*0,92
const getUFPasturesByPeriod = (batch, totalAvailablePastureByPeriod, after) => {
  const precision = 3
  if (batch === undefined) {
    console.error('batch_not_found')
    return
  }
  return {}
  // (consommation pature verte * w 29) + (consommation pature reporté si report * w29 correspondant * 0.92)
}

// H267 ~ ok à préciser si nécessaire
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
          UF = fixFloatingPoint((curr.proportion / 100) * curr.type.nutritional_values[UFcolumn] * besoinMS, precision)
          // console.log('period %d - def: %d', period.id, UF)
        } else {
          UF = fixFloatingPoint((curr.proportion / 100) * curr.type.nutritional_values[UFcolumn], precision)
        }
      }
      return acc + UF
    }, 0.0)
    return sumUF
  })
}

// pour finalEnergeticCoverage
// OK H272 uf apporté par les concentrés
const getUFConcentratedByPeriod = (batch) => {
  const precision = 4
  if (batch === undefined) {
    console.error('batch_not_found')
    return
  }
  return batch.concentratedFeeds.map(({ period, feeds }, index) => {
    // UFL de la ration (en fonction du type d’animaux on ne prend pas la même colonne)* le pourcentage de ration
    const sumUF = Object.values(feeds).reduce((acc, curr) => {
      const UFcolumn = batch.profile.batch_type.UF_concentrated_value_considered

      const UF = curr.type.nutritional_values[UFcolumn] * curr.quantity
      // console.log('UFL : %d - Quantity : %d - UF: %d', curr.type.nutritional_values[UFcolumn], curr.quantity, UF)
      return acc + UF
    }, 0.0)
    // console.log('period %d - sumUF: %d', periodId, fixFloatingPoint(sumUF, precision))
    return fixFloatingPoint(sumUF, precision)
  })
}

const getFinalEnergeticCoverage = function (state, rootState, batchId) {
  // c'est juste pour faire le test des différentes fonction
  const finalEnergeticCoverage = []
  const batch = state.batchs[batchId]
  if (batch === undefined) {
    console.error('batch_not_found', batchId)
    return
  }
  const h272 = getUFConcentratedByPeriod(batch) // ok
  const h267 = getUFFeedsByPeriod(batch, true)
  const h249 = getUFPasturesByPeriod(batch, rootState.simulator.farm.totalAvailablePastureByPeriod)

  // par periode
  rootState.referential.periods.forEach((period, index) => {
    const periodId = period.id
    const toModerate = batch.profile.batch_type.code === 'VL'
    const potential = 1
    // par period
    const aprpr = batch.profile.animal_profile_periods.find((element) => element.period_id === periodId)
    const ufl = aprpr.UFL
    // H274 = H272+H267+h249 UF total
    const h274 = h272[index] + h267[index] + h249[index]
    const h234 = calculateEnergeticBesoin(ufl, toModerate, potential)

    // H276 = H274 / H234 couverture UF
    const h276 = h274 / h234

    finalEnergeticCoverage[index] = _.round(h276 * 100)
  })

  return { concentratedUF: h272, pastureUF: h249, feedsUF: h267, final_coverage: finalEnergeticCoverage }
}

export default {
  getFinalEnergeticCoverage,

  getEnergeticCoverage: function (state, rootState, batchId, withConcentrated = false) {
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
    rootState.referential.periods.forEach((period) => {
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
    })

    return totalAvailablePastureByPeriod
  },
  dispatchProduction: (state, rootState) => {
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
  },
  getDryMatterProvided: (state, rootState, batchId) => {
    const precision = 3
    const batch = state.batchs[batchId]
    if (batch === undefined) {
      console.error('batch_not_found', batchId)
      return
    }

    const UEcolumn = batch.profile.batch_type.UE_value_considered
    const UFcolumn = batch.profile.batch_type.UF_value_considered

    const finalEnergeticCoverage = getFinalEnergeticCoverage(state, rootState, batchId).final_coverage
    var totalEnergeticCoverage = { name: 'totalEnergeticCoverage', data: finalEnergeticCoverage }
    // const finalProteicCoverage = getFinalProteicCoverage(state, rootState, batchId)
    // var totalProteicCoverage = { name: 'totalProteicCoverage', data: finalProteicCoverage }

    var dryMatterProvidedPerFeed = {
      P: { name: 'Pâture', data: Array.from({ length: 13 }, () => 0) },
    }
    rootState.referential.barnStockItems.forEach((item) => {
      if (item.code !== 'RC' && item.code !== 'RP') {
        dryMatterProvidedPerFeed[item.code] = { name: item.name, data: Array.from({ length: 13 }, () => 0) }
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
      total_energetic_coverage: totalEnergeticCoverage,
      // "totalProteicCoverage": totalProteicCoverage
    }
  },
}
