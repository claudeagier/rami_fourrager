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
      withYaxis: {
        type: Boolean,
        default: true,
      },
      withTitle: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
      withToolBox: {
        type: Boolean,
        default: true,
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
          this.$t('periods.graph.start'),
          this.$t('periods.graph.P1'),
          this.$t('periods.graph.P2'),
          this.$t('periods.graph.P3'),
          this.$t('periods.graph.P4'),
          this.$t('periods.graph.P5'),
          this.$t('periods.graph.P6'),
          this.$t('periods.graph.P7'),
          this.$t('periods.graph.P8'),
          this.$t('periods.graph.P9'),
          this.$t('periods.graph.P10'),
          this.$t('periods.graph.P11'),
          this.$t('periods.graph.P12'),
          this.$t('periods.graph.end'),
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
            appendToBody: true,
            hideDelay: 50,
            enterable: true,
          },
          toolbox: {
            show: this.withToolBox,
            feature: {
              saveAsImage: {
                name: 'stock_grange',
                backgroundColor: 'white',
              },
            },
          },
          grid: {
            left: this.withLegend ? '3%' : '0%',
            right: this.withLegend ? '30%' : '3%',
            bottom: '15%',
            containLabel: true,
          },
          yAxis: {
            type: 'value',
            show: this.withYaxis,
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
    page-break-inside: avoid;
  }
</style>
