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
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-leaf</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6 grey--text">Fourrages Récoltés</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-bold text-lg">
                      {{ dimensioning.fourragesRecoltes }} tonnes
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
  import Autonomy from '@/components/parts/dashboard/Autonomy.vue'
  export default {
    name: 'global-module',
    components: { Autonomy },
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
        dimensioning: {
          nbAnimaux: 126,
          ugb: 122,
          chargeSAU: 1.01,
          chargeApparent: 1.16,
          chargeCorrige: 1.16,
          chargePotentiel: 1.25,
          fourragesRecoltes: 3.2,
          sfpSau: 88,
          ppSau: 8,
          ptSau: 69,
        },
        kpis: [
          {
            title: 'Nb Animaux',
            value: 126,
            icon: 'mdi-cow',
            iconColor: 'orange',
            tooltip: "Nombre total d'animaux dans le troupeau",
            unit: '',
          },
          {
            title: 'UGB',
            value: 122,
            icon: 'mdi-scale-balance',
            iconColor: 'orange',
            tooltip: 'Unité de Gros Bétail',
            unit: '',
          },
          {
            title: 'Estimation Chargement SAU',
            value: 1.01,
            icon: 'mdi-chart-line',
            iconColor: 'info',
            tooltip: 'Charge sur Surface Agricole Utile (SAU)',
            unit: 'UGB/ha',
          },
          {
            title: 'Chargement Apparent',
            value: 1.16,
            icon: 'mdi-paw',
            iconColor: 'info',
            tooltip: 'Chargement apparent sur le territoire',
            unit: 'UGB/ha',
          },
          {
            title: 'Chargement corrigé',
            value: 1.16,
            icon: 'mdi-tune',
            iconColor: 'info',
            tooltip: 'Chargement corrigé sur le territoire',
            unit: 'UGB/ha',
          },
          {
            title: 'Chargement potentiel',
            value: 1.25,
            icon: 'mdi-trending-up',
            iconColor: 'info',
            tooltip: 'Chargement potentiel maximum sur le territoire',
            unit: 'UGB/ha',
          },
          {
            title: 'SFP/SAU',
            value: 88,
            icon: 'mdi-land-plots',
            iconColor: 'green',
            tooltip: 'Superficie Fourragère Principale (SFP) par rapport à la SAU',
            unit: '%',
          },
          {
            title: '%PP/SAU',
            value: 8,
            icon: 'mdi-grass',
            iconColor: 'green',
            tooltip: 'Pourcentage de Prairies Permanentes par rapport à la SAU',
            unit: '%',
          },
          {
            title: '%PT/SAU',
            value: 69,
            icon: 'mdi-sprout',
            iconColor: 'green',
            tooltip: 'Pourcentage de Prairies Temporaires par rapport à la SAU',
            unit: '%',
          },
        ],
      }
    },
    computed: {
      initOptions() {
        return {
          width: 300,
          height: 300,
        }
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
