// import axios from '@plugins/axios'
import Vue from 'vue'

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
      Vue.prototype.$axios.get('/authorizations').then((resp) => {
        commit('setAuthorizationList', resp.data)
      })
    },
    async updateUser({ commit }, user) {
      Vue.prototype
        .$axios({
          url: '/users/' + user.id,
          data: user,
          method: 'PUT',
        })
        .then((resp) => {
          //
        })
        .catch((err) => {
          console.error(err)
          throw err
        })
    },
  },
}
