<template>
  <v-btn
    :color="pageColor"
    outlined
    @click="dynamic"
  >
    {{ $t('herd.details.graph.btn') }}
  </v-btn>
</template>
<script>
  import CustomModal from '@/components/base/CustomModal.vue'
  import GraphsLayout from './GraphsLayout.vue'
  import VTitle from './VTitle.vue'

  export default {
    name: 'GraphsModal',
    props: {
      selectedLot: {
        type: null,
        required: true,
      },
      pageColor: {
        type: String,
        required: true,
      },
    },
    methods: {
      dynamic() {
        this.$vfm.show({
          component: CustomModal,
          bind: {
            name: 'VDynamicAdvancedModal',
            hideOverlay: true,
            clickToClose: false,
            resize: true,
            drag: true,
            preventClick: true,
          },
          // on: {
          //   // event by custom-modal
          //   confirm(close) {
          //     console.log('confirm')
          //     close()
          //   },
          //   cancel(close) {
          //     console.log('cancel')
          //     close()
          //   },
          //   // event by vue-final-modal
          //   'click-outside'() {
          //     console.log('@click-outside')
          //   },
          //   'before-open'() {
          //     console.log('@before-open')
          //   },
          //   opened() {
          //     console.log('@opened')
          //   },
          //   'before-close'() {
          //     console.log('@before-close')
          //   },
          //   closed() {
          //     console.log('@closed')
          //   },
          // },
          slots: {
            title: {
              component: VTitle,
              bind: {
                text: {
                  key: 'herd.details.modal.title',
                  params: { batch: this.selectedLot + 1 },
                },
              },
            },
            default: {
              component: GraphsLayout,
              bind: {
                selectedLot: this.selectedLot,
                pageColor: this.pageColor,
              },
            },
          },
        })
      },
    },
  }
</script>
