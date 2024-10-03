// herd.spec.js
// Jest expect documentation https://jestjs.io/docs/expect

import fs from 'fs'
import _ from 'lodash'
import { getStic } from './mock/getters'
import {
  setTotalAvailablePasture,
  getV647,
  getTotalHerd,
  getUGBSystem,
  estimatedLivestockDensities,
  getTotalConsumptionExcludingConcentrates,
  getStockConsumptionPerPeriod,
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
    // for (let i in result) {
    //   expect(result[i]).toEqual(output[i])
    // }
    expect(result).toEqual(output.totalHerd)
  })

  it('Stock Consumption Per Period $269', () => {
    var $269 = {}
    batchs.forEach((el, index) => {
      $269['batch' + index] = []
    })
    periods.forEach((period, periodIndex) => {
      var h269 = 0
      batchs.forEach((curr, index) => {
        $269['batch' + index].push(getStockConsumptionPerPeriod(curr, periodIndex))
      })
    })
    expect($269.batch0).toEqual(output.$269.batch0)
  })

  it(' Total Consumption Excluding Concentrates $647', () => {
    var v647 = []
    periods.forEach((period, index) => {
      v647.push(getTotalConsumptionExcludingConcentrates(index, batchs, totalAvailablePastureByPeriod))
    })
    expect(v647).toEqual(output.$647)
  })

  it(' V647 ', () => {
    const v647 = getV647(batchs, periods, totalAvailablePastureByPeriod)
    expect(v647).toEqual(output.getV647)
  })

  it(' UGB system', () => {
    const ugb = getUGBSystem(simulation, periods, getStic)
    expect(ugb).toEqual(output.ugbSystem)
  })

  it(' estimated Livestock Densities E6', () => {
    const eld = estimatedLivestockDensities(simulation, periods, getStic)
    expect(eld).toEqual(output.estimatedLivestockDensities)
  })
})
