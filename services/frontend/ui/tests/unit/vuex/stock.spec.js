// herd.spec.js
// Jest expect documentation https://jestjs.io/docs/expect

import fs from 'fs'
import _ from 'lodash'
import { getStic } from './mock/getters'
import {
  getInitialStockByBarnStockItem,
  getSticProductionByBarnStockItem,
  getConsumptionByBarnStockItem,
  getFinalMinInitialStockByBarnStockItem,
  getPurchaseValueByBarnStockItem,
  getFinalStockByBarnStockItem,
  getPastureProductionTotal,
  getPastureConsumptionTotal,
  getPastureFinalStock,
  getPastureFinalMinInitialStock,
  getPasturePurchaseValue,
} from '@/store/modules/mixins'

// Chemin vers votre fichier JSON
const path = require('path')

// mock rootState test application
const stateFilePath = path.join(__dirname, 'fixtures/rootState.json')
const rootState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'))

// valeurs attendues
const outputsFilePath = path.join(__dirname, 'fixtures/outputs.json')
const outputs = JSON.parse(fs.readFileSync(outputsFilePath, 'utf8'))
const output = outputs.mixins.stock

describe('stock module data', () => {
  // mock
  const batchs = rootState.simulator.herd.batchs
  const periods = rootState.referential.periods
  const simulation = rootState.simulator
  const totalAvailablePastureByPeriod = rootState.simulator.farm.totalAvailablePastureByPeriod
  const barnStockItems = rootState.referential.barnStockItems

  it('cost data stock P', () => {
    const stockItem = {
      name: 'Pâtures',
      initialStock: 0,
      production: _.round(getPastureProductionTotal(simulation), 0),
      consommation: _.round(getPastureConsumptionTotal(simulation, periods), 0),
      finalStock: _.round(getPastureFinalStock(simulation, periods), 0),
      final_initialStock: _.round(getPastureFinalMinInitialStock(simulation, periods), 0),
      purchase: _.round(getPasturePurchaseValue(simulation, periods), 0),
      sold: simulation.report.soldedStock['P'].sale, // valeur à saisir
    }
    expect(stockItem).toEqual(output.totalStock[3])
  })

  const stock = []
  const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
  codes.forEach((code) => {
    const stockItem = {
      name: barnStockItems.find((item) => item.code === code).name,
      initialStock: getInitialStockByBarnStockItem(simulation, code),
      production: _.round(getSticProductionByBarnStockItem(simulation, code, periods), 0),
      consommation: _.round(getConsumptionByBarnStockItem(simulation, periods, code), 0),
      finalStock: getFinalStockByBarnStockItem(simulation, code, periods),
      final_initialStock: getFinalMinInitialStockByBarnStockItem(simulation, code, periods),
      purchase: getPurchaseValueByBarnStockItem(simulation, code, periods),
      sold: simulation.report.soldedStock[code].sale, // valeur à saisir
    }
    stock.push(stockItem)
  })

  it('cost data stock FH', () => {
    expect(stock[0]).toEqual(output.totalStock[0])
  })
  it('cost data sotck EH', () => {
    expect(stock[1]).toEqual(output.totalStock[1])
  })
  it('cost data sotck EM', () => {
    expect(stock[2]).toEqual(output.totalStock[2])
  })
})
