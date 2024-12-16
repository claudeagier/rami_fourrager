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
import { replaceNan } from '@/plugins/utils'

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
      category: '1_fourrage',
      code: 'P',
      initialStock: 0,
      production: replaceNan(_.round(getPastureProductionTotal(simulation), 0), 0),
      consommation: replaceNan(_.round(getPastureConsumptionTotal(simulation, periods), 0), 0),
      finalStock: replaceNan(_.round(getPastureFinalStock(simulation, periods), 0), 0),
      final_initialStock: replaceNan(_.round(getPastureFinalMinInitialStock(simulation, periods), 0), 0),
      purchase: replaceNan(_.round(getPasturePurchaseValue(simulation, periods), 0), 0),
      purchaseCost: simulation.report.soldedStock['P'].purchaseCost,
      sale: simulation.report.soldedStock['P'].sale,
      costOfSell: simulation.report.soldedStock['P'].costOfSell,
      productionCost: simulation.report.soldedStock['P'].productionCost,
      total: 9052,
    }
    expect(stockItem).toEqual(output.groupedStock[0])
  })

  const stock = []
  const codes = ['FH', 'EH', 'EM', 'EL', 'FL']
  codes.forEach((stockCode) => {
    const stockItem = {
      name: rootState.referential.barnStockItems.find((item) => item.code === stockCode).name,
      category: '1_fourrage',
      code: stockCode,
      initialStock: replaceNan(_.round(getInitialStockByBarnStockItem(simulation, stockCode), 0), 0),
      production: replaceNan(_.round(getSticProductionByBarnStockItem(simulation, stockCode, periods, getStic), 0), 0),
      consommation: replaceNan(_.round(getConsumptionByBarnStockItem(simulation, periods, stockCode), 0), 0),
      finalStock: replaceNan(_.round(getFinalStockByBarnStockItem(simulation, stockCode, periods, getStic), 0), 0),
      final_initialStock: replaceNan(
        _.round(getFinalMinInitialStockByBarnStockItem(simulation, stockCode, periods, getStic), 0),
        0
      ),
      purchase: replaceNan(_.round(getPurchaseValueByBarnStockItem(simulation, stockCode, periods, getStic), 0), 0),
      purchaseCost: simulation.report.soldedStock[stockCode].purchaseCost,
      sale: simulation.report.soldedStock[stockCode].sale,
      costOfSell: simulation.report.soldedStock[stockCode].costOfSell,
      productionCost: simulation.report.soldedStock[stockCode].productionCost,
      total: 0,
    }
    stock.push(stockItem)
  })

  it('cost data stock FH', () => {
    stock[0].total = 8896
    expect(stock[0]).toEqual(output.groupedStock[1])
  })
  it('cost data sotck EH', () => {
    stock[1].total = 14229
    expect(stock[1]).toEqual(output.groupedStock[2])
  })
  it('cost data sotck EM', () => {
    stock[2].total = 12129
    expect(stock[2]).toEqual(output.groupedStock[3])
  })
  it('cost data sotck EL', () => {
    stock[3].total = 0
    expect(stock[3]).toEqual(output.groupedStock[4])
  })
  it('cost data sotck FL', () => {
    stock[4].total = 0
    expect(stock[4]).toEqual(output.groupedStock[5])
  })

  const stockCodeList = ['RC', 'RP']
  stockCodeList.forEach((stockCode) => {
    const stockItem = {
      name: rootState.referential.barnStockItems.find((item) => item.code === stockCode).name,
      code: stockCode,
      category: '2_concentrated',
      initialStock: replaceNan(_.round(getInitialStockByBarnStockItem(simulation, stockCode), 0), 0),
      production: replaceNan(_.round(getSticProductionByBarnStockItem(simulation, stockCode, periods, getStic), 0), 0),
      consommation: replaceNan(_.round(getConsumptionByBarnStockItem(simulation, periods, stockCode), 0), 0),
      finalStock: replaceNan(_.round(getFinalStockByBarnStockItem(simulation, stockCode, periods, getStic), 0), 0),
      final_initialStock: replaceNan(
        _.round(getFinalMinInitialStockByBarnStockItem(simulation, stockCode, periods, getStic), 0),
        0
      ),
      purchase: replaceNan(_.round(getPurchaseValueByBarnStockItem(simulation, stockCode, periods, getStic), 0), 0),
      purchaseCost: simulation.report.soldedStock[stockCode].purchaseCost,
      sale: simulation.report.soldedStock[stockCode].sale,
      costOfSell: simulation.report.soldedStock[stockCode].costOfSell,
      productionCost: simulation.report.soldedStock[stockCode].productionCost,
      total: 0,
    }
    stock.push(stockItem)
  })

  it('cost data sotck RC', () => {
    stock[5].total = 21869
    expect(stock[5]).toEqual(output.groupedStock[6])
  })
  it('cost data sotck RP', () => {
    stock[6].total = 19731
    expect(stock[6]).toEqual(output.groupedStock[7])
  })
})
