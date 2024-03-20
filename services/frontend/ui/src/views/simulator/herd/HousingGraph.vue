<template>
  <v-container>
    <v-chart
      ref="housingChart"
      class="housing-chart"
      :option="options"
      autoresize
      theme="infographic"
    />
    <!-- <v-chart
      class="housing-chart"
      :option="daysOptions"
      autoresize
    /> -->
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'HousingChart',
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
      selection: {
        immediate: true, // Execute lorsque le composant est monté
        handler(newValue, oldValue) {
          if (oldValue != null) {
            const ov = oldValue + 1
            this.$refs.housingChart.dispatchAction({
              type: 'downplay',
              seriesName: 'days',
              name: 'P' + ov,
            })
            this.$refs.housingChart.dispatchAction({
              type: 'downplay',
              seriesName: 'animals',
              name: 'P' + ov,
            })
          }
          if (newValue != null) {
            console.log('dispatch', newValue)
            const nv = newValue + 1
            this.$refs.housingChart.dispatchAction({
              type: 'highlight',
              seriesName: 'days',
              name: 'P' + nv,
            })
            this.$refs.housingChart.dispatchAction({
              type: 'highlight',
              seriesName: 'animals',
              name: 'P' + nv,
            })
          }
        },
      },
    },
    data() {
      return {}
    },
    computed: {
      ...mapState(['simulator']),
      AnimalCountOptions() {
        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']
        const housingData = this.$store.getters.herdInfo.batchs[this.selectedLot].housing.presence
        console.log('housing data', housingData)
        const rows = ['nb animaux présent']
        const data = []
        for (let i = 0; i < housingData.length; i++) {
          data.push([i, 0, housingData[i].animalCount || '-'])
        }

        // data = [
        //   [0, 0, 5],
        //   [1, 0, '-'],
        //   [2, 0, 4],

        //   [0, 1, 2],
        //   [1, 1, 3],
        // ]
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
            axisLabel: {
              show: false,
            },
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
            max: 50,
            // calculable: true,
            type: 'continuous',
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            // color: ['#d0648a', 'rgb(255,152,0)', 'rgba(255,152,0,0.2)'],
          },
          series: [
            {
              name: 'Punch Card',
              type: 'heatmap',
              data: data,
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
      daysOptions() {
        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']
        const housingData = this.$store.getters.herdInfo.batchs[this.selectedLot].housing.presence
        console.log('housing data', housingData)
        const rows = ['Durée de présence']
        const data = []
        for (let i = 0; i < housingData.length; i++) {
          data.push([i, 0, housingData[i].days || '-'])
        }

        // data = [
        //   [0, 0, 5],
        //   [1, 0, '-'],
        //   [2, 0, 4],

        //   [0, 1, 2],
        //   [1, 1, 3],
        // ]
        return {
          tooltip: {
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
            max: 50,
            calculable: true,
            type: 'continuous',
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            // color: ['#d0648a', 'rgb(255,152,0)', 'rgba(255,152,0,0.2)'],
          },
          series: [
            {
              name: 'Punch Card',
              type: 'heatmap',
              data: data,
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
      options() {
        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']
        const housingData = this.$store.getters.herdInfo.batchs[this.selectedLot].housing.presence
        console.log('housing data', housingData)
        const rows = ['Durée', 'animaux']
        const dataDays = []
        const dataAnimals = []
        for (let i = 0; i < housingData.length; i++) {
          dataDays.push([i, 0, housingData[i].days || '-'])
          dataAnimals.push([i, 1, housingData[i].animalCount || '-'])
        }

        // data = [
        //   [0, 0, 5],
        //   [1, 0, '-'],
        //   [2, 0, 4],

        //   [0, 1, 2],
        //   [1, 1, 3],
        // ]
        console.log('toto')
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
            // color: ['#d0648a', 'rgb(255,152,0)', 'rgba(255,152,0,0.2)'],
          },
          series: [
            {
              name: 'days',
              type: 'heatmap',
              data: dataDays,
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
              name: 'animals',
              type: 'heatmap',
              data: dataAnimals,
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
  }
</script>

<style scoped>
  .housing-chart {
    height: 20vh;
  }
</style>
