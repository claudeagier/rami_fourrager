import { deepEqual } from '../../plugins/utils'

export default {
  namespaced: true,
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
  },
  actions: {
    loadSimulator({ state, commit, dispatch, getters }, simulation) {
      commit('activateSimulation', simulation)

      const sim = getters.getActivatedSimulation
      commit('simulator/setSimulation', sim, { root: true })
      commit('simulator/farm/setFarm', sim.farm, { root: true })
      commit('simulator/barn/setBarn', sim.barn, { root: true })
      commit('simulator/herd/setHerd', sim.herd, { root: true })

      // apply all
      dispatch('simulator/farm/setTotalAvailablePastureByPeriod', null, { root: true })
      dispatch('simulator/farm/dispatchProduction', null, { root: true })
    },
  },
  getters: {
    getWorkspace: (state) => {
      return state.workspace
    },
    getActivatedSimulation: (state) => {
      if (state.workspace.simulations !== undefined) {
        const finded = state.workspace.simulations.find((sim) => sim.loaded === true)
        return finded
      }
    },
  },
}
