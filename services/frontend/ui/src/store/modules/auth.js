import axios from 'axios'
import api from '@/plugins/axios'
import Vue from 'vue'

function getCurrentDateTime() {
  var now = new Date()
  var year = now.getFullYear()
  var month = ('0' + (now.getMonth() + 1)).slice(-2) // Les mois sont 0-indexés, donc on ajoute 1
  var day = ('0' + now.getDate()).slice(-2)
  var hours = ('0' + now.getHours()).slice(-2)
  var minutes = ('0' + now.getMinutes()).slice(-2)
  var seconds = ('0' + now.getSeconds()).slice(-2)
  var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  return formattedDateTime
}

export default {
  namespaced: true,
  state: {
    lastConnectionDate: null,
    status: '',
    token: localStorage.getItem('token') || '',
    user: {},
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token) {
      state.status = 'success'
      state.token = token
    },
    auth_user(state, user) {
      state.user = user
    },
    auth_error(state, message) {
      state.status = 'error'
      Vue.prototype.$toast({
        message: message,
        type: 'error',
        timeout: 5000,
      })
    },
    logout(state) {
      state.status = ''
      state.token = ''

      state.lastConnectionDate = getCurrentDateTime()
    },
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

            localStorage.setItem('token', token)
            localStorage.setItem('refresh_token', refreshToken)
            axios.defaults.headers.common['Authorization'] = token
            // // getStatus

            commit('auth_success', token)
            resolve(resp)
          })
          .catch((err) => {
            commit('auth_error', err.response.data.message)
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
    fetchStatus({ commit }) {
      api
        .get('/auth/status')
        .then((resp2) => {
          const user = resp2.data
          commit('auth_user', user)
        })
        .catch((err) => {
          console.error(err)
          commit('auth_error', err.response.data.message)
        })
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    isAdmin: (state) => {
      return state.user.authorization === 'admin'
    },
  },
}
