export default {
  namespaced: true,
  state: {
    workspace: {},
  },
  mutations: {
    setWorkspace(state, workspace) {
      state.workspace = workspace
    },
    refreshWorkspace(state, workspace) {
      state.workspace = { tag: 'imported', ...workspace }
    },
    addSimulation(state, simulation) {
      simulation.lastModifiedDate = new Date().toLocaleDateString('fr-FR')
      state.workspace.simulations.push(simulation)
    },
    deleteSimulation(state, simulation) {
      const finded = state.workspace.simulations.indexOf(simulation)
      state.workspace.simulations.splice(finded, 1)
    },
    setTag(state, tag) {
      state.workspace.tag = tag
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
  },
  getters: {
    getWorkspace: (state) => {
      return state.workspace
    },
  },
}
