import axios from 'axios'
import Vue from 'vue'
import { getCurrentDateTime } from '@/plugins/utils'

export default {
  namespaced: true,
  state: {
    lastConnectionDate: null,
    status: '',
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refresh_token') || '',
    user: {},
    isAdmin: false,
    logoutCanceled: false,
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token) {
      state.status = 'success'
      state.token = token
    },
    refresh_token_success(state, token) {
      state.status = 'success'
      state.token = token
      // state.refreshToken = refresh_token
    },
    auth_user(state, user) {
      state.status = 'success'
      state.user = user
      state.isAdmin = state.user.authorization !== undefined ? state.user.authorization.name === 'admin' : false
    },
    auth_error(state, message) {
      state.status = 'error'
      Vue.prototype.$toast({
        message: message,
        type: 'error',
        timeout: 5000,
      })
    },
    status_retry(state) {
      state.status = 'retry'
    },
    logout(state) {
      state.status = ''
      state.token = ''
      state.refreshToken = ''
      state.lastConnectionDate = getCurrentDateTime()
    },
    setLastConnectionDate(state) {
      state.lastConnectionDate = getCurrentDateTime()
    },
    setLogoutCanceled(state, canceling) {
      state.logoutCanceled = canceling
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
            Vue.prototype.$axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', token)
            resolve(resp)
          })
          .catch((err) => {
            commit('auth_error', err.response.data.message)
            localStorage.removeItem('token')
            localStorage.removeItem('refresh_token')
            delete Vue.prototype.$axios.defaults.headers.common['Authorization']
            reject(err)
          })
      })
    },
    refreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        Vue.prototype
          .$axios({
            url: '/auth/refresh',
            data: { refresh_token: state.refreshToken },
            method: 'POST',
          })
          .then((resp) => {
            const accessToken = resp.data.access_token
            const refreshToken = resp.data.refresh_token
            localStorage.setItem('token', accessToken)
            localStorage.setItem('refresh_token', refreshToken)

            Vue.prototype.$axios.defaults.headers.common['Authorization'] = accessToken
            commit('refresh_token_success', accessToken)
            resolve(resp)
          })
          .catch((err) => {
            commit('auth_error', err.response.data.message)
            localStorage.removeItem('token')
            localStorage.removeItem('refresh_token')
            reject(err)
          })
      })
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        delete Vue.prototype.$axios.defaults.headers.common['Authorization']
        commit('auth_success', '', '')
        resolve()
      })
    },
    fetchStatus({ commit, dispatch, state }) {
      Vue.prototype.$axios
        .get('/auth/status')
        .then((resp2) => {
          const user = resp2.data
          commit('auth_user', user)
        })
        .catch((err) => {
          if (err.response.status === 401) {
            dispatch('refreshToken')
            if (state.status === 'success') {
              // commit('status_retry')
              // dispatch('fetchStatus')
            } else {
              commit('auth_error', err.response.data.message)
            }
          }
        })
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    isAdmin: (state) => (state.user.authorization !== undefined ? state.user.authorization.name === 'admin' : false),
    getUser: (state) => state.user,
    isLogoutCanceled: (state) => state.logoutCanceled,
  },
}
