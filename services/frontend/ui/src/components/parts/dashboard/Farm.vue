<template>
  <base-material-card
    color="green"
    min-height="130"
  >
    <template v-slot:heading>
      <v-row>
        <v-col>
          <div class="text-h3 font-weight-light">{{ $t('farm.title') }}</div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <div>
            <v-btn
              class="ml-2"
              color="green"
              style="background-color: white"
              outlined
              min-width="0"
              to="/simulation/farm"
            >
              {{ $t('btn.complete') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:content>
      <v-row>
        <!-- <rotation-graph /> -->
        <rotation-graph-treemap />
      </v-row>
    </template>
  </base-material-card>
</template>
<script>
  // import RotationGraph from '../farm/RotationGraph.vue'
  import RotationGraphTreemap from '../farm/RotationGraphTreemap.vue'

  // TODO le graphique de l'assolement
  export default {
    name: 'farm-dashboard',
    components: {
      // RotationGraph,
      RotationGraphTreemap,
    },
    data() {
      return {}
    },
  }
</script>
<style>
  .farm-chart-container {
    display: flex; /* Utilise flexbox pour la mise en page */
    justify-content: center; /* Centrer le contenu horizontalement */
    align-items: center; /* Centrer le contenu verticalement */
    position: relative; /* Positionnement relatif pour des ajustements plus fins si nécessaire */
  }
</style>
