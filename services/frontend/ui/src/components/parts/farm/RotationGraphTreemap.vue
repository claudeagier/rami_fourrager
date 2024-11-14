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
          this.$t('periods.P1'),
          this.$t('periods.P2'),
          this.$t('periods.P3'),
          this.$t('periods.P4'),
          this.$t('periods.P5'),
          this.$t('periods.P6'),
          this.$t('periods.P7'),
          this.$t('periods.P8'),
          this.$t('periods.P9'),
          this.$t('periods.P10'),
          this.$t('periods.P11'),
          this.$t('periods.P12'),
          this.$t('periods.end'),
        ]
        const stics = this.rotations
        const sticNames = []
        const sticData = [
          {
            name: this.$t('dashboard.farm.graph.pasture'),
            id: 'pasture',
            value: 0,
            children: [],
          },
          {
            name: this.$t('dashboard.farm.graph.culture'),
            id: 'culture',
            value: 0,
            children: [],
          },
        ]
        stics.forEach((s) => {
          let id = -1
          if (s.type.startsWith('P')) {
            id = sticData.findIndex((d) => d.id === 'pasture')
          } else {
            id = sticData.findIndex((d) => d.id === 'culture')
          }
          const cid = sticData[id].children.findIndex((c) => c.id === s.type)
          if (cid > -1) {
            sticData[id].value += s.surface
            sticData[id].children[cid].value += s.surface
            sticData[id].children[cid].children.push({
              name: s.name,
              value: s.surface,
            })
          } else {
            sticData[id].value += s.surface
            sticData[id].children.push({
              name: this.$t('dashboard.farm.graph.' + s.type) || s.type,
              id: s.type,
              value: s.surface,
              children: [
                {
                  name: s.name,
                  value: s.surface,
                },
              ],
            })
          }
        })

        const series = [
          {
            type: 'treemap',
            // leafDepth: 2, // profondeur de zoom
            colorMappingBy: 'value',
            itemStyle: {
              borderColor: '#ffff',
            },
            upperLabel: {
              show: true,
              height: 20,
            },
            levels: [
              {
                // level 1
                itemStyle: {
                  borderWidth: 8,
                  gapWidth: 8,
                },
              },
              {
                // level 2
                itemStyle: {
                  gapWidth: 2,
                  boderWidth: 2,
                },
                emphasis: {
                  // à la selection
                  itemStyle: {
                    borderWidth: 1,
                    borderColor: 'grey',
                  },
                },
              },
              {
                // level 3
                colorSaturation: [0, 0.5],
                itemStyle: {
                  gapWidth: 2,
                  borderColorSaturation: 0.7,
                  boderWidth: 2,
                },
              },
            ],
            data: sticData,
          },
        ]

        // Configuration de base
        const baseOptions = {
          series: series,
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
