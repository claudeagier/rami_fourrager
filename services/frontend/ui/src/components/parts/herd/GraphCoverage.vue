<template>
  <div>
    <div
      v-if="!standAlone"
      class="text-6 font-weight-medium"
    >
      {{ $t('herd.classicfeed.graph.title') }}
    </div>
    <v-chart
      ref="coverageChart"
      :class="small ? 'coverage-chart-small' : 'coverage-chart'"
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
    name: 'coverageGraph',
    props: {
      selectedLot: {
        type: null,
        required: true,
      },
      selection: {
        type: null,
      },
      standAlone: {
        type: Boolean,
      },
      small: {
        type: Boolean,
      },
    },
    watch: {
      selection: {
        handler(newValue, oldValue) {
          if (oldValue != null) {
            const ov = oldValue + 1
            this.$refs.coverageChart.dispatchAction({
              type: 'downplay',
              seriesName: 'proteicCoverage',
              name: 'P' + ov,
            })
            this.$refs.coverageChart.dispatchAction({
              type: 'downplay',
              seriesName: 'energeticCoverage',
              name: 'P' + ov,
            })
          }
          if (newValue != null) {
            const nv = newValue + 1
            this.$refs.coverageChart.dispatchAction({
              type: 'highlight',
              seriesName: 'proteicCoverage',
              name: 'P' + nv,
            })
            this.$refs.coverageChart.dispatchAction({
              type: 'highlight',
              seriesName: 'energeticCoverage',
              name: 'P' + nv,
            })
          }
        },
      },
    },
    created() {},
    computed: {
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
      ...mapGetters('simulator/herd', {
        getFinalEnergeticCoverageByBatch: 'getFinalEnergeticCoverageByBatch',
        getFinalProteicCoverageByBatch: 'getFinalProteicCoverageByBatch',
      }),
      initOptions() {
        return { width: 'auto', height: 150 }
      },
      options() {
        // const periods = this.periods
        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']

        const rows = [this.$t('herd.concentratedfeed.graph.proteic'), this.$t('herd.concentratedfeed.graph.energetic')]
        const energeticCoverage = this.getFinalEnergeticCoverageByBatch(this.selectedLot)
        const proteicCoverage = this.getFinalProteicCoverageByBatch(this.selectedLot)

        const dataEnergeticCoverage = []
        const dataProteicCoverage = []
        for (let i = 0; i < energeticCoverage.length; i++) {
          dataEnergeticCoverage.push([i, 1, energeticCoverage[i] || '-'])
          dataProteicCoverage.push([i, 0, proteicCoverage[i] || '-'])
        }
        const options = {
          grid: {
            height: '50%',
            top: '10%',
            left: '20%',
            right: '10%',
          },
          tooltip: {
            show: false,
            position: 'top',
          },
          xAxis: {
            type: 'category',
            data: periods,
            axisTick: {
              show: false,
            },
            splitArea: {
              show: true,
            },
          },
          yAxis: {
            type: 'category',
            data: rows,
            axisTick: {
              show: false,
            },
            splitArea: {
              show: true,
            },
            position: 'left',
          },

          visualMap: {
            show: false,
            min: 0,
            max: 100,
            calculable: true,
            type: 'piecewise',
            pieces: [
              { min: 0, max: 98.999, color: 'red' },
              { min: 99, max: 119.999, color: 'green' },
              { min: 120, max: 139.999, color: 'orange' },
              { min: 140, color: 'red' },
            ],
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
          },
          series: [
            {
              name: 'proteicCoverage',
              type: 'heatmap',
              data: dataProteicCoverage,
              label: {
                show: true,
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
            {
              name: 'energeticCoverage',
              type: 'heatmap',
              data: dataEnergeticCoverage,
              label: {
                show: true,
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        }
        if (this.standAlone) {
          options.title = {
            text: this.$t('herd.concentratedfeed.graph.title'),
          }
          options.grid = {
            left: '3%',
            right: '30%',
            bottom: '20%',
          }
          options.yAxis.position = 'right'
        }

        return options
      },
    },
    methods: {},
  }
</script>

<style scoped>
  .coverage-chart {
    width: 100% !important; /* Ajuste à la largeur de la page */
    height: auto !important; /* Préserve le ratio aspect */
  }
  .coverage-chart-small {
    width: 100% !important; /* Ajuste à la largeur de la page */
    height: auto !important; /* Préserve le ratio aspect */
  }
</style>
