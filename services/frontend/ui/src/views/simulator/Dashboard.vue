<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <div v-if="simulation.loaded">
      <!-- <div>{{ simulator.simulationName }}</div> -->
      <!-- Bouton d'impression -->
      <!-- <v-btn
        color="primary"
        class="mb-3"
        @click="printPage"
      >
        Imprimer la page
      </v-btn> -->
      <v-row class="pt-3">
        <v-col
          cols="6"
          class="pt-0 pb-0"
        >
          <v-row>
            <v-col
              cols="6"
              class="mb-0 pt-0 pb-0"
            >
              <simulation />
              <climat
                :siteModel="simulation.site"
                :siteDropdownOptions="siteList"
                @changeSite="handleSiteChange"
                :climaticYearModel="simulation.climaticYear"
                :climaticYearDropdownOptions="climaticYears"
                @changeClimaticYear="handleCYchange"
                @confirmSiteChange="deleteStics"
              />
              <autonomy />
            </v-col>
            <v-col
              cols="6"
              class="d-flex align-start pt-0 pb-0"
            >
              <report />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              class="pt-0 pb-0"
            >
              <barn />
            </v-col>
          </v-row>
        </v-col>
        <v-col
          cols="6"
          class="pt-0 pb-0"
          align-self="start"
        >
          <v-row style="height: 50%">
            <v-col
              class="pt-0 pb-0"
              align-self="start"
              style="height: 100%"
            >
              <herd />
            </v-col>
          </v-row>
          <v-row style="height: 50%">
            <v-col
              class="pt-0 pb-0"
              align-self="end"
            >
              <farm />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import navigationGuard from '@/mixins/navigationGuard'
  import Farm from '@/components/parts/dashboard/Farm'
  import Report from '@/components/parts/dashboard/Report'
  import Barn from '@/components/parts/dashboard/Barn'
  import Herd from '@/components/parts/dashboard/Herd'
  import Climat from '@/components/parts/dashboard/Climat.vue'
  import Autonomy from '@/components/parts/dashboard/Autonomy'
  import Simulation from '@/components/parts/dashboard/Simulation.vue'
  // TODO impression
  // TODO mise en page
  // demander l'export quand on sort
  export default {
    name: 'Dashboard',
    mixins: [navigationGuard],
    components: {
      Farm,
      Report,
      Barn,
      Herd,
      Climat,
      Simulation,
      Autonomy,
    },
    confirmNavigation(callback) {
      this.$confirmNavigation(callback)
    },
    data() {
      return {
        climaticYears: [],
        sticsIsDeleted: false,
      }
    },
    created() {
      if (this.simulation.site) {
        this.climaticYears = this.getClimaticYearList(this.simulation.site)
      }
    },
    computed: {
      ...mapState('simulator', {
        simulation: (state) => state,
      }),
      ...mapGetters('referential', {
        siteList: 'siteList',
        getClimaticYearList: 'climaticYearList',
        periods: 'periodList',
      }),
      ...mapGetters('simulator/farm', {
        availablePastures: 'getAvailablePasture',
      }),
    },
    methods: {
      ...mapMutations('simulator', {
        setClimaticYear: 'setClimaticYear',
      }),
      printPage() {
        window.print()
      },
      handleSiteChange(id) {
        this.$store.commit('simulator/setSite', id)
        if (!this.sticsIsDeleted) {
          this.$store.dispatch('simulator/applyTo', 'site')
          this.climaticYears = this.getClimaticYearList(id)
        }
      },

      deleteStics() {
        console.log('delete stic')
        this.sticsIsDeleted = true
        this.$store.dispatch('simulator/farm/initializeRotations')
      },

      handleCYchange(id) {
        this.setClimaticYear(id)
        // set localForage
        this.$store.dispatch('simulator/applyTo', 'climaticYear')
        // recharger la ferme avec les nouvelles baguettes
        this.$store.dispatch('simulator/farm/setTotalAvailablePastureByPeriod')
        this.$store.dispatch('simulator/farm/dispatchProduction')
      },
    },
  }
</script>
<style>
  /* Masquer les éléments inutiles à l'impression */
  @media print {
    /* Masquer le bouton d'impression */
    .v-btn {
      display: none !important;
    }

    /* Assurer que le contenu occupe toute la page */
    #dashboard {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Ajustement des colonnes pour un meilleur rendu */
    .v-col {
      float: left; /* Aligner les colonnes en ligne pour l'impression */
      width: 100%; /* Par défaut, les colonnes prennent 100% de la largeur */
      margin-bottom: 16px; /* Espacement entre les blocs */
    }

    /* Rendre les colonnes à moitié pour les parties spécifiques */
    .v-col[cols='6'] {
      width: 50%; /* Diviser l'espace en deux colonnes */
    }

    /* Gérer les lignes */
    .v-row {
      display: flex;
      flex-wrap: wrap; /* Assurer que les colonnes passent à la ligne si nécessaire */
      margin: 0;
    }

    /* Gérer l'affichage des composants spécifiques */
    simulation,
    climat,
    autonomy,
    report,
    barn,
    herd,
    farm {
      display: block;
      margin-bottom: 16px;
    }

    /* Assurer que les composants prennent leur espace complet */
    simulation,
    climat,
    autonomy,
    report,
    barn,
    herd,
    farm {
      width: 100%;
    }

    /* Supprimer les paddings internes des colonnes */
    .v-col.pt-0,
    .v-col.pb-0 {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }

    /* Supprimer les marges autour des lignes sans gouttières */
    .v-row.no-gutters {
      margin: 0 !important;
    }

    /* Espacement minimal pour le haut et le bas des colonnes */
    .v-col.pt-0.pb-0 {
      padding-top: 4px;
      padding-bottom: 4px;
    }

    /* Styles globaux pour l'impression */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }

    /* Casse automatique pour éviter les débordements */
    #dashboard {
      word-wrap: break-word;
    }

    /* Supprimer les ombres ou styles inutiles */
    .v-card,
    .v-container {
      box-shadow: none !important;
      border: none !important;
    }

    /* Éviter les coupures étranges entre colonnes lors de l'impression */
    .v-row {
      page-break-inside: avoid !important;
    }
  }
</style>
