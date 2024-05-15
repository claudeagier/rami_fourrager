export default {
  name: '',
  site: null,
  climaticYear: null,
  lastModifiedDate: '',
  loaded: false,
  farm: {
    rotations: [],
    totalAvailablePastureByPeriod: null,
    dimensioning: {
      SAU: null,
      constrainedSurfaces: { irrigable: null, ploughable: null, superficial: null, reachable: null },
    },
  },
  barn: {
    initialStock: [],
  },
  herd: {
    batchs: [],
  },
}
