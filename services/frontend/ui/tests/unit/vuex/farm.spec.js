// herd.spec.js
// Jest expect documentation https://jestjs.io/docs/expect
import { setTotalAvailablePasture, dispatchProduction } from '@/store/modules/mixins'
import farmStore from '@/store/modules/farm'
// Importer la fonction pour lire un fichier JSON
import fs from 'fs'
import _ from 'lodash'

// Chemin vers votre fichier JSON
const path = require('path')
const stateFilePath = path.join(__dirname, 'fixtures/simulationState.json')
const outputsFilePath = path.join(__dirname, 'fixtures/outputs.json')
describe('farm mutations', () => {
  // Charger le fichier JSON
  const rootState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'))
  const state = rootState.simulator.farm
  const outputs = JSON.parse(fs.readFileSync(outputsFilePath, 'utf8'))

  it('farms', () => {
    // apply mutation
    var t = setTotalAvailablePasture(state, rootState)
    state.totalAvailablePastureByPeriod = t
    var result = farmStore.getters.getAvailablePasture(state)
    // assert result
    expect(result).toHaveLength(13)
  })
  it('farms dispatch production', () => {
    const result = dispatchProduction(state, rootState)
    expect(result.barnStockByPeriod).toHaveLength(13)
  })
})
