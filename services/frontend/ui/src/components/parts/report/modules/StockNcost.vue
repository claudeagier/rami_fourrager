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
          <v-card-title class="text-h4 font-weight-light">
            {{ $t('report.main.modules.stockNcost.stockGraph.title') }}
          </v-card-title>
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
        <stock-table
          :title="'Les coûts'"
          :datas="groupedStocks"
          @update-stock="handleStockUpdate"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  // TODO traduction
  import StockGraph from '@/components/parts/barn/StockGraph.vue'
  import StockTable from '@/components/parts/barn/StockTable.vue'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      StockGraph,
      StockTable,
    },
    props: {
      data: {
        type: Object,
      },
    },

    created() {},
    data() {
      return {}
    },
    computed: {
      ...mapGetters('simulator/report', {
        pastureStock: 'getPastureStock',
        feedStocks: 'getClassicFeedsStock',
        concentratedStock: 'getConcentratedFeedsStock',
        strawStock: 'getStrawStock',
      }),
      groupedStocks() {
        return [...this.pastureStock, ...this.feedStocks, ...this.concentratedStock, ...this.strawStock]
      },
    },
    methods: {
      handleStockUpdate(updatedItem) {
        this.$store.commit('simulator/report/setSoldedStock', updatedItem)
      },
    },
  }
</script>
