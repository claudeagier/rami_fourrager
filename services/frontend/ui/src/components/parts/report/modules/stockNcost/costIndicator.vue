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
  import CustomModal from '@/components/base/CustomModal.vue'
  import CostIndicatorModal from '@components/parts/report/modules/stockNcost/CostIndicatorModal'

  export default {
    name: 'cost-indicator',
    props: {
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
          slots: {
            default: {
              component: CostIndicatorModal,
              bind: {
                pageColor: this.pageColor,
              },
            },
          },
        })
      },
    },
  }
</script>
