<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        class="pt-0 pb-0"
      >
        <v-card
          outlined
          elevation="2"
        >
          <v-card-title class="text-h4 font-weight-light">Evolution des stocks</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <stock-graph />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="pt-0 pb-0"
      >
        <v-card
          outlined
          elevation="2"
        >
          <v-card-title class="text-h4 font-weight-light">Les couts</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list dense> </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import { mapGetters } from 'vuex'

  import StockGraph from '@/components/parts/barn/StockGraph.vue'

  export default {
    components: {
      StockGraph,
    },
    computed: {
      ...mapGetters(['nameOfGetter']),
    },
  }
</script>
