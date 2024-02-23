// src/utils/axios.js
import axios from 'axios'
import store from '../store' // Suppose you have a Vuex store for managing state

// Set the base URL for your API
axios.defaults.baseURL = process.env.VUE_APP_API_URL

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Get the token from the store
    const token = store.state.token

    // If a token exists, set it in the request header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

export default axios
