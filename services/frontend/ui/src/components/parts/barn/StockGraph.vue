<template>
  <div
    class=".stock-chart-container"
    style="width: 100%; height: 200px"
  >
    <v-chart
      class="stock-chart"
      :option="options"
      autoresize
      theme="infographic"
      :init-options="initOptions"
    />
  </div>
</template>
<script>
  // TODO gérer la légende pour l'affichage dans dashboard/farm et titre du grpah
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {}
    },
    computed: {
      ...mapGetters('simulator/report', {
        stocks: 'getStockEvolution',
      }),
      initOptions() {
        return { width: 'auto', height: 'auto' }
      },
      options() {
        const periods = ['initial', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'fin']
        const colors = {
          P: '#00CC00',
          STRAW: '#FFF59D',
          FH: '#009933',
          EH: '#00FF00',
          EM: 'orange',
          RC: '',
          RP: '',
          AS: '#E5E8E8',
          EL: '#CC6666',
          FL: '#FF66FF',
        }
        var stockEvolutionPerFeedSeries = []
        this.stocks.forEach((stock) => {
          // si somme de stock.data = 0 alors on push pas
          const s = Object.values(stock.data).reduce((acc, curr) => {
            return acc + curr
          }, 0.0)
          if (s > 0) {
            stockEvolutionPerFeedSeries.push({
              name: stock.name,
              type: 'bar',
              stack: 'total',
              label: {
                show: false,
              },
              tooltip: {
                valueFormatter: function (value) {
                  return value + ' kgMS'
                },
              },
              data: stock.data,
              itemStyle: { color: colors[stock.code] },
            })
          }
        })
        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
            triggerOn: 'click',
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                backgroundColor: 'white',
              },
            },
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 'right',
            top: 'middle',
          },
          grid: {
            left: '3%',
            right: '30%',
            bottom: '3%',
            containLabel: true,
          },
          yAxis: {
            type: 'value',
          },
          xAxis: {
            type: 'category',
            data: periods,
            axisTick: {
              alignWithLabel: true,
            },
          },
          series: stockEvolutionPerFeedSeries,
        }
      },
    },
  }
</script>
<style>
  .stock-chart-container {
    display: flex; /* Utilise flexbox pour la mise en page */
    justify-content: center; /* Centrer le contenu horizontalement */
    align-items: center; /* Centrer le contenu verticalement */
    position: relative; /* Positionnement relatif pour des ajustements plus fins si nécessaire */
  }
</style>
