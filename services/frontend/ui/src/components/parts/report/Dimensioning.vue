<template>
  <div>
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
  </div>
</template>
<script>
  // TODO traduction à faire bilan => dimensionnement
  import { mapGetters } from 'vuex'
  export default {
    name: 'dimensioning',
    data() {
      return {}
    },
    computed: {
      ...mapGetters('simulator/report', {
        dimensioning: 'getDimensioning',
      }),
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
            unit: 'UGB/ha SAU',
          },
          {
            title: 'Chargement Apparent',
            value: this.dimensioning.chargeApparent,
            icon: 'mdi-paw',
            iconColor: 'blue darken-4',
            tooltip: 'Chargement apparent sur le territoire',
            unit: 'UGB/ha SFP',
          },
          {
            title: 'Chargement corrigé',
            value: this.dimensioning.chargeCorrige,
            icon: 'mdi-tune',
            iconColor: 'blue darken-4',
            tooltip: 'Chargement corrigé sur le territoire',
            unit: 'UGB/ha SFP',
          },
          {
            title: 'Chargement potentiel',
            value: this.dimensioning.chargePotentiel,
            icon: 'mdi-trending-up',
            iconColor: 'blue darken-4',
            tooltip: 'Chargement potentiel maximum sur le territoire',
            unit: 'UGB/ha SFP',
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
    },
  }
</script>
