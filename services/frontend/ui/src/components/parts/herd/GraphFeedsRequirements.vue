<template>
  <v-tooltip
    bottom
    open-delay="500"
    dark
  >
    <template v-slot:activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
        class="chart-container"
      >
        <v-chart
          ref="feedsRequirementsChart"
          class="feeds-requirements-chart"
          :option="options"
          autoresize
          theme="infographic"
          :init-options="initOptions"
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
      selectedLot: {
        type: null,
        required: true,
      },
      withLegend: {
        type: Boolean,
        default: true,
      },
      withTooltip: {
        type: Boolean,
        default: true,
      },
      withToolBox: {
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
    computed: {
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
      ...mapGetters('simulator/herd', {
        getDryMatterProvided: 'getDryMatterProvided',
        getDryMatterNeeded: 'getDryMatterNeeded',
      }),
      initOptions() {
        return { width: 'auto', height: 'auto' }
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
          const serie = {
            name: feed.name,
            type: 'bar',
            stack: 'total',
            label: {
              show: false,
            },

            data: feed.data,
            itemStyle: { color: colors[feed.code] },
          }
          if (this.withTooltip) {
            serie.tooltip = {
              valueFormatter: function (value) {
                return value + ' ' + unity
              },
            }
          }
          return serie
        })

        const colors = ['#5470C6', '#EE6666']
        const options = {
          toolbox: {
            show: this.withToolBox,
            feature: {
              saveAsImage: {
                name: 'matiere_seche_vs_besoin_lot_' + (this.selectedLot + 1),
                backgroundColor: 'white',
              },
            },
          },
          legend: {
            show: this.withLegend,
            renderMode: 'html',
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
        if (this.withTooltip) {
          options.tooltip = {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
            triggerOn: 'click',
            appendToBody: true,
            hideDelay: 50,
            enterable: true,
          }
        }

        return options
      },
    },
  }
</script>
<style>
  .text-block {
    white-space: pre;
  }
  .chart-container {
    display: flex; /* Utilise flexbox pour la mise en page */
    justify-content: center; /* Centrer le contenu horizontalement */
    align-items: center; /* Centrer le contenu verticalement */
    position: relative; /* Positionnement relatif pour des ajustements plus fins si nécessaire */
    page-break-inside: avoid;
    width: 100%;
    height: 200px;
  }
</style>
