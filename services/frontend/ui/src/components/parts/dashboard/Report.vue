<template>
  <base-dashboard-card
    title="dashboard.report.title"
    cardColor="blue"
    titleColor="transparent"
    :dark="true"
    icon="mdi-chart-box-outline"
    :withButton="true"
  >
    <!-- <template v-slot:subtitle>
      {{ $t('dashboard.report.description') }}
    </template> -->
    <template v-slot:content>
      <v-row>
        <v-col
          cols="12"
          class="pt-0 pb-0"
        >
          <v-list
            dense
            class="transparent"
          >
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
                      dark
                    >
                      {{ item.icon }}
                    </v-icon>
                  </template>
                  <span>{{ item.tooltip }}</span>
                </v-tooltip>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-h8 indigo--text font-italic">{{ item.title }} </v-list-item-title>
                <v-list-item-subtitle class="font-weight-bold text-lg">
                  {{ item.value }} {{ item.unit }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </template>
    <template v-slot:button>
      <v-btn
        icon
        to="/simulation/report"
        color="white"
        dense
      >
        <v-icon
          large
          dense
        >
          mdi-eye-outline
        </v-icon>
      </v-btn>
    </template>
  </base-dashboard-card>
</template>
<script>
  export default {
    name: 'report-dashboard',
    data() {
      return {
        kpis: [
          {
            title: 'UGB',
            value: 122,
            icon: 'mdi-scale-balance',
            iconColor: 'deep-orange',
            tooltip: 'Unité de Gros Bétail',
            unit: '',
          },

          {
            title: 'Estimation Chargement SAU',
            value: 1.01,
            icon: 'mdi-chart-line',
            iconColor: 'blue darken-4',
            tooltip: 'Charge sur Surface Agricole Utile (SAU)',
            unit: 'UGB/ha',
          },
          {
            title: 'Chargement Apparent',
            value: 1.16,
            icon: 'mdi-paw',
            iconColor: 'blue darken-4',
            tooltip: 'Chargement apparent sur le territoire',
            unit: 'UGB/ha',
          },
          {
            title: 'Chargement corrigé',
            value: 1.16,
            icon: 'mdi-tune',
            iconColor: 'blue darken-4',
            tooltip: 'Chargement corrigé sur le territoire',
            unit: 'UGB/ha',
          },
          {
            title: 'Chargement potentiel',
            value: 1.25,
            icon: 'mdi-trending-up',
            iconColor: 'blue darken-4',
            tooltip: 'Chargement potentiel maximum sur le territoire',
            unit: 'UGB/ha',
          },
          {
            title: 'SFP/SAU',
            value: 88,
            icon: 'mdi-land-plots',
            iconColor: 'green darken-4',
            tooltip: 'Superficie Fourragère Principale (SFP) par rapport à la SAU',
            unit: '%',
          },
          {
            title: '%PP/SAU',
            value: 8,
            icon: 'mdi-grass',
            iconColor: 'green darken-4',
            tooltip: 'Pourcentage de Prairies Permanentes par rapport à la SAU',
            unit: '%',
          },
          {
            title: '%PT/SAU',
            value: 69,
            icon: 'mdi-sprout',
            iconColor: 'green darken-4',
            tooltip: 'Pourcentage de Prairies Temporaires par rapport à la SAU',
            unit: '%',
          },
          {
            title: 'Fourrage récolté',
            value: 3.2,
            icon: 'mdi-leaf',
            iconColor: 'green darken-4',
            tooltip: 'Ensemble des fourrages récoltés',
            unit: 'TMS/UGB',
          },
        ],
      }
    },
  }
</script>
