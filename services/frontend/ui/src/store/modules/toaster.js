export default {
  namespaced: true,
  state: {
    notifications: [],
  },
  mutations: {
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push(notification)
    },
    REMOVE_NOTIFICATION(state, index) {
      state.notifications.splice(index, 1)
    },
  },
  actions: {
    addNotification({ commit }, notification) {
      commit('ADD_NOTIFICATION', notification)
    },
    removeNotification({ commit }, index) {
      commit('REMOVE_NOTIFICATION', index)
    },
  },
}
