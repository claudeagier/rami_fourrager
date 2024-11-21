import { EventBus } from './eventBus.js'
import store from '@store'

EventBus.$on('update-store', (payload) => {
  store.commit(payload.key, payload.value)
})
