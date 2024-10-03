import fs from 'fs'

const path = require('path')
const stateFilePath = path.join(__dirname, '../fixtures/rootState.json')
const rootState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'))

const stics = rootState.referential.stics

function sticList(climaticYearId) {
  var list = stics

  const filtered = list.filter((stic) => {
    return stic.climatic_year_id === climaticYearId
  })
  return filtered
}

export function getStic(climaticYear, name) {
  return sticList(climaticYear).find((el) => el.name === name)
}
