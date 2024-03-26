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
    createRotation(state, rotation) {
      state.rotations.push(rotation)
    },
    updateRotation(state, { newRotation, oldRotation }) {
      const index = state.rotations.indexOf(oldRotation)
      state.rotations.splice(index, 1, newRotation)
    },
    deleteRotation(state, rotation) {
      const index = state.rotations.indexOf(rotation)
      state.rotations.splice(index, 1)
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
  },
}
