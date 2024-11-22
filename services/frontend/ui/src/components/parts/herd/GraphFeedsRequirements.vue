<template>
  <v-tooltip
    right
    open-delay="500"
    dark
  >
    <template v-slot:activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
        style="width: 100%"
      >
        <v-chart
          class="feeds-requirements-chart"
          :option="options"
          autoresize
          theme="infographic"
          @mouseover="handleMouseOver"
          :init-options="initOptions"
          @click="handleClick"
        />
      </div>
    </template>
    <span class="text-block">{{ $t('herd.details.graph.comment') }}</span>
  </v-tooltip>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'GraphFeedsRequirements',
    props: {
      layout: {
        type: Object,
        default: () => ({ width: 'auto', height: 'auto' }),
      },
      selectedLot: {
        type: null,
        required: true,
      },
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
        getDryMatterProvided: 'getDryMatterProvided',
        getDryMatterNeeded: 'getDryMatterNeeded',
      }),
      initOptions() {
        return this.layout
      },

      options() {
        // const periods = this.periods
        const periods = [
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
          this.$t('periods.graph.P13'),
        ]
        const dryMatterProvidedPerFeed = this.getDryMatterProvided(this.selectedLot)
        const dryMatterNeededSerie = this.getDryMatterNeeded(this.selectedLot)
        const unity = this.$t('herd.details.graph.unity')
        // format
        var dryMatterProvidedPerFeedSeries = Object.values(dryMatterProvidedPerFeed).map((feed) => {
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
            name: feed.name,
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
            data: feed.data,
            itemStyle: { color: colors[feed.code] },
          }
        })

        const colors = ['#5470C6', '#EE6666']
        if (dryMatterProvidedPerFeed && dryMatterNeededSerie) {
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
              show: this.withLegend,
              type: 'scroll',
              orient: 'vertical',
              right: 'right',
              top: 'middle',
            },
            grid: {
              left: this.withLegend ? '3%' : '0%',
              right: this.withLegend ? '30%' : '3%',
              bottom: '3%',
              containLabel: true,
            },
            title: {
              show: this.withTitle,
              text: this.title,
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
            series: [
              ...[
                {
                  name: this.$t('herd.details.graph.ms'),
                  type: 'line',
                  data: dryMatterNeededSerie,
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
        } else {
          return 'No data'
        }
      },
    },
    methods: {
      handleMouseOver(params) {},
      handleClick(params) {
        this.$emit('click', params)
      },
    },
  }
</script>
<style>
  .text-block {
    white-space: pre;
  }
  .feeds-requirements-chart {
    width: 100% !important; /* Ajuste à la largeur de la page */
    height: auto !important; /* Préserve le ratio aspect */
    page-break-inside: avoid; /* Empêche les coupures dans les graphiques */
  }
</style>
