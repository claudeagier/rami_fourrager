<template>
  <v-container>
    <v-row>
      <v-col
        cols="6"
        class="pt-0 pb-0"
      >
        <!-- Deuxième colonne -->
        <autonomy />
      </v-col>
      <v-col
        cols="6"
        class="pt-0 pb-0"
      >
        <v-card
          outlined
          elevation="2"
        >
          <v-card-title class="text-h4 grey--text"> <v-icon color="primary">mdi-autorenew</v-icon>Bilan </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-list dense>
                <!-- Liste stylée avec icônes, typographies et tooltips -->
                <v-list-item
                  v-for="(item, index) in kpis"
                  :key="index"
                >
                  <v-list-item-icon>
                    <!-- Icône d'information pour le tooltip -->
                    <v-tooltip
                      top
                      right
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                          :color="item.iconColor"
                        >
                          {{ item.icon }}
                        </v-icon>
                      </template>
                      <span>{{ item.tooltip }}</span>
                    </v-tooltip>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6 grey--text">{{ item.title }} </v-list-item-title>
                    <v-list-item-subtitle class="font-weight-bold text-lg">
                      {{ item.value }} {{ item.unit }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  // TODO traduction
  import Autonomy from '@/components/parts/dashboard/Autonomy.vue'
  import { mapGetters } from 'vuex'
  export default {
    name: 'global-module',
    components: { Autonomy },
    props: {
      data: {
        type: Object,
      },
    },
    data() {
      return {
        gaugeOptions: {
          size: {
            width: 'auto',
            height: '200 px',
          },
          lineStyle: {
            width: 10,
          },
        },
      }
    },
    computed: {
      ...mapGetters('simulator/report', {
        dimensioning: 'getDimensioning',
      }),
      initOptions() {
        return {
          width: 300,
          height: 300,
        }
      },
      kpis() {
        return [
          {
            title: 'UGB',
            value: this.dimensioning.ugb,
            icon: 'mdi-scale-balance',
            iconColor: 'deep-orange',
            tooltip: 'Unité de Gros Bétail',
            unit: '',
          },

          {
            title: 'Estimation Chargement SAU',
            value: this.dimensioning.chargeSAU,
            icon: 'mdi-chart-line',
            iconColor: 'blue darken-4',
            tooltip: 'Charge sur Surface Agricole Utile (SAU)',
            unit: 'UGB/ha',
          },
          {
            title: 'Chargement Apparent',
            value: this.dimensioning.chargeApparent,
            icon: 'mdi-paw',
            iconColor: 'blue darken-4',
            tooltip: 'Chargement apparent sur le territoire',
            unit: 'UGB/ha',
          },
          {
            title: 'Chargement corrigé',
            value: this.dimensioning.chargeCorrige,
            icon: 'mdi-tune',
            iconColor: 'blue darken-4',
            tooltip: 'Chargement corrigé sur le territoire',
            unit: 'UGB/ha',
          },
          {
            title: 'Chargement potentiel',
            value: this.dimensioning.chargePotentiel,
            icon: 'mdi-trending-up',
            iconColor: 'blue darken-4',
            tooltip: 'Chargement potentiel maximum sur le territoire',
            unit: 'UGB/ha',
          },
          {
            title: 'SFP/SAU',
            value: this.dimensioning.sfpSau,
            icon: 'mdi-land-plots',
            iconColor: 'green darken-4',
            tooltip: 'Superficie Fourragère Principale (SFP) par rapport à la SAU',
            unit: '%',
          },
          {
            title: '%PP/SAU',
            value: this.dimensioning.ppSau,
            icon: 'mdi-grass',
            iconColor: 'green darken-4',
            tooltip: 'Pourcentage de Prairies Permanentes par rapport à la SAU',
            unit: '%',
          },
          {
            title: '%PT/SAU',
            value: this.dimensioning.ptSau,
            icon: 'mdi-sprout',
            iconColor: 'green darken-4',
            tooltip: 'Pourcentage de Prairies Temporaires par rapport à la SAU',
            unit: '%',
          },
          {
            title: 'Fourrage récolté',
            value: this.dimensioning.fourragesRecoltes,
            icon: 'mdi-leaf',
            iconColor: 'green darken-4',
            tooltip: 'Ensemble des fourrages récoltés',
            unit: 'TMS/UGB',
          },
        ]
      },
      options() {
        const gaugeData = [
          // {
          //   value: 60,
          //   name: 'Potentiel',
          //   title: {
          //     offsetCenter: ['0%', '-40%'],
          //   },
          //   detail: {
          //     valueAnimation: true,
          //     offsetCenter: ['0%', '-25%'],
          //   },
          //   itemStyle: { color: 'grey', borderColor: 'grey' },
          // },
          {
            value: 93,
            name: 'Autonomie',
            title: {
              offsetCenter: ['0%', '-20%'],
            },
            detail: {
              valueAnimation: true,
              offsetCenter: ['0%', '0%'],
            },
            itemStyle: { color: 'rgb(33 150 243)', borderColor: 'rgb(33 150 243)' },
          },
        ]
        return {
          series: [
            {
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              min: 0,
              max: 140,
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
                lineStyle: {
                  width: 20,
                },
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
