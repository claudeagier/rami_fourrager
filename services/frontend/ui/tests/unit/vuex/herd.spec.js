// herd.spec.js
// Jest expect documentation https://jestjs.io/docs/expect
import {
  setTotalAvailablePasture,
  getEnergeticCoverage,
  getProteicCoverage,
  getFinalEnergeticCoverage,
  getFinalProteicCoverage,
  getDryMatterProvided,
} from '@/store/modules/mixins'
import referential from '../../../src/store/modules/referential'
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

  rootGetters['referential/getSticByName'] = function (climaticYear, name) {}
  const batchId = 0
  var tap = {}
  var resultTest = {}

  const farmState = rootState.simulator.farm

  // apply mutation
  tap = setTotalAvailablePasture(rootState.simulator, rootGetters['referential/getSticByName'])

  rootState.simulator.farm.totalAvailablePastureByPeriod = tap

  it('energetic values before', () => {
    const result = getEnergeticCoverage(state, rootState, batchId)
    // for (let i in result) {
    //   expect(result[i]).toEqual(output[i])
    // }
    expect(result).toEqual(output.energeticCoverage)
  })
  it('proteic values before', () => {
    const result = getProteicCoverage(state, rootState, batchId)
    expect(result).toEqual(output.proteicCoverage)
  })

  // it('energetic concentrated values', () => {
  //   expect(result.concentratedUF).toEqual(outputs.herd.energetic.UF_concentrated)
  // })
  // it('energetic pasture uf', () => {
  //   expect(result.pastureUF).toEqual(outputs.herd.energetic.UF_pasture)
  // })
  // it('energetic feeds uf', () => {
  //   for (let i = 0; i < result.feedsUF.length; i++) {
  //     result.feedsUF[i] = _.round(result.feedsUF[i], 2)
  //   }
  //   expect(result.feedsUF).toEqual(outputs.herd.energetic.UF_feeds)
  // })
  it('final energetic coverage', () => {
    const result = getFinalEnergeticCoverage(state, rootState, rootGetters, batchId)
    expect(result).toEqual(outputs.herd.energetic.final_coverage)
  })
  const result = getFinalProteicCoverage(state, rootState, rootGetters, batchId)
  it('final feeds PDI', () => {
    expect(result.feedsPDI).toEqual(outputs.herd.proteic.$268)
  })
  it('final concentrated PDI', () => {
    expect(result.concentratedPDI).toEqual(outputs.herd.proteic.$273)
  })
  it('final pasture PDI', () => {
    expect(result.pasturePDI).toEqual(outputs.herd.proteic.$250)
  })
  it('final proteic coverage', () => {
    expect(result.final_coverage).toEqual(outputs.herd.proteic.final_coverage)
  })

  it('Dry Matter Provided', () => {
    const res = getDryMatterProvided(state, rootState, batchId)
    expect(res.dry_matter_needed.data).toEqual(outputs.herd.dry_matter_coverage.dry_matter_needed)
  })

  // it('proteic values with concentrated', () => {
  //   const result = getProteicCoverage(state, rootState, batchId, true)
  //   expect(result).toEqual(output.proteicCoverageWithConcentrated)
  // })
})
