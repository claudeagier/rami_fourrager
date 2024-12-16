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
          <v-list-item key="ugb">
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
                    color="deep-orange"
                    dark
                  >
                    mdi-scale-balance
                  </v-icon>
                </template>
                <span>{{ $t('dimensioning.ugbN.tooltip') }}</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-content>
              <v-row>
                <v-col>
                  <v-list-item-title class="text-h8 indigo--text font-italic">
                    {{ $t('dimensioning.ugbN.title') }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-weight-bold text-lg">
                    {{ ugbs.ugbN }} {{ $t('dimensioning.ugbN.unit') }}
                  </v-list-item-subtitle>
                </v-col>
                <v-col>
                  <v-list-item-title class="text-h8 indigo--text font-italic">
                    {{ $t('dimensioning.ugbAN.title') }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-weight-bold text-lg">
                    {{ ugbs.ugbAN }} {{ $t('dimensioning.ugbAN.unit') }}
                  </v-list-item-subtitle>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>

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
                <span>{{ $t('dimensioning.' + item.name + '.tooltip') }}</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text-h8 indigo--text font-italic">
                {{ $t('dimensioning.' + item.name + '.title') }}
              </v-list-item-title>
              <v-list-item-subtitle class="font-weight-bold text-lg">
                {{ item.value }} {{ $t('dimensioning.' + item.name + '.unit') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>
<script>
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
      ugbs() {
        return {
          ugbN: this.dimensioning.ugbN,
          ugbAN: this.dimensioning.ugbAN,
        }
      },
      kpis() {
        return [
          {
            name: 'chargeSAU',
            value: this.dimensioning.chargeSAU,
            icon: 'mdi-chart-line',
            iconColor: 'blue darken-4',
          },
          {
            name: 'chargeApparent',
            value: this.dimensioning.chargeApparent,
            icon: 'mdi-paw',
            iconColor: 'blue darken-4',
          },
          {
            name: 'chargeCorrige',
            value: this.dimensioning.chargeCorrige,
            icon: 'mdi-tune',
            iconColor: 'blue darken-4',
          },
          {
            name: 'chargePotentiel',
            value: this.dimensioning.chargePotentiel,
            icon: 'mdi-trending-up',
            iconColor: 'blue darken-4',
          },
          {
            name: 'sfpSau',
            value: this.dimensioning.sfpSau,
            icon: 'mdi-land-plots',
            iconColor: 'green darken-4',
          },
          {
            name: 'ppSau',
            value: this.dimensioning.ppSau,
            icon: 'mdi-grass',
            iconColor: 'green darken-4',
          },
          {
            name: 'ptSau',
            value: this.dimensioning.ptSau,
            icon: 'mdi-sprout',
            iconColor: 'green darken-4',
          },
          {
            name: 'fourragesRecoltes',
            value: this.dimensioning.fourragesRecoltes,
            icon: 'mdi-leaf',
            iconColor: 'green darken-4',
          },
        ]
      },
    },
  }
</script>
