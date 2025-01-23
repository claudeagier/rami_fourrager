<template>
  <div>
    <div class="text-h4 indigo--text font-italic">
      {{ $t('autonomy.print.autonomy.title') }}
    </div>
    <v-alert
      class="pa-1 ma-2"
      dense
      :type="autonomy > 0 ? $t('autonomy.autonomy.step.high.color') : $t('autonomy.autonomy.step.low.color')"
    >
      {{ autonomy > 0 ? $t('autonomy.autonomy.step.high.label') : $t('autonomy.autonomy.step.low.label') }}
    </v-alert>
    <v-divider></v-divider>
    <div class="text-h4 indigo--text font-italic">
      {{ $t('autonomy.print.potential.title') }}
    </div>
    <v-alert
      class="pa-1 ma-2"
      dense
      :type="potential >= 90 ? $t('autonomy.potential.step.high.color') : $t('autonomy.potential.step.low.color')"
    >
      {{
        potential >= 90
          ? $t('autonomy.potential.step.high.label', { rating: potential })
          : $t('autonomy.potential.step.low.label', { rating: potential })
      }}
    </v-alert>

    <div style="width: 100%; height: 250px">
      <v-chart
        class="autonomy-chart"
        :option="options"
        autoresize
        theme="infographic"
        :init-options="initOptions"
      />
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters('simulator/report', {
        autonomy: 'getAutonomy',
        potential: 'getPotential',
      }),
      initOptions() {
        return { width: 'auto', height: 'auto' }
      },
      options() {
        return {
          xAxis: {
            min: -0.5,
            max: 0.5,
            name: 'Autonomie',
            nameLocation: 'middle',
            axisLabel: {
              show: false,
            },
          },
          yAxis: {
            min: 40,
            max: 140,
            name: 'Potentiel',
            nameLocation: 'middle',
            axisLabel: {
              show: false,
            },
          },
          series: [
            {
              symbolSize: 10,
              data: [[this.autonomy, this.potential]],
              type: 'scatter',
              markLine: {
                data: [
                  {
                    yAxis: 90,
                    emphasis: {
                      disabled: true,
                    },
                    symbol: 'none',
                    lineStyle: {
                      type: 'solid',
                      width: 1,
                    },
                  },
                  {
                    xAxis: 0,
                    emphasis: {
                      disabled: true,
                    },
                    symbol: 'none',
                    lineStyle: {
                      type: 'solid',
                      width: 1,
                    },
                  },
                ],
              },
            },
          ],
        }
      },
    },
  }
</script>
