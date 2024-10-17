// herd.spec.js
// Jest expect documentation https://jestjs.io/docs/expect
import {
  getEnergeticCoverage,
  getProteicCoverage,
  getFinalEnergeticCoverage,
  getFinalProteicCoverage,
  getDryMatterProvided,
  getDryMatterNeeded,
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

  const batch = rootState.simulator.herd.batchs[0]
  const periods = rootState.referential.periods
  const referential = rootState.referential
  const simulation = rootState.simulator
  const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod

  it('energetic values before', () => {
    const result = getEnergeticCoverage(batch, totalAvailablePastureByPeriod)
    expect(result).toEqual(output.energeticCoverage)
  })
  it('proteic values before', () => {
    const result = getProteicCoverage(batch, totalAvailablePastureByPeriod)
    expect(result).toEqual(output.proteicCoverage)
  })
  it('final energetic coverage', () => {
    const result = getFinalEnergeticCoverage(batch, simulation, periods, totalAvailablePastureByPeriod, getStic)
    expect(result).toEqual(outputs.herd.energetic.final_coverage)
  })
  const result = getFinalProteicCoverage(batch, simulation, periods, totalAvailablePastureByPeriod, getStic)
  it('final proteic coverage', () => {
    expect(result).toEqual(outputs.herd.proteic.final_coverage)
  })
  it('Dry Matter needed', () => {
    const res = getDryMatterNeeded(batch, periods)
    const roundedData = res.map((el) => _.round(el, 1))
    expect(roundedData).toEqual(outputs.herd.dry_matter_coverage.dry_matter_needed)
  })
})
