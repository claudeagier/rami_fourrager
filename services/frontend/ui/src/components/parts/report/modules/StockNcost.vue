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
          <!-- <v-card-title class="text-h4 font-weight-light">Evolution des stocks</v-card-title> -->
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
        <!-- faire un composant tableau et je fais un tableau par groupe de valeurs
              1.fourrages
              2.cultures
              3.pailles
           -->
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
      return {
        stockData: [
          {
            groupName: 'fourrage',
            name: 'stock 1',
            initialStock: 25,
            production: 30.2,
            consommation: 22,
            finalStock: 56,
            final_initialStock: 12.2,
            purchase: 5,
            purchaseCost: 0,
            sold: 0,
            purchaseSold: 0,
            productionCost: 0,
            total: 1,
          },
          {
            groupName: 'fourrage',
            name: 'stock 2',
            initialStock: 25,
            production: 30.2,
            consommation: 22,
            finalStock: 56,
            final_initialStock: 12.2,
            purchase: 5,
            purchaseCost: 0,
            sold: 0,
            purchaseSold: 0,
            productionCost: 0,
            total: 2,
          },
          {
            groupName: 'cultures',
            name: 'stock 3',
            initialStock: 25,
            production: 30.2,
            consommation: 22,
            finalStock: 56,
            final_initialStock: 12.2,
            purchase: 5,
            purchaseCost: 0,
            sold: 0,
            purchaseSold: 0,
            productionCost: 0,
            total: 5,
          },
          {
            groupName: 'cultures',
            name: 'stock 4',
            initialStock: 25,
            production: 30.2,
            consommation: 22,
            finalStock: 56,
            final_initialStock: 12.2,
            purchase: 5,
            purchaseCost: 0,
            sold: 0,
            purchaseSold: 0,
            productionCost: 0,
            total: 5,
          },
          {
            groupName: 'paille',
            name: 'stock 5',
            initialStock: 25,
            production: 30.2,
            consommation: 22,
            finalStock: 56,
            final_initialStock: 12.2,
            purchase: 5,
            purchaseCost: 0,
            sold: 0,
            purchaseSold: 0,
            productionCost: 0,
            total: 5,
          },
        ],
      }
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
        // Mettre à jour la bonne entrée dans stockData en fonction de l'élément modifié
        const index = this.stockData.findIndex((item) => item.name === updatedItem.name)
        if (index !== -1) {
          this.$set(this.stockData, index, updatedItem)
        }
      },
    },
  }
</script>
