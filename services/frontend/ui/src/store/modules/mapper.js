import calculations from './calculations.js'

export default {
  namespaced: true,
  state: {
    mapping: {},
    simulationsSelected: [],
  },
  mutations: {
    setMapping(state, mapping) {
      state.mapping = mapping
    },
    setSimulationsSelected(state, simulationList) {
      state.simulationsSelected = simulationList
    },
  },
  getters: {
    availableCalculationFields() {
      return Object.entries(calculations)
        .filter(([k, fn]) => typeof fn === 'function' && k !== 'extractParams')
        .map(([k]) => k)
    },
    getMapper(state) {
      return state
    },
  },
  actions: {
    loadMapping({ state, commit }, mapping) {
      commit('setMapping', mapping)
    },
    loadSimulationsSelected({ state, commit }, simulations) {
      commit('setSimulationsSelected', simulations)
    },

    prepareExport({ state, rootState, rootGetters, commit, dispatch }) {
      const prepared = []
      let isOK = true

      for (const sim of state.simulationsSelected) {
        // 1. Charger la simulation dans le module simulator
        dispatch('workspace/loadSimulator', sim, { root: true })

        try {
          dispatch('simulator/farm/setTotalAvailablePastureByPeriod', null, { root: true })
          dispatch('simulator/farm/dispatchProduction', null, { root: true })
        } catch (error) {
          isOK = false
        }

        const row = { simulation_name: sim.name }

        if (state.mapping?.fields) {
          const ctx = calculations.extractParams(rootState, rootGetters)

          state.mapping.fields.forEach((field) => {
            const calcName = field.value?.calc

            if (isOK && calcName && typeof calculations[calcName] === 'function') {
              try {
                const result = calculations[calcName](ctx)
                row[field.key] = result !== undefined ? result : ''
              } catch (err) {
                console.warn(`Erreur lors de l'exécution de ${calcName} sur ${sim.name}`, err)
                row[field.key] = ''
              }
            } else {
              console.warn(`Fonction de calcul inconnue ou invalide : "${calcName}"`)
              row[field.key] = ''
            }
          })
        }

        prepared.push(row)
      }

      return prepared
    },
  },
}
