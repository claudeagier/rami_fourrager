export default {
  namespaced: true,
  state: {
    batchs: [],
  },
  mutations: {
    setBatchs(state, batchs) {
      state.batchs = batchs
    },
    addBatch(state, batch) {
      state.batchs.push(batch)
    },
    updateBatch(state, { newBatch, oldBatch }) {
      const index = state.batchs.indexOf(oldBatch)
      state.batchs.splice(index, 1, newBatch)
    },
    deleteBatch(state, batch) {
      const index = state.batchs.indexOf(batch)
      state.batchs.splice(index, 1)
    },

    // batch details
    setBatchType(state, { batchId, value }) {
      state.batchs[batchId].type = value
    },
    setBatchProfil(state, { batchId, value }) {
      state.batchs[batchId].profil = value
    },
    setBatchCount(state, { batchId, value }) {
      state.batchs[batchId].count = value
    },
    setBatchHousingType(state, { batchId, value }) {
      state.batchs[batchId].housing.type = value
    },

    // housing details
    setHousingAnimalCountByPeriod(state, { batchId, periodId, value }) {
      state.batchs[batchId].housing.presence[periodId].animalCount = value
    },
    setHousingDaysByPeriod(state, { batchId, periodId, value }) {
      state.batchs[batchId].housing.presence[periodId].days = value
    },
    // classic feeds
    createClassicFeed(state, { batchId, periodId, newFeed }) {
      state.batchs[batchId].classicFeeds[periodId].feeds.push(newFeed)
    },
    updateClassicFeed(state, { batchId, periodId, newFeed, oldFeed }) {
      const feedIndex = state.batchs[batchId].classicFeeds[periodId].feeds.indexOf(oldFeed)
      state.batchs[batchId].classicFeeds[periodId].feeds.splice(feedIndex, 1, newFeed)
    },
    deleteClassicFeed(state, { batchId, periodId, feed }) {
      const feedIndex = state.batchs[batchId].classicFeeds[periodId].feeds.indexOf(feed)
      state.batchs[batchId].classicFeeds[periodId].feeds.splice(feedIndex, 1)
    },

    // concentrated feeds
    createConcentratedFeed(state, { batchId, periodId, newFeed }) {
      state.batchs[batchId].concentratedFeeds[periodId].feeds.push(newFeed)
    },
    updateConcentratedFeed(state, { batchId, periodId, newFeed, oldFeed }) {
      const feedIndex = state.batchs[batchId].concentratedFeeds[periodId].feeds.indexOf(oldFeed)
      state.batchs[batchId].concentratedFeeds[periodId].feeds.splice(feedIndex, 1, newFeed)
    },
    deleteConcentratedFeed(state, { batchId, periodId, feed }) {
      const feedIndex = state.batchs[batchId].concentratedFeeds[periodId].feeds.indexOf(feed)
      state.batchs[batchId].concentratedFeeds[periodId].feeds.splice(feedIndex, 1)
    },
  },
  getters: {
    getBatch: (state) => (batchId) => {
      return state.batchs[batchId]
    },
    getHousingDetailByPeriod: (state) => (batchId, periodId) => {
      return state.batchs[batchId].housing.presence[periodId]
    },
    getClassiqueFeedByPeriod:
      (state) =>
      (batchId, periodId, feed = null) => {
        if (feed != null) {
          const feedIndex = state.batchs[batchId].classicFeeds[periodId].feeds.indexOf(feed)
          return state.batchs[batchId].classicFeeds[periodId].feeds[feedIndex]
        } else {
          return {
            type: null,
            proportion: null,
          }
        }
      },
  },
}
