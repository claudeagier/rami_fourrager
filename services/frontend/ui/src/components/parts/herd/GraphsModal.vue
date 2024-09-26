<template>
  <v-btn
    :color="pageColor"
    outlined
    small
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
    watch: {
      selectedLot: {
        immediate: true,
        handler(newValue, oldValue) {
          this.selectedLot = newValue
        },
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
