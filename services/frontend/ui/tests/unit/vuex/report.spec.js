// herd.spec.js
// Jest expect documentation https://jestjs.io/docs/expect

import fs from 'fs'
import _ from 'lodash'
import { getStic } from './mock/getters'
import {
  getV647,
  getTotalHerd,
  getUGBSystem,
  getEstimatedLivestockDensities,
  getTotalConsumptionExcludingConcentrates,
  getSFP,
  getRotationSurface,
  getApparentLivestockDensities,
  getSAU,
  getSFP_SAU,
  getPT_SAU,
  getPP_SAU,
  getCorrectedLivestockDensities,
  getPotentialLivestockDensities,
  getAutonomy,
  getPotential,
  getHarvestedFodder,
  getCostIndicator,
  getHerdNeeds,
} from '@/store/modules/mixins'

// Chemin vers votre fichier JSON
const path = require('path')

// mock rootState test application
const stateFilePath = path.join(__dirname, 'fixtures/rootState.json')
const rootState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'))

// valeurs attendues
const outputsFilePath = path.join(__dirname, 'fixtures/outputs.json')
const outputs = JSON.parse(fs.readFileSync(outputsFilePath, 'utf8'))
const output = outputs.mixins.report

describe('report dimensioning', () => {
  // mock
  const batchs = rootState.simulator.herd.batchs
  const periods = rootState.referential.periods
  const simulation = rootState.simulator
  const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod

  it('total herd', () => {
    const result = getTotalHerd(batchs)
    expect(result).toEqual(output.totalHerd)
  })
  // it('Besoins troupeau (tMS moyen période/jour) $646', () => {
  //   var $646 = []
  //   periods.forEach((period, index) => {
  //     $646.push(_.round(getHerdNeeds(index, batchs), 2))
  //   })
  //   expect($646).toEqual(output.$646)
  // })
  it(' Total Consumption Excluding Concentrates $647', () => {
    var v647 = []
    const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
    periods.forEach((period, index) => {
      v647.push(
        _.round(getTotalConsumptionExcludingConcentrates(index, batchs, totalAvailablePastureByPeriod, codes), 0)
      )
    })
    expect(v647).toEqual(output.$647)
  })

  it(' V647 ', () => {
    const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
    const v647 = getV647(batchs, periods, totalAvailablePastureByPeriod, codes)
    expect(_.round(v647, 0)).toEqual(output.getV647)
  })

  it(' UGB system', () => {
    const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
    const ugb = getUGBSystem(simulation, periods, codes, totalAvailablePastureByPeriod)
    expect(ugb).toEqual(output.ugbSystem)
  })

  it(' estimated Livestock Densities E6', () => {
    const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
    const eld = getEstimatedLivestockDensities(simulation, periods, totalAvailablePastureByPeriod, codes)
    expect(_.round(eld, 2)).toEqual(output.estimatedLivestockDensities)
  })

  it(' surface according to stic type', () => {
    const type = 'P'
    const sfp = getRotationSurface(type, simulation, getStic)
    expect(_.round(sfp, 0)).toEqual(output.sfp)
  })

  it(' surface fourragère principale SFP X55', () => {
    const sfp = getSFP(simulation, getStic)
    expect(_.round(sfp, 0)).toEqual(output.sfp)
  })

  it('Chargement apparent E7', () => {
    const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
    const ald = getApparentLivestockDensities(simulation, periods, getStic, codes, totalAvailablePastureByPeriod)
    expect(_.round(ald, 2)).toEqual(output.apparentLivestockDensities)
  })
  it('Chargement corrigé E8', () => {
    const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
    const cld = getCorrectedLivestockDensities(simulation, periods, getStic, codes, totalAvailablePastureByPeriod)
    expect(_.round(cld, 2)).toEqual(output.correctedLivestockDensities)
  })

  it('Chargement potentiel E9', () => {
    const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
    const pld = getPotentialLivestockDensities(simulation, periods, getStic, codes)
    expect(_.round(pld, 2)).toEqual(output.potentialLivestockDensities)
  })

  it('autonomy', () => {
    const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
    const autonomy = getAutonomy(simulation, periods, getStic, codes, totalAvailablePastureByPeriod)
    expect(autonomy > 0).toEqual(output.autonomy)
  })
  it('potential', () => {
    const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
    const potential = getPotential(simulation, periods, getStic, codes, totalAvailablePastureByPeriod)
    expect(_.round(potential, 0)).toEqual(output.potential)
  })
  it('harvestFodder', () => {
    const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
    const harvestFodder = getHarvestedFodder(simulation, periods, getStic, codes, totalAvailablePastureByPeriod)
    expect(_.round(harvestFodder, 1)).toEqual(output.harvestFodder)
  })

  it('SAU', () => {
    const SAU = getSAU(simulation, getStic)
    expect(_.round(SAU, 1)).toEqual(output.SAU)
  })
  it('SFP/SAU', () => {
    const sfp_sau = getSFP_SAU(simulation, periods, getStic)
    expect(_.round(sfp_sau, 0)).toEqual(output.sfp_sau)
  })

  it('PP/SAU', () => {
    const pp_sau = getPP_SAU(simulation, periods, getStic)
    expect(_.round(pp_sau, 0)).toEqual(output.pp_sau)
  })

  it('PT/SAU', () => {
    const pt_sau = getPT_SAU(simulation, periods, getStic)
    expect(_.round(pt_sau, 0)).toEqual(output.pt_sau)
  })
  // it('get cost indicators', () => {
  //   const data = {
  //     '1_fourrage': [
  //       {
  //         name: 'Pâtures',
  //         category: '1_fourrage',
  //         code: 'P',
  //         initialStock: 0,
  //         production: 234.1867300000001,
  //         consommation: 226.3087512,
  //         finalStock: 7.877978800000108,
  //         final_initialStock: 7.877978800000108,
  //         purchase: 0,
  //         purchaseCost: 0,
  //         sale: 0,
  //         costOfSell: 0,
  //         productionCost: 40,
  //         total: 9052,
  //       },
  //       {
  //         name: 'Foin',
  //         category: '1_fourrage',
  //         code: 'FH',
  //         initialStock: 58,
  //         production: 111.2,
  //         consommation: 110.29609360000002,
  //         finalStock: 59,
  //         final_initialStock: 1,
  //         purchase: 0,
  //         purchaseCost: 0,
  //         sale: 0,
  //         costOfSell: 0,
  //         productionCost: 80,
  //         total: 8896,
  //       },
  //       {
  //         name: "Ensilage et enrubannage d'herbe",
  //         category: '1_fourrage',
  //         code: 'EH',
  //         initialStock: 79,
  //         production: 158.10000000000002,
  //         consommation: 156.42835208000002,
  //         finalStock: 81,
  //         final_initialStock: 2,
  //         purchase: 0,
  //         purchaseCost: 0,
  //         sale: 0,
  //         costOfSell: 0,
  //         productionCost: 90,
  //         total: 14229,
  //       },
  //       {
  //         name: 'Ensilage de maïs et sorgho (riche UF)',
  //         category: '1_fourrage',
  //         code: 'EM',
  //         initialStock: 66,
  //         production: 120,
  //         consommation: 120.72059999999999,
  //         finalStock: 65,
  //         final_initialStock: -1,
  //         purchase: 1,
  //         purchaseCost: 0,
  //         sale: 0,
  //         costOfSell: 0,
  //         productionCost: 100,
  //         total: 12000,
  //       },
  //       {
  //         name: 'Ensilage de légumineuses (riche PDI)',
  //         category: '1_fourrage',
  //         code: 'EL',
  //         initialStock: 0,
  //         production: 0,
  //         consommation: 0,
  //         finalStock: 0,
  //         final_initialStock: 0,
  //         purchase: 0,
  //         purchaseCost: 0,
  //         sale: 0,
  //         costOfSell: 0,
  //         productionCost: 120,
  //         total: 0,
  //       },
  //       {
  //         name: 'Foin de légumineuses (riche PDI)',
  //         category: '1_fourrage',
  //         code: 'FL',
  //         initialStock: 0,
  //         production: 0,
  //         consommation: 0,
  //         finalStock: 0,
  //         final_initialStock: 0,
  //         purchase: 0,
  //         purchaseCost: 0,
  //         sale: 0,
  //         costOfSell: 0,
  //         productionCost: 90,
  //         total: 0,
  //       },
  //     ],
  //     '2_concentrated': [
  //       {
  //         name: 'Céréales en grain',
  //         code: 'RC',
  //         category: '2_concentrated',
  //         initialStock: 216,
  //         production: 450,
  //         consommation: 0,
  //         finalStock: 666,
  //         final_initialStock: 450,
  //         purchase: 0,
  //         purchaseCost: 0,
  //         sale: 0,
  //         costOfSell: 0,
  //         productionCost: 0,
  //         total: 0,
  //       },
  //       {
  //         name: 'Protéagineux en grain',
  //         code: 'RP',
  //         category: '2_concentrated',
  //         initialStock: -96,
  //         production: 0,
  //         consommation: 0,
  //         finalStock: -96,
  //         final_initialStock: 0,
  //         purchase: 0,
  //         purchaseCost: 0,
  //         sale: 0,
  //         costOfSell: 0,
  //         productionCost: 0,
  //         total: 0,
  //       },
  //     ],
  //     '3_straw': [
  //       {
  //         name: 'paille',
  //         category: '3_straw',
  //         code: 'STRAW',
  //         initialStock: 53,
  //         production: 0,
  //         consommation: 0,
  //         finalStock: 53,
  //         final_initialStock: 0,
  //         purchase: 0,
  //         purchaseCost: 0,
  //         sale: 0,
  //         costOfSell: 0,
  //         productionCost: 0,
  //         total: 0,
  //       },
  //     ],
  //   }
  //   const stockCodeList = ['FH', 'EH', 'EM', 'EL', 'FL']
  //   const indicators = getCostIndicator(
  //     data,
  //     periods,
  //     simulation,
  //     totalAvailablePastureByPeriod,
  //     stockCodeList,
  //     getStic
  //   )
  //   expect(indicators).toEqual(output.indicators)
  // })
})
