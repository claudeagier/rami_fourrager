// herd.spec.js
// Jest expect documentation https://jestjs.io/docs/expect
import mixins from '@/store/modules/mixins'
// Importer la fonction pour lire un fichier JSON
import fs from 'fs'
import _ from 'lodash'

// Chemin vers votre fichier JSON
const path = require('path')
const stateFilePath = path.join(__dirname, 'fixtures/simulationState.json')
const outputsFilePath = path.join(__dirname, 'fixtures/outputs.json')
describe('herds mutations', () => {
  // Charger le fichier JSON
  const rootState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'))
  const state = rootState.simulator.herd

  const outputs = JSON.parse(fs.readFileSync(outputsFilePath, 'utf8'))
  const output = outputs.herd

  const batchId = 0
  var tap = {}
  var resultTest = {}

  const farmState = rootState.simulator.farm

  // apply mutation
  tap = mixins.setTotalAvailablePasture(farmState, rootState)

  rootState.simulator.farm.totalAvailablePastureByPeriod = tap

  it('energetic values', () => {
    const result = mixins.getEnergeticCoverage(state, rootState, batchId)
    // for (let i in result) {
    //   expect(result[i]).toEqual(output[i])
    // }
    expect(result).toEqual(output.energeticCoverage)
  })
  it('proteic values', () => {
    const result = mixins.getProteicCoverage(state, rootState, batchId)
    expect(result).toEqual(output.proteicCoverage)
  })

  it('energetic values with concentrated', () => {
    const sumUF = mixins.getConcentratedUfSum(state, batchId)
    expect(sumUF).toEqual(outputs.herd.energetic.UF_concentrated)

    // const result = mixins.getEnergeticCoverage(state, rootState, batchId, true)
    // for (let i in result) {
    //   expect(result[i]).toEqual(output[i])
    // }
    // expect(result).toEqual(output.energeticCoverageWithConcentrated)
  })

  // it('proteic values with concentrated', () => {
  //   const result = mixins.getProteicCoverage(state, rootState, batchId, true)
  //   expect(result).toEqual(output.proteicCoverageWithConcentrated)
  // })
})
