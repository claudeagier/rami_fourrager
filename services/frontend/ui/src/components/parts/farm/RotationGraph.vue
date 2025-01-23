<template>
  <div
    ref="farmChartContainer"
    class="farm-chart-container"
    style="width: 100%; height: 250px"
  >
    <v-chart
      class="farm-chart"
      :option="options"
      autoresize
      theme="infographic"
      :init-options="initOptions"
    />
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'rotation-graph',
    computed: {
      ...mapGetters('simulator/farm', {
        rotations: 'getRotationsData',
      }),
      ...mapGetters('referential', {
        farmingMethodList: 'farmingMethodList',
      }),
      initOptions() {
        return { width: 'auto', height: 'auto' }
      },
      options() {
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
          this.$t('periods.graph.end'),
        ]

        const stics = this.rotations
        const sticNames = []
        const sticData = []
        stics.forEach((s, sIndex) => {
          sticNames.push(s.name)
          s.production.forEach((p, pIndex) => {
            const item = {
              value: [pIndex, sIndex, p.production || '-'],
            }
            const fm = this.farmingMethodList.find((el) => el.code === p.farmingMethod)
            if (fm) {
              item.sticName = fm.name
              item.unity = fm.unity
            }
            if (p.farmingMethod !== 'P') {
              item.itemStyle = { color: 'grey' }
            }
            sticData.push(item)
          })
        })

        // Configuration de base
        const baseOptions = {
          calculable: true,
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow',
            },
            triggerOn: 'mousemove|click',
            appendToBody: true,
            hideDelay: 50,
            enterable: true,
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '10%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: periods,
            splitArea: {
              show: true,
            },
            axisLabel: {
              interval: 0,
              rotate: '45',
            },
          },
          yAxis: {
            type: 'category',
            data: sticNames,
            splitArea: {
              show: true,
            },
          },
          visualMap: {
            show: false,
            min: 0,
            max: 10,
            calculable: true,
            orient: 'horizontal',
            color: ['#265728', '#D2EAD3'],
          },
          series: [
            {
              name: 'Production',
              type: 'heatmap',
              data: sticData,
              label: {
                show: true,
              },
              tooltip: {
                formatter: function (params, ticket, callback) {
                  const content = params.data.sticName + ' : <b>' + params.value[2] + ' ' + params.data.unity + '</b>'
                  return content
                },
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

        return {
          baseOption: baseOptions,
        }
      },
    },
  }
</script>
<style>
  .farm-chart-container {
    display: flex; /* Utilise flexbox pour la mise en page */
    justify-content: center; /* Centrer le contenu horizontalement */
    align-items: center; /* Centrer le contenu verticalement */
    position: relative; /* Positionnement relatif pour des ajustements plus fins si nécessaire */
  }
</style>
