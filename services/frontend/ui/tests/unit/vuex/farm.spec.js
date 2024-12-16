// herd.spec.js
// Jest expect documentation https://jestjs.io/docs/expect
import {
  dispatchProductionByPeriod,
  getSticProductionByBarnStockItemByPeriod,
  getRotationSurfaceHarvestedByPeriod,
  getPastureSurplusesByPeriod,
} from '@/store/modules/mixins'
import farmStore from '@/store/modules/farm'
// Importer la fonction pour lire un fichier JSON
import fs from 'fs'
import _ from 'lodash'
import { getStic } from './mock/getters'

// Chemin vers votre fichier JSON
const path = require('path')
const stateFilePath = path.join(__dirname, 'fixtures/rootState.json')
const outputsFilePath = path.join(__dirname, 'fixtures/outputs.json')
describe('farm mutations', () => {
  // Charger le fichier JSON
  const rootState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'))
  const outputs = JSON.parse(fs.readFileSync(outputsFilePath, 'utf8'))
  const output = outputs.mixins.farm

  const periods = rootState.referential.periods
  const referential = rootState.referential
  const simulation = rootState.simulator
  const rotations = simulation.farm.rotations
  const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod
  // it('farms', () => {
  //   // apply mutation
  //   var t = setTotalAvailablePasture(simulation, periods, getStic)
  //   state.totalAvailablePastureByPeriod = t
  //   var result = farmStore.getters.getAvailablePasture(state)
  //   // assert result
  //   expect(result).toHaveLength(13)
  // })
  it('farms dispatch production by period', () => {
    const result = dispatchProductionByPeriod(rotations, referential, simulation, getStic)
    // // console.log(result)
    const res = result.map((period) => {
      period.stock = period.stock.map((st) => {
        st.quantity = _.round(st.quantity)
        return st
      })
      return period
    })
    expect(res).toEqual(output.stockByPeriod)
  })
  it('farm getReportharvestPeriod', () => {
    const har = []
    periods.forEach((period, index) => {
      const harvest = getRotationSurfaceHarvestedByPeriod(period.id, simulation, getStic)
      har.push(harvest)
    })
    expect(har).toEqual(output.reportHarvest)
  })
  it('farm getPastureSurplusesByPeriod', () => {
    const surplus = []
    periods.forEach((period, index) => {
      const sp = _.round(getPastureSurplusesByPeriod(index, simulation, totalAvailablePastureByPeriod, periods), 0)
      surplus.push(sp)
    })
    expect(surplus).toEqual(output.surplus)
  })
  getPastureSurplusesByPeriod
})
