<template>
  <base-material-card
    color="blue"
    min-height="130"
  >
    <template v-slot:heading>
      <v-row>
        <v-col>
          <div class="text-h3 font-weight-light">{{ $t('report.title') }}</div>
          <div class="text-subtitle-1 font-weight-light">{{ $t('report.subtitle') }}</div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <div>
            <v-btn
              class="ml-2"
              color="blue"
              style="background-color: white"
              outlined
              min-width="0"
              to="/simulation/report"
            >
              {{ $t('btn.complete') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
    <v-card-text>
      <v-row>
        <v-col
          cols="6"
          class="pt-0 pb-0"
        >
          <v-list dense>
            <!-- Liste stylée avec icônes, typographies et tooltips -->
            <v-list-item
              v-for="(item, index) in kpis.col1"
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
        </v-col>
        <v-col
          cols="6"
          class="pt-0 pb-0"
        >
          <v-list dense>
            <!-- Liste stylée avec icônes, typographies et tooltips -->
            <v-list-item
              v-for="(item, index) in kpis.col2"
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
        </v-col>
      </v-row>
    </v-card-text>
  </base-material-card>
</template>
<script>
  export default {
    name: 'farm-dashboard',
    data() {
      return {
        kpis: {
          col2: [
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
          ],
          col1: [
            {
              title: 'Nb Animaux',
              value: 126,
              icon: 'mdi-cow',
              iconColor: 'orange',
              tooltip: "Nombre total d'animaux dans le troupeau",
              unit: '',
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
            {
              title: 'Fourrage récolté',
              value: 3.2,
              icon: 'mdi-leaf',
              iconColor: 'green',
              tooltip: 'Ensemble des fourrages récoltés',
              unit: 'TMS/UGB',
            },
          ],
        },
      }
    },
  }
</script>
