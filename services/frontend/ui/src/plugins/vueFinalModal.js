import Vue from 'vue'
import { vfmPlugin } from 'vue-final-modal'

Vue.use(
  vfmPlugin({
    key: '$vfm',
    componentName: 'VueFinalModal',
    dynamicContainerName: 'ModalsContainer',
  })
)
