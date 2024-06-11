<template>
  <div>
    <v-card>
      <graph-feeds-requirements :selected-lot="selectedLot" />
    </v-card>
    <v-card>
      <graph-coverage :selected-lot="selectedLot" />
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
  }
</script>
