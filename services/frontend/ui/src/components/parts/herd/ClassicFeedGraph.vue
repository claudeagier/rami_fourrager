<template>
  <div>
    <div class="text-6 font-weight-medium">
      {{ $t('herd.classicfeed.graph.title') }}
    </div>
    <v-chart
      ref="feedChart"
      :class="small ? 'feed-chart-small' : 'feed-chart'"
      :option="options"
      autoresize
      theme="infographic"
      :init-options="initOptions"
    />
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  export default {
    name: 'ClassicFeedGraph',
    props: {
      selectedLot: {
        type: null,
        required: true,
      },
      selection: {
        type: null,
      },
      small: {
        type: Boolean,
      },
    },
    watch: {
      selectedLot: {
        immediate: true,
        handler(newValue, oldValue) {
          // this.batch = this.getBatch(newValue)
        },
      },
      selection: {
        handler(newValue, oldValue) {
          if (oldValue != null) {
            const ov = oldValue + 1
            this.$refs.feedChart.dispatchAction({
              type: 'downplay',
              seriesName: 'proteicCoverage',
              name: 'P' + ov,
            })
            this.$refs.feedChart.dispatchAction({
              type: 'downplay',
              seriesName: 'energeticCoverage',
              name: 'P' + ov,
            })
          }
          if (newValue != null) {
            const nv = newValue + 1
            this.$refs.feedChart.dispatchAction({
              type: 'highlight',
              seriesName: 'proteicCoverage',
              name: 'P' + nv,
            })
            this.$refs.feedChart.dispatchAction({
              type: 'highlight',
              seriesName: 'energeticCoverage',
              name: 'P' + nv,
            })
          }
        },
      },
    },
    created() {},
    data() {
      return {
        batch: null,
      }
    },
    computed: {
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
      ...mapGetters('simulator/herd', {
        getBatch: 'getBatch',
        getEnergeticCoverageValues: 'getEnergeticCoverageByBatch',
        getProteicCoverageValues: 'getProteicCoverageByBatch',
      }),
      initOptions() {
        return { width: 'auto', height: 150 }
      },

      options() {
        // const periods = this.periods
        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']

        const rows = [this.$t('herd.concentratedfeed.graph.proteic'), this.$t('herd.concentratedfeed.graph.energetic')]
        const energeticCoverage = this.getEnergeticCoverageValues(this.selectedLot)
        const proteicCoverage = this.getProteicCoverageValues(this.selectedLot)

        const dataEnergeticCoverage = []
        const dataProteicCoverage = []
        for (let i = 0; i < energeticCoverage.length; i++) {
          dataEnergeticCoverage.push([i, 1, energeticCoverage[i] || '-'])
          dataProteicCoverage.push([i, 0, proteicCoverage[i] || '-'])
        }

        return {
          tooltip: {
            show: false,
            position: 'top',
          },
          grid: {
            height: '50%',
            top: '10%',
            left: '20%',
            right: '10%',
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
      },
    },
    methods: {},
  }
</script>

<style scoped>
  .feed-chart {
    width: 100% !important; /* Ajuste à la largeur de la page */
    height: auto !important; /* Préserve le ratio aspect */
  }
  .feed-chart-small {
    width: 100% !important; /* Ajuste à la largeur de la page */
    height: auto !important; /* Préserve le ratio aspect */
  }
</style>
