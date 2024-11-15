<template>
  <v-btn
    :color="pageColor"
    outlined
    class="text-h6"
    @click="dynamic"
  >
    {{ $t('report.main.modules.stockNcost.stockTable.costIndicator.btnShow') }}
  </v-btn>
</template>
<script>
  import VTitle from '@/components/base/VTitle.vue'
  import CustomModal from '@/components/base/CustomModal.vue'
  import CostIndicatorModal from '@components/parts/report/modules/stockNcost/CostIndicatorModal'

  export default {
    name: 'cost-indicator',
    props: {
      // selectedLot: {
      //   type: null,
      //   required: true,
      // },
      pageColor: {
        type: String,
        required: true,
      },
    },
    watch: {
      // selectedLot: {
      //   immediate: true,
      //   handler(newValue, oldValue) {
      //     this.selectedLot = newValue
      //   },
      // },
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
                  key: 'report.main.modules.stockNcost.stockTable.costIndicator.modal.title',
                  // params: { batch: this.selectedLot + 1 },
                },
              },
            },
            default: {
              component: CostIndicatorModal,
              bind: {
                // selectedLot: this.selectedLot,
                pageColor: this.pageColor,
              },
            },
          },
        })
      },
    },
  }
</script>
