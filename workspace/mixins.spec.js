// Import necessary functions and dependencies
import fs from 'fs'
import _ from 'lodash'

import {
  getAvailableGreenPastureByAnimal,
  getExcessPastureAfterBatchesPassed,
  getPastureConsumptionPlannedByClassicFeed,
  getMaxConsumptionGreenPasture,
  getAvailableCarryOverPastureByAnimal,
  getAllPastureMaxConsumption,
  getGreenPastureConsumption,
  getCarryOverPastureConsumption,
  getPasturesByPeriod,
  setTotalAvailablePasture,
} from '@/store/modules/mixins' // Remplacez par le chemin vers vos fonctions

const path = require('path')
const stateFilePath = path.join(__dirname, 'fixtures/simulationState.json')
const outputsFilePath = path.join(__dirname, 'fixtures/outputs.json')

describe('Pasture Consumption Functions', () => {
  // fixtures outputs
  const outputs = JSON.parse(fs.readFileSync(outputsFilePath, 'utf8'))
  const output = outputs.mixins

  // Moke
  const rootState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'))
  const herdState = rootState.simulator.herd

  const farmState = rootState.simulator.farm
  const batchId = 0

  // apply mutation
  const totalAvailablePastureByPeriod = setTotalAvailablePasture(rootState.simulation)

  // set rootState with data
  // rootState.simulator.farm.totalAvailablePastureByPeriod = totalAvailablePastureByPeriod

  const batchs = herdState.batchs
  const batch = herdState.batchs[batchId]
  const cache = {}
  const result = {
    getAvailableGreenPastureByAnimal: [],
    getExcessPastureAfterBatchesPassed: [],
    getPastureConsumptionPlannedByClassicFeed: [],
    getMaxConsumptionGreenPasture: [],
    getAvailableCarryOverPastureByAnimal: [],
    getAllPastureMaxConsumption: [],
    getGreenPastureConsumption: [],
    getCarryOverPastureConsumption: [],
    getPasturesByPeriod: [],
  }
  rootState.referential.periods.forEach((period, index) => {
    // result['getPastureConsumptionPlannedByClassicFeed'][index] = _.round(
    //   getPastureConsumptionPlannedByClassicFeed(batch, index),
    //   1
    // )
    // result['getMaxConsumptionGreenPasture'][index] = _.round(
    //   getMaxConsumptionGreenPasture(batch, index, totalAvailablePastureByPeriod, batchs),
    //   1
    // )
    // result['getAvailableGreenPastureByAnimal'][index] = _.round(
    //   getAvailableGreenPastureByAnimal(batch, index, totalAvailablePastureByPeriod, batchs),
    //   1
    // )
    // result['getExcessPastureAfterBatchesPassed'][index] = _.round(
    //   getExcessPastureAfterBatchesPassed(batchs, totalAvailablePastureByPeriod, index),
    //   0
    // )
    // result['getAvailableCarryOverPastureByAnimal'][index] = getAvailableCarryOverPastureByAnimal(
    //   batch,
    //   index,
    //   totalAvailablePastureByPeriod,
    //   batchs
    // )
    // result['getAllPastureMaxConsumption'][index] = getAllPastureMaxConsumption(
    //   batch,
    //   index,
    //   totalAvailablePastureByPeriod,
    //   batchs
    // )
    // result['getGreenPastureConsumption'][index] = _.round(
    //   getGreenPastureConsumption(batch, index, totalAvailablePastureByPeriod, batchs),
    //   1
    // )
    // result['getCarryOverPastureConsumption'][index] = getCarryOverPastureConsumption(
    //   batch,
    //   index,
    //   totalAvailablePastureByPeriod,
    //   batchs
    // )
    // result['getPasturesByPeriod'][index] = getPasturesByPeriod(
    //   'energeticTotal',
    //   batch,
    //   index,
    //   totalAvailablePastureByPeriod,
    //   batchs
    // )
  })

  // // OK
  // test('getPastureConsumptionPlannedByClassicFeed should return correct consumption', () => {
  //   expect(result.getPastureConsumptionPlannedByClassicFeed).toEqual(output.pastures.$241)
  // })

  // // OK
  // test('getMaxConsumptionGreenPasture should return the minimum of two values', () => {
  //   expect(result.getMaxConsumptionGreenPasture).toEqual(output.pastures.$242)
  // })

  // test('getExcessPastureAfterBatchesPassed should return correct excess pasture', () => {
  //   expect(result.getExcessPastureAfterBatchesPassed).toEqual(output.pastures.$650)
  // })

  // test('getAvailableCarryOverPastureByAnimal should return correct carryover pasture', () => {
  //   expect(result.getAvailableCarryOverPastureByAnimal).toEqual(output.pastures.$243)
  // })

  // test('getAllPastureMaxConsumption should return the minimum of two values', () => {
  //   expect(result.getAllPastureMaxConsumption).toEqual(output.pastures.$244)
  // })

  // test('getGreenPastureConsumption should return correct value based on strategy', () => {
  //   expect(result.getGreenPastureConsumption).toEqual(output.pastures.$246)
  // })

  // // OK
  // test('getAvailableGreenPastureByAnimal should return correct value for priority 0', () => {
  //   expect(result.getAvailableGreenPastureByAnimal).toEqual(output.pastures.$240)
  // })

  // test('getCarryOverPastureConsumption should return correct value based on strategy', () => {
  //   expect(result.getCarryOverPastureConsumption).toEqual(output.pastures.$247)
  // })

  // test('getPasturesByPeriod should return correct total pasture consumption', () => {
  //   expect(result.getPasturesByPeriod).toEqual(output.pastures.$249)
  // })
})
