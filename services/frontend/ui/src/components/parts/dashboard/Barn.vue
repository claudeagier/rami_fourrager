<template>
  <base-material-card
    color="brown"
    min-height="130"
  >
    <template v-slot:heading>
      <v-row>
        <v-col>
          <div class="text-h3 font-weight-light">{{ $t('barn.title') }}</div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <div>
            <v-btn
              class="ml-2"
              color="brown"
              style="background-color: white"
              outlined
              min-width="0"
              to="/simulation/barn"
            >
              {{ $t('btn.complete') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:content>
      <v-row>
        <stock-graph
          :withLegend="false"
          :xAxisLabelRotate="true"
          :withTitle="true"
          :title="$t('report.main.modules.stockNcost.stockGraph.title')"
        />
      </v-row>
    </template>
  </base-material-card>
</template>
<script>
  import StockGraph from '@/components/parts/barn/StockGraph.vue'
  export default {
    name: 'barn-dashboard',
    components: {
      StockGraph,
    },
    data() {
      return {}
    },
  }
</script>
<style>
  .barn-chart-container {
    display: flex; /* Utilise flexbox pour la mise en page */
    justify-content: center; /* Centrer le contenu horizontalement */
    align-items: center; /* Centrer le contenu verticalement */
    position: relative; /* Positionnement relatif pour des ajustements plus fins si nécessaire */
  }
</style>
