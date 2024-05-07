<template>
  <v-container fluid>
    <div class="text-6 font-weight-medium">
      {{ $t('herd.classicfeed.graph.title') }}
    </div>
    <v-chart
      ref="feedChart"
      class="feed-chart"
      :option="options"
      autoresize
      theme="infographic"
    />
  </v-container>
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
              seriesName: 'days',
              name: 'P' + ov,
            })
            this.$refs.feedChart.dispatchAction({
              type: 'downplay',
              seriesName: 'animals',
              name: 'P' + ov,
            })
          }
          if (newValue != null) {
            const nv = newValue + 1
            this.$refs.feedChart.dispatchAction({
              type: 'highlight',
              seriesName: 'days',
              name: 'P' + nv,
            })
            this.$refs.feedChart.dispatchAction({
              type: 'highlight',
              seriesName: 'animals',
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
      options() {
        // const periods = this.periods
        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']

        const rows = ['Protéique', 'Energétique']
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
            type: 'continuous',
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            inRange: {
              color: ['#DD2000', '#009000'], // From smaller to bigger value ->
            },
            // color: ['#d0648a', 'rgb(255,152,0)', 'rgba(255,152,0,0.2)'],
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
    height: 20vh;
  }
</style>
