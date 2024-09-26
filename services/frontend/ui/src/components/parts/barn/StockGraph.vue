<template>
  <div
    class=".barn-chart-container"
    style="width: 100%; height: 200px"
  >
    <v-chart
      class="barn-chart"
      :option="options"
      autoresize
      theme="infographic"
      :init-options="initOptions"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    computed: {
      initOptions() {
        return { width: 'auto', height: 'auto' }
      },
      options() {
        const xAxisData = []
        const data1 = []
        const data2 = []
        const data3 = []
        const data4 = []
        for (let i = 0; i < 10; i++) {
          xAxisData.push('Class' + i)
          data1.push(+(Math.random() * 2).toFixed(2))
          data2.push(+(Math.random() * 5).toFixed(2))
          data3.push(+(Math.random() + 0.3).toFixed(2))
          data4.push(+Math.random().toFixed(2))
        }
        var emphasisStyle = {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
          },
        }
        return {
          // legend: {
          //   data: ['bar', 'bar2', 'bar3', 'bar4'],
          //   left: '10%',
          // },
          // brush: {
          //   toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
          //   xAxisIndex: 0,
          // },
          // toolbox: {
          //   feature: {
          //     magicType: {
          //       type: ['stack'],
          //     },
          //     dataView: {},
          //   },
          // },
          tooltip: {},
          xAxis: {
            data: xAxisData,
            // name: 'X Axis',
            axisLine: { onZero: true },
            splitLine: { show: false },
            splitArea: { show: false },
          },
          yAxis: {},
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '10%',
            containLabel: true,
          },
          series: [
            {
              name: 'bar',
              type: 'bar',
              stack: 'one',
              emphasis: emphasisStyle,
              data: data1,
            },
            {
              name: 'bar2',
              type: 'bar',
              stack: 'one',
              emphasis: emphasisStyle,
              data: data2,
            },
            {
              name: 'bar3',
              type: 'bar',
              stack: 'two',
              emphasis: emphasisStyle,
              data: data3,
            },
            {
              name: 'bar4',
              type: 'bar',
              stack: 'two',
              emphasis: emphasisStyle,
              data: data4,
            },
          ],
        }
      },
    },
  }
</script>
<style>
  .barn-chart-container {
    display: flex; /* Utilise flexbox pour la mise en page */
    justify-content: center; /* Centrer le contenu horizontalement */
    align-items: center; /* Centrer le contenu verticalement */
    position: relative; /* Positionnement relatif pour des ajustements plus fins si nécessaire */
  }
</style>
