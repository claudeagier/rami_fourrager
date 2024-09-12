<template>
  <v-chart
    class="autonomy-chart"
    :option="options"
    autoresize
    theme="infographic"
    :init-options="initOptions"
  />
</template>
<script>
  export default {
    name: 'Gauge',
    props: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      floor: {
        type: Number,
        required: true,
      },
      gaugeValue: {
        type: Number,
        required: true,
      },
      gaugeName: {
        type: String,
        required: true,
      },
      gaugeOptions: {
        type: Object,
        required: true,
      },
    },
    computed: {
      initOptions() {
        return this.gaugeOptions.size
      },
      options() {
        const okColor = this.gaugeValue > this.floor ? 'green' : 'orange'
        const gaugeData = [
          {
            value: this.gaugeValue,
            name: this.gaugeName,
            title: {
              offsetCenter: ['0%', '-30%'],
            },
            detail: {
              valueAnimation: true,
              offsetCenter: ['0%', '0%'],
            },
            itemStyle: { color: okColor, borderColor: okColor },
          },
        ]
        return {
          series: [
            {
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              min: this.min,
              max: this.max,
              pointer: {
                show: false,
              },
              progress: {
                show: true,
                overlap: false,
                roundCap: false,
                clip: false,
                itemStyle: {
                  borderWidth: 1,
                },
              },
              axisLine: {
                lineStyle: this.gaugeOptions.lineStyle,
              },
              splitLine: {
                show: false,
                distance: 0,
                length: 10,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: false,
                distance: 50,
              },
              data: gaugeData,
              title: {
                fontSize: 14,
              },
              detail: {
                width: 50,
                height: 14,
                fontSize: 14,
                color: 'inherit',
                borderColor: 'inherit',
                borderRadius: 20,
                borderWidth: 1,
                formatter: '{value}%',
              },
            },
          ],
        }
      },
    },
  }
</script>
