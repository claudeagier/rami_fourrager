import axios from 'axios'
import localForage from 'localforage'

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
}
