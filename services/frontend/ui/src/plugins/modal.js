import Vue from 'vue'
import VModal from 'vue-js-modal'
// import VModal from 'vue-js-modal/dist/index.nocss.js'
import 'vue-js-modal/dist/styles.css'

Vue.use(VModal, {
  // dialog: true,
  dynamicDefaults: {
    draggable: true,
    resizable: true,
  },
})
