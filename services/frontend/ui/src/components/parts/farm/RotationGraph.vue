<template>
  <div
    class=".farm-chart-container"
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
  // TODO le graphique de l'assolement
  import { mapGetters } from 'vuex'
  export default {
    name: 'rotation-graph',
    data() {
      return {}
    },
    computed: {
      ...mapGetters('simulator/farm', {
        rotations: 'getRotationsData',
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
            sticData.push([pIndex, sIndex, p.production || '-'])
          })
        })

        // Configuration de base
        const baseOptions = {
          calculable: true,
          tooltip: {
            show: false,
            position: 'top',
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
              name: 'Punch Card',
              type: 'heatmap',
              data: sticData,
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
