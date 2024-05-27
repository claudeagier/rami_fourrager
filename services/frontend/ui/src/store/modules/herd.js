import _ from 'lodash'
import mixins from './mixins'
import { deepEqual } from '../../plugins/utils'

export default {
  namespaced: true,
  state: {
    batchs: [],
  },

  mutations: {
    setHerd(state, { batchs }) {
      state.batchs = batchs
    },
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
    setBatchProfile(state, { batchId, value }) {
      state.batchs[batchId].profile = value
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
    duplicatePresenceByPeriod(state, { batchId, source, targets }) {
      const sourcePresence = state.batchs[batchId].housing.presence.find((element) => element.period.id === source.id)
      targets.forEach((target) => {
        var el = state.batchs[batchId].housing.presence.find((element) => element.period.id === target.id)
        el.animalCount = sourcePresence.animalCount
        el.days = sourcePresence.days
      })
    },

    // classic feeds
    createClassicFeed(state, { batchId, periodId, newFeed }) {
      state.batchs[batchId].classicFeeds[periodId].feeds.push(newFeed)
    },

    updateClassicFeed(state, { batchId, periodId, newFeed, oldFeed }) {
      const classicFeeds = state.batchs[batchId].classicFeeds[periodId].feeds
      const feedIndex = classicFeeds.findIndex((feed) => deepEqual(feed, oldFeed))
      if (feedIndex > -1) {
        classicFeeds.splice(feedIndex, 1, newFeed)
      }
    },
    deleteClassicFeed(state, { batchId, periodId, feed }) {
      const feedIndex = state.batchs[batchId].classicFeeds[periodId].feeds.indexOf(feed)
      state.batchs[batchId].classicFeeds[periodId].feeds.splice(feedIndex, 1)
    },
    duplicateClassicFeedsByPeriod(state, { batchId, source, targets }) {
      const sourceFeeds = state.batchs[batchId].classicFeeds.find((element) => element.period.id === source.id).feeds
      targets.forEach((target) => {
        state.batchs[batchId].classicFeeds.find((element) => element.period.id === target.id).feeds = [...sourceFeeds]
      })
    },

    // concentrated feeds
    createConcentratedFeed(state, { batchId, periodId, newFeed }) {
      state.batchs[batchId].concentratedFeeds[periodId].feeds.push(newFeed)
    },
    updateConcentratedFeed(state, { batchId, periodId, newFeed, oldFeed }) {
      const concentratedFeeds = state.batchs[batchId].concentratedFeeds[periodId].feeds
      const feedIndex = concentratedFeeds.findIndex((feed) => mixins.deepEqual(feed, oldFeed))
      if (feedIndex > -1) {
        concentratedFeeds.splice(feedIndex, 1, newFeed)
      }
    },
    deleteConcentratedFeed(state, { batchId, periodId, feed }) {
      const feedIndex = state.batchs[batchId].concentratedFeeds[periodId].feeds.indexOf(feed)
      state.batchs[batchId].concentratedFeeds[periodId].feeds.splice(feedIndex, 1)
    },
    duplicateConcentratedFeedsByPeriod(state, { batchId, source, targets }) {
      const sourceFeeds = state.batchs[batchId].concentratedFeeds.find(
        (element) => element.period.id === source.id
      ).feeds
      targets.forEach((target) => {
        state.batchs[batchId].concentratedFeeds.find((element) => element.period.id === target.id).feeds = [
          ...sourceFeeds,
        ]
      })
    },
  },
  getters: {
    getBatch: (state) => (batchId) => {
      return state.batchs[batchId]
    },
    getHousingDetailByPeriod: (state) => (batchId, periodId) => {
      return state.batchs[batchId].housing.presence[periodId]
    },
    getClassicFeedByPeriod:
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

    // Couverture des besoins énergétiques /animal UFL estimé pour l’ensemble des rations saisie pour un animal
    getEnergeticCoverageByBatch: (state, getters, rootState) => (batchId) => {
      return mixins.getEnergeticCoverage(state, rootState, batchId)
    },

    getProteicCoverageByBatch: (state, getters, rootState) => (batchId) => {
      return mixins.getProteicCoverage(state, rootState, batchId)
    },
    getDryMatterProvided: (state, getters, rootState) => (batchId) => {
      return mixins.getDryMatterProvided(state, rootState, batchId)
    },
  },
}
