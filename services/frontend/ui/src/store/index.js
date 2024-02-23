import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import simulator from './modules/simulator'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)', // TODO-FRONT rmv ? for vuetify theme
    drawer: null, // TODO-FRONT for vuetify theme
    status: '',
    token: localStorage.getItem('token') || '',
    user: {},
    dark: true,
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token, user) {
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload
    }, // for vuetify theme
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({
          url: process.env.VUE_APP_API_URL + '/auth/login',
          data: user,
          method: 'POST',
        })
          .then((resp) => {
            const token = resp.data.access_token
            const refreshToken = resp.data.refresh_token
            const user = resp.data.user
            localStorage.setItem('token', token)
            localStorage.setItem('refresh_token', refreshToken)
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', token, user)
            resolve(resp)
          })
          .catch((err) => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        delete axios.defaults.headers.common['Authorization']
        commit('auth_success', '', '')
        resolve()
      })
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
  },
  modules: {
    simulator,
  },
})
