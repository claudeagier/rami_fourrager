<template>
  <div>
    <v-card>
      <graph-feeds-requirements
        :selected-lot="selectedLot"
        @click="handleRequirementsClick"
      />
    </v-card>
    <v-card>
      <graph-coverage
        :selected-lot="selectedLot"
        :stand-alone="true"
        :selection="selectedPeriodIndex"
      />
    </v-card>
  </div>
</template>

<script>
  import GraphCoverage from './GraphCoverage.vue'
  import GraphFeedsRequirements from './GraphFeedsRequirements.vue'

  export default {
    name: 'GraphsLayout',
    components: {
      GraphFeedsRequirements,
      GraphCoverage,
    },
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
    data() {
      return {
        selectedPeriodIndex: null,
      }
    },
    methods: {
      handleRequirementsClick(params) {
        this.selectedPeriodIndex = params.dataIndex
      },
    },
  }
</script>
