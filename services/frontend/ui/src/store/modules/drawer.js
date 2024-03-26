export default {
  namespaced: true,
  state: {
    show: null,
  },
  mutations: {
    SET_DRAWER(state, payload) {
      state.show = payload
    },
  },
}
