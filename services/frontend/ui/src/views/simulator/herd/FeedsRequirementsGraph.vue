<template>
  <v-card>
    <div class="text-6 font-weight-medium">
      {{ $t('herd.details.graph.title') }}
    </div>
    <v-chart
      class="feeds-requirements-chart"
      :option="options"
      autoresize
      theme="infographic"
      @mouseover="handleMouseOver"
      :init-options="initOptions"
    />
  </v-card>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import TooltipGraph from './TooltipGraph.vue'
  const tooltip = {
    name: 'tooltip',
  }

  export default {
    name: 'FeedsRequirementsGraph',
    props: {
      selectedLot: {
        type: null,
        required: true,
      },
    },
    watch: {
      selectedLot: {
        immediate: true,
        handler(newValue, oldValue) {
          // this.batch = this.getBatch(newValue)
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
      ...mapGetters('simulator', {
        periods: 'periodList',
      }),
      ...mapGetters('simulator/herd', {
        getBatch: 'getBatch',
        getEnergeticCoverageValues: 'getEnergeticCoverageByBatch',
        getProteicCoverageValues: 'getProteicCoverageByBatch',
        getDryMatterProvided: 'getDryMatterProvided',
      }),
      initOptions() {
        return { width: 600, height: 400 }
      },

      options() {
        // const periods = this.periods
        var series = []
        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']

        const rows = ['Protéique', 'Energétique']
        const data = this.getDryMatterProvided(this.selectedLot)
        console.log('data', data)
        var dryMatterProvidedPerFeedSeries = Object.values(data.dry_matter_provided_per_feed).map((feed) => {
          return {
            name: feed.name,
            type: 'bar',
            stack: 'total',
            label: {
              show: false,
            },
            emphasis: {
              focus: 'item',
              blurScope: 'global',
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + ' kgMS'
              },
            },
            data: feed.data,
          }
        })
        const colors = ['#5470C6', '#EE6666']

        return {
          // tooltip: {
          //   axisPointer: {
          //     // Use axis to trigger tooltip
          //     type: 'cross', // 'shadow' as default; can also be 'line' or 'shadow'
          //   },
          //   // formatter: '{a0} : {c0}',
          //   // formatter: function (params) {
          //   //   // console.log('params', params)
          //   //   return TooltipGraph
          //   // },
          //   position: ['50%', '50%'],
          // },
          // legend: {},
          // grid: {
          //   left: '3%',
          //   right: '4%',
          //   bottom: '3%',
          //   containLabel: true,
          // },
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
          series: [
            ...[
              {
                name: 'besoin MS',
                type: 'line',
                data: data.dry_matter_needed.data,
                emphasis: {
                  focus: 'serie',
                },
                smooth: true,
                tooltip: {
                  valueFormatter: function (value) {
                    return value + ' kgMS/animal/jour'
                  },
                },
              },
            ],
            ...dryMatterProvidedPerFeedSeries,
          ],
        }
      },
    },
    methods: {
      handleMouseOver(params) {
        console.log('mouseover', params)
      },
    },
  }
</script>

<style scoped>
  /* .feeds-requirements-chart {
    height: 20em;
    width: 40em;
  } */
</style>
