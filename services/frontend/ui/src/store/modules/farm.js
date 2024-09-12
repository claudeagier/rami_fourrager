import _ from 'lodash'
import { setTotalAvailablePasture, dispatchProduction } from './mixins'
export default {
  namespaced: true,
  state: {
    rotations: [
      // exemple de contenu de la rotation
      // {
      //   soil: 'code baguettes',
      //   name: 'nom de la baguette',
      //   constraint:'constraintSurfaces_key or null',
      //   surface: 15,
      //   production: [{ periods }],
      // },
    ],
    // production des patures vertes disponibles sur 28 j
    totalAvailablePastureByPeriod: null,

    dimensioning: {
      SAU: null,
      constrainedSurfaces: {
        irrigable: null,
        ploughable: null,
        superficial: null,
        reachable: null,
      },
    },
  },
  mutations: {
    setFarm(state, { rotations, dimensioning }) {
      state.rotations = rotations
      state.dimensioning = dimensioning
    },
    setSAU(state, SAU) {
      state.dimensioning.SAU = SAU
    },
    setIrrigable(state, irrigable) {
      state.dimensioning.constrainedSurfaces.irrigable = irrigable
    },
    setPloughable(state, ploughable) {
      state.dimensioning.constrainedSurfaces.ploughable = ploughable
    },
    setSuperficial(state, superficial) {
      state.dimensioning.constrainedSurfaces.superficial = superficial
    },
    setReachable(state, reachable) {
      state.dimensioning.constrainedSurfaces.reachable = reachable
    },
    setRotations(state, rotations) {
      state.rotations = rotations
    },
    setTotalAvailablePastureByPeriod(state, totalAvailablePastureByPeriod) {
      state.totalAvailablePastureByPeriod = totalAvailablePastureByPeriod
    },
    createRotation(state, rotation) {
      state.rotations.push(rotation)
      // mettre à jour la production des patures vertes disponibles
    },
    // partures vertes disponibles en kgMS/j

    updateRotation(state, { newRotation, oldRotation }) {
      const index = state.rotations.indexOf(oldRotation)
      state.rotations.splice(index, 1, newRotation)
      // mettre à jour les patures vertes disponibles
    },
    deleteRotation(state, rotation) {
      const index = state.rotations.indexOf(rotation)
      state.rotations.splice(index, 1)
      // mettre à jour les patures vertes disponibles
    },
  },
  getters: {
    dimensioning: (state) => state.dimensioning,
    rotations: (state) => state.rotations,
    totalSurfaces: (state) => {
      return Object.values(state.rotations).reduce((acc, curr) => {
        const intValue = parseInt(curr.surface, 10)
        return acc + (isNaN(intValue) ? 0 : intValue)
      }, 0)
    },
    totalConstrainedSurfaces: (state) => {
      return Object.values(state.dimensioning.constrainedSurfaces).reduce((acc, curr) => {
        const intValue = parseInt(curr, 10)
        return acc + (isNaN(intValue) ? 0 : intValue)
      }, 0)
    },
    validateRotation:
      (state, getters) =>
      (item, old = null) => {
        if (item.surface !== null) {
          const isTotalSurfacesValid =
            getters.totalSurfaces + parseInt(item.surface) - (old === null ? 0 : parseInt(old.surface)) <=
            parseInt(state.dimensioning.SAU)
          if (item.constraint) {
            const totalConstrainedSurfaces = Object.values(state.rotations).reduce((acc, curr) => {
              if (curr.constraint?.name === item.constraint.name) {
                const intValue = parseInt(curr.surface, 10)
                return acc + (isNaN(intValue) ? 0 : intValue)
              } else {
                return acc
              }
            }, 0)

            const isConstrainedSurfaceValid =
              totalConstrainedSurfaces + parseInt(item.surface) - (old === null ? 0 : parseInt(old.surface)) <=
              parseInt(state.dimensioning.constrainedSurfaces[item.constraint.name])

            return isConstrainedSurfaceValid && isTotalSurfacesValid
          } else {
            return isTotalSurfacesValid
          }
        } else {
          return true
        }
      },

    validateSurface: (state, getters) => {
      return getters.totalConstrainedSurfaces <= state.dimensioning.SAU
    },
    getAvailablePasture: (state) => {
      const arr = state.totalAvailablePastureByPeriod
      if (arr === null) {
        return Array.from({ length: 13 }, () => 0)
      }
      return Array.from(Object.values(arr), (el) => _.round(el.production_total))
    },
  },
  actions: {
    initializeRotations({ commit }) {
      commit('setRotations', [])
    },
    applyToWorkspace({ state, commit }) {
      commit(
        'workspace/updateSimulation',
        { key: 'farm', value: { rotations: state.rotations, dimensioning: state.dimensioning } },
        { root: true }
      )
    },
    setTotalAvailablePastureByPeriod({ state, rootState, commit, rootGetters }) {
      const totalAvailablePastureByPeriod = setTotalAvailablePasture(state, rootState, rootGetters)
      commit('setTotalAvailablePastureByPeriod', totalAvailablePastureByPeriod)
    },
    dispatchProduction({ state, rootState, commit, rootGetters }) {
      const production = dispatchProduction(state, rootState, rootGetters)
      commit('simulator/barn/setTotalStock', production.totalBarnStock, { root: true })
      commit('simulator/barn/setTotalStrawStockProducted', production.totalStrawStock, { root: true })
      commit('simulator/barn/setStockByPeriod', production.barnStockByPeriod, { root: true })
    },
  },
}
