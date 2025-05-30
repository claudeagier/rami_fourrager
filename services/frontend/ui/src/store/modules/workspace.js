import { deepEqual, deepCopy } from '../../plugins/utils'
import mapper from './mapper'

export default {
  namespaced: true,
  modules: { mapper },
  state: {
    workspace: {},
  },
  mutations: {
    // workspace
    setWorkspace(state, workspace) {
      state.workspace = workspace
    },
    refreshWorkspace(state, workspace) {
      state.workspace = { tag: 'imported', ...workspace }
    },
    setTag(state, tag) {
      state.workspace.tag = tag
    },

    // simulations
    addSimulation(state, simulation) {
      simulation.lastModifiedDate = new Date().toLocaleDateString('fr-FR')
      state.workspace.simulations.push(simulation)
    },
    updateSimulation(state, { key, value }) {
      if (state.workspace.simulations !== undefined) {
        // je prends la simulation activé
        let finded = state.workspace.simulations.find((sim) => sim.loaded === true)
        // je modifie la valeur donnée pour la clé donnée
        if (key === 'all') {
          finded = deepCopy(value)
        } else {
          finded[key] = deepCopy(value)
        }
      }
    },
    deleteSimulation(state, simulation) {
      const finded = state.workspace.simulations.indexOf(simulation)
      state.workspace.simulations.splice(finded, 1)
    },
    activateSimulation(state, simulation) {
      const finded = state.workspace.simulations.indexOf(simulation)
      const sims = state.workspace.simulations.map((sim, index) => {
        if (index === finded) {
          sim.loaded = true
        } else {
          sim.loaded = false
        }
        return sim
      })
    },
    deactivateSimulation(state, simulation) {
      const index = state.workspace.simulations.indexOf(simulation)
      state.workspace.simulations[index].loaded = false
    },
    deactivateAllSimulation(state) {
      for (let index = 0; index < state.workspace.simulations.length; index++) {
        state.workspace.simulations[index].loaded = false
      }
    },

    // mappings
    activateMapping(state, mapping) {
      const finded = state.workspace.mappings.indexOf(mapping)
      state.workspace.mappings.map((mapping, index) => {
        if (index === finded) {
          mapping.inUse = true
        } else {
          mapping.inUse = false
        }
        return mapping
      })
    },
    deactivateMapping(state, mapping) {
      const index = state.workspace.mappings.indexOf(mapping)
      state.workspace.mappings[index].inUse = false
    },
    deactivateAllMapping(state) {
      for (let index = 0; index < state.workspace.mappings.length; index++) {
        state.workspace.mappings[index].inUse = false
      }
    },

    // classicFeeds
    addClassicFeed(state, { newFeed }) {
      state.workspace.classicFeeds.push(newFeed)
    },
    updateClassicFeed(state, { newFeed, oldFeed }) {
      const classicFeeds = state.workspace.classicFeeds
      const feedIndex = classicFeeds.findIndex((feed) => deepEqual(feed, oldFeed))
      if (feedIndex > -1) {
        classicFeeds.splice(feedIndex, 1, newFeed)
      }
    },
    deleteClassicFeed(state, classicFeed) {
      const finded = state.workspace.classicFeeds.indexOf(classicFeed)
      state.workspace.classicFeeds.splice(finded, 1)
    },

    // generics
    addItem(state, { dialog, newItem }) {
      const d = dialog + 's'
      state.workspace[d].push(newItem)
    },
    updateItem(state, { dialog, newItem, oldItem }) {
      const d = dialog + 's'
      const items = state.workspace[d]
      const index = items.findIndex((el) => deepEqual(el, oldItem))
      if (index > -1) {
        items.splice(index, 1, newItem)
      }
    },
    deleteItem(state, { dialog, item }) {
      const d = dialog + 's'
      const finded = state.workspace[d].indexOf(item)
      state.workspace[d].splice(finded, 1)
    },
  },
  actions: {
    loadSimulator({ state, commit, dispatch, getters }, simulation) {
      commit('activateSimulation', simulation)
      const sim = deepCopy(getters.getActivatedSimulation)
      commit('simulator/setSimulation', sim, { root: true })
      commit('simulator/farm/setFarm', sim.farm, { root: true })
      commit('simulator/barn/setBarn', sim.barn, { root: true })
      commit('simulator/herd/setHerd', sim.herd, { root: true })
      commit('simulator/report/setReport', sim.report, { root: true })
    },
    activateMapping({ state, commit, dispatch, getters }, mapping) {
      commit('activateMapping', mapping)
    },
    deactivateAllMapping({ state, commit }) {
      commit('deactivateAllMapping')
    },
  },
  getters: {
    getWorkspace: (state) => {
      return state.workspace
    },
    getActivatedSimulation: (state, getters, rootState) => {
      if (state.workspace.simulations !== undefined) {
        const finded = state.workspace.simulations.find((sim) => sim.loaded === true)
        return finded
      }
    },
    getMappings: (state) => {
      // const defaultMapping = [{ name: 'cap2er', json: '', inUse: false }]

      // return [...defaultMapping, ...state.workspace.mappings]
      return state.workspace.mappings
    },
  },
}
