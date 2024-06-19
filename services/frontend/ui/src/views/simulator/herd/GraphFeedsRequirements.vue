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
      >
        <v-chart
          class="feeds-requirements-chart"
          :option="options"
          autoresize
          theme="infographic"
          @mouseover="handleMouseOver"
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
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
      ...mapGetters('simulator/herd', {
        getBatch: 'getBatch',
        getDryMatterProvided: 'getDryMatterProvided',
      }),
      initOptions() {
        return { width: 800, height: 300 }
      },

      options() {
        // const periods = this.periods
        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']

        const data = this.getDryMatterProvided(this.selectedLot)
        var dryMatterProvidedPerFeedSeries = Object.values(data.dry_matter_provided_per_feed).map((feed) => {
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
                return value + ' kgMS'
              },
            },
            data: feed.data,
            itemStyle: { color: colors[feed.code] },
          }
        })
        const colors = ['#5470C6', '#EE6666']

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
              saveAsImage: {},
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
            text: this.$t('herd.details.graph.title'),
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
          series: [
            ...[
              {
                name: this.$t('herd.details.graph.ms'),
                type: 'line',
                data: data.dry_matter_needed.data,
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
      handleMouseOver(params) {},
    },
  }
</script>
<style>
  .text-block {
    white-space: pre;
  }
</style>
