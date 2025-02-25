<template>
  <base-page-container
    container-name="report-vue"
    :page-color="pageColor"
    :title="$t('report.main.title')"
    :subtitle="$t('report.main.subtitle')"
    @apply="applyToSimulation"
  >
    <template v-slot:content>
      <v-row>
        <v-col
          cols="12"
          lg="12"
          class="pt-0 pb-0"
          style="height: 100%"
        >
          <v-tabs
            centered
            :color="pageColor"
            fixed-tabs
          >
            <v-tab
              v-for="(mod, tabIndex) in modules"
              :key="tabIndex"
            >
              {{ $t('report.main.modules.' + mod.labelKey) }}
            </v-tab>
            <v-tab-item
              v-for="(mod, tabIndex) in modules"
              :key="tabIndex"
            >
              <v-divider></v-divider>
              <!-- <div>{{ $t('report.main.modules.' + mod.descriptionKey) }}</div> -->
              <!-- Afficher dynamiquement le composant du module correspondant -->
              <component
                :is="mod.component"
                :data="mod.data"
                :pageColor="pageColor"
                v-if="mod.component"
              />
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </template>
  </base-page-container>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import navigationGuard from '@/mixins/navigationGuard'
  import { moduleList } from '@/components/parts/report/modules/Config' // Importez la configuration des modules
  export default {
    name: 'Report',
    mixins: [navigationGuard],
    confirmNavigation(callback) {
      this.$confirmNavigation(callback)
    },
    data: () => ({
      pageColor: 'blue',
      modules: [],
    }),
    created() {
      this.loadModules()
      if (!this.isValidSimulation()) {
        this.$toast({
          message: this.$t('notifications.report.errors.simulation_not_valid'),
          type: 'error', // 'info', 'warning', 'error'
          icon: 'mdi-check-circle', // any Vuetify icon
          timeout: 5000, // optional, defaults to 5000
        })
      }
    },
    computed: {
      ...mapGetters('referential', {
        barnStockItems: 'barnStockItemList',
      }),
      ...mapGetters('simulator/report', {
        stockNcoastData: 'getStockNcoastData',
        dimensioning: 'getDimensioning',
      }),
      ...mapState('simulator', {
        simulation: (state) => state,
      }),
    },
    methods: {
      isValidSimulation() {
        if (Object.keys(this.simulation.farm.totalAvailablePastureByPeriod).length <= 0) {
          return false
        } else {
          return true
        }
      },
      mapDataForModule(requiredState) {
        const mappedData = {}
        if (requiredState) {
          // Mapper uniquement les données du state nécessaires pour ce module
          requiredState.forEach((key) => {
            if (this[key] !== undefined) {
              mappedData[key] = this[key]
            }
          })
        }
        return mappedData
      },

      async loadModules() {
        const modules = [...moduleList]
        for (const mod of moduleList) {
          try {
            // Chargement dynamique du composant en fonction du nom du module
            mod.component = (await import(`@/components/parts/report/modules/${mod.moduleName}.vue`)).default
            // Mapper uniquement les données nécessaires pour ce module
            mod.data = this.mapDataForModule(mod.requiredState)
          } catch (error) {
            console.error(`Erreur lors du chargement du module ${mod.moduleName}:`, error)
          }
        }
        this.modules = modules
      },
      applyToSimulation() {
        this.$store.dispatch('simulator/report/setSimulation')
        this.$toast({
          message: this.$t('notifications.report.apply_success'),
          type: 'success',
          timeout: 3000,
        })
      },
    },
  }
</script>

<style scoped></style>
