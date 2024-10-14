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
} from '@/store/modules/mixins'

// Chemin vers votre fichier JSON
// TODO mock getStic avec une liste de stic
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
    expect(autonomy).toEqual(output.autonomy)
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
})
