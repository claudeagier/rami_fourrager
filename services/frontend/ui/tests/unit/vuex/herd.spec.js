// herd.spec.js
// Jest expect documentation https://jestjs.io/docs/expect
import {
  getEnergeticCoverage,
  getProteicCoverage,
  getFinalEnergeticCoverage,
  getFinalProteicCoverage,
  getDryMatterProvided,
} from '@/store/modules/mixins'

// Importer la fonction pour lire un fichier JSON
import fs from 'fs'
import _ from 'lodash'
import { getStic } from './mock/getters'

// Chemin vers votre fichier JSON

const path = require('path')
const stateFilePath = path.join(__dirname, 'fixtures/rootState.json')
const outputsFilePath = path.join(__dirname, 'fixtures/outputs.json')
describe('herds mutations', () => {
  // mock
  const rootState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'))
  const state = rootState.simulator.herd
  const outputs = JSON.parse(fs.readFileSync(outputsFilePath, 'utf8'))
  const output = outputs.herd
  const batchId = 0
  const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod

  it('energetic values before', () => {
    const result = getEnergeticCoverage(state, rootState, batchId)
    expect(result).toEqual(output.energeticCoverage)
  })
  it('proteic values before', () => {
    const result = getProteicCoverage(state, rootState, batchId)
    expect(result).toEqual(output.proteicCoverage)
  })
  // it('final energetic coverage', () => {
  //   const result = getFinalEnergeticCoverage(state, rootState, rootGetters, batchId)
  //   expect(result).toEqual(outputs.herd.energetic.final_coverage)
  // })
  // const result = getFinalProteicCoverage(state, rootState, rootGetters, batchId)
  // it('final feeds PDI', () => {
  //   expect(result.feedsPDI).toEqual(outputs.herd.proteic.$268)
  // })
  // it('final concentrated PDI', () => {
  //   expect(result.concentratedPDI).toEqual(outputs.herd.proteic.$273)
  // })
  // it('final pasture PDI', () => {
  //   expect(result.pasturePDI).toEqual(outputs.herd.proteic.$250)
  // })
  // it('final proteic coverage', () => {
  //   expect(result.final_coverage).toEqual(outputs.herd.proteic.final_coverage)
  // })

  it('Dry Matter Provided', () => {
    const res = getDryMatterProvided(state, rootState, batchId)
    expect(res.dry_matter_needed.data).toEqual(outputs.herd.dry_matter_coverage.dry_matter_needed)
  })
})
