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
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {}
    },
    props: {
      withLegend: {
        type: Boolean,
        default: true,
      },
      xAxisLabelRotate: {
        type: Boolean,
        default: false,
      },
      withTitle: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
    },
    computed: {
      ...mapGetters('simulator/report', {
        stocks: 'getStockEvolution',
      }),
      initOptions() {
        return { width: 'auto', height: 'auto' }
      },
      options() {
        const periods = [
          this.$t('report.main.modules.stockNcost.stockGraph.periods.start'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P1'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P2'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P3'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P4'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P5'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P6'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P7'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P8'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P9'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P10'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P11'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.P12'),
          this.$t('report.main.modules.stockNcost.stockGraph.periods.end'),
        ]
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
          const unity = this.$t('report.main.modules.stockNcost.stockGraph.unity')
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
                  return value + ' ' + unity
                },
              },
              data: stock.data,
              itemStyle: { color: colors[stock.code] },
            })
          }
        })
        const options = {
          title: {
            show: this.withTitle,
            text: this.title,
          },
          legend: {
            show: this.withLegend,
            type: 'scroll',
            orient: 'vertical',
            right: 'right',
            top: 'middle',
          },
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
          grid: {
            left: this.withLegend ? '3%' : '0%',
            right: this.withLegend ? '30%' : '3%',
            bottom: '3%',
            containLabel: true,
          },
          yAxis: {
            type: 'value',
            show: this.withLegend,
          },
          xAxis: {
            type: 'category',
            data: periods,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: this.xAxisLabelRotate ? '45' : '0',
            },
          },
          series: stockEvolutionPerFeedSeries,
        }
        return options
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
