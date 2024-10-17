<template>
  <div
    class=".barn-chart-container"
    style="width: 100%; height: 200px"
  >
    <v-chart
      class="barn-chart"
      :option="options"
      autoresize
      theme="infographic"
      :init-options="initOptions"
    />
  </div>
</template>
<script>
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
        var stockEvolutionPerFeedSeries = Object.values(this.stocks).map((stock) => {
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

          return {
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
          }
        })

        if (this.stocks) {
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
                // dataZoom: {
                //   yAxisIndex: 'none',
                // },
                // dataView: { readOnly: false },
                // magicType: { type: ['line', 'bar'] },
                // restore: {},
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
            title: {
              text: this.$t('report.main.modules.stockNcost.stockGraph.title'),
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
        } else {
          return 'No data'
        }
      },
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
