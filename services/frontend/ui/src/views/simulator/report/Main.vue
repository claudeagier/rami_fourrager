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
              <div>{{ $t('report.main.modules.' + mod.descriptionKey) }}</div>
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
  import { moduleConfigurations } from '@/components/modules/Config' // Importez la configuration des modules

  // layout et data de toute la simulation qui est dans l'état ou chaque module prend dans le state qui est le model
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
    },
    computed: {
      ...mapGetters('referential', {
        barnStockItems: 'barnStockItemList',
      }),
      ...mapState('simulator', {
        simulation: (state) => state,
      }),

      moduleList() {
        const modules = [
          {
            name: 'Dimensioning',
            labelKey: 'dimensioning.label',
            descriptionKey: 'dimensioning.description',
            moduleName: 'Dimensioning',
            component: null,
            data: {}, // Les données mappées seront ajoutées ici
          },
        ]
        return modules
      },
    },
    methods: {
      mapDataForModule(moduleName) {
        // Récupérer la configuration de données requises pour le module
        const config = moduleConfigurations[moduleName]
        const mappedData = {}

        if (config && config.requiredState) {
          // Mapper uniquement les données du state nécessaires pour ce module
          config.requiredState.forEach((key) => {
            if (this[key] !== undefined) {
              mappedData[key] = this[key]
            }
          })
        }

        return mappedData
      },

      async loadModules() {
        const modules = [...this.moduleList]
        for (const mod of modules) {
          try {
            // Chargement dynamique du composant en fonction du nom du module
            mod.component = (await import(`@/components/modules/${mod.moduleName}.vue`)).default
            // Mapper uniquement les données nécessaires pour ce module
            mod.data = this.mapDataForModule(mod.moduleName)
          } catch (error) {
            console.error(`Erreur lors du chargement du module ${mod.moduleName}:`, error)
          }
        }
        this.modules = modules
      },
      applyToSimulation() {},
    },
  }
</script>

<style scoped></style>
