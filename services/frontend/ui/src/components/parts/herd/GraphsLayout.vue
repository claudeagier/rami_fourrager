<template>
  <div>
    <v-card>
      <graph-feeds-requirements
        :selected-lot="selectedLot"
        :withTitle="true"
        :title="$t('herd.details.graph.title')"
      />
    </v-card>
    <v-card>
      <graph-coverage
        :selected-lot="selectedLot"
        :stand-alone="true"
        :selection="selectedPeriodIndex"
        :title="$t('herd.concentratedfeed.graph.title')"
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
  }
</script>
