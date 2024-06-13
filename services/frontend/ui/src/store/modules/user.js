import axios from '@plugins/axios'

export default {
  namespaced: true,
  state: {
    authorizations: [],
  },
  mutations: {
    setAuthorizationList(state, list) {
      state.authorizations = list
    },
  },
  actions: {
    fetchAuthorizationList({ commit }) {
      axios.get('/authorizations').then((resp) => {
        commit('setAuthorizationList', resp.data)
      })
    },
  },
}
