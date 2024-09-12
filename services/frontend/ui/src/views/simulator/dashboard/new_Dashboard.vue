<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-dialog
      :value="!simulation.loaded"
      max-width="500"
      persistent
      no-click-animation
      outlined
    >
      <v-card class="text-center">
        <v-card-title class="text-h5"> {{ $t('dashboard.no_simulation_dialog.title') }} </v-card-title>
        <v-card-text class="text-body-1 text-center">
          {{ $t('dashboard.no_simulation_dialog.row1') }} <br />
          {{ $t('dashboard.no_simulation_dialog.for') }} <br />
          {{ $t('dashboard.no_simulation_dialog.row2') }} <br />
          {{ $t('dashboard.no_simulation_dialog.or') }} <br />
          {{ $t('dashboard.no_simulation_dialog.row3') }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="primary"
            outlined
            @click="goToWorkspace"
          >
            {{ $t('dashboard.no_simulation_dialog.btn_workspace') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-if="simulation.loaded">
      <v-row>
        <v-col
          cols="12"
          lg="7"
          md="6"
          class="pt-0 pb-0"
        >
          <base-material-card
            color="grey"
            min-height="130"
          >
            <template v-slot:heading>
              <v-row>
                <v-col cols="10">
                  <div class="text-h3 font-weight-light">{{ 'La simulation' }}</div>
                </v-col>
              </v-row>
            </template>
            <v-card-text>
              <!-- probleme de date -->
              <div v-if="simulation.name">{{ $t('dashboard.simulation.name', { name: simulation.name }) }}</div>
              <div v-if="simulation.description">
                {{ $t('dashboard.simulation.description', { desc: simulation.description }) }}
              </div>
            </v-card-text>
          </base-material-card>
        </v-col>
        <v-col
          cols="12"
          lg="5"
          md="6"
          class="pt-0 pb-0"
        >
          <base-material-card
            color="#F39C12"
            min-height="130"
          >
            <v-card-text>
              <v-spacer></v-spacer>
              <div class="text-h3 font-weight-light">{{ 'Autonomie et Potentiel' }}</div>
              <v-divider></v-divider>
              <v-row justify="center">
                <v-col cols="6">
                  <v-row>
                    <v-col
                      cols="6"
                      class="pt-0 pb-0"
                      align-self="end"
                    >
                      <gauge
                        :gaugeValue="-0.02"
                        :min="-0.5"
                        :max="0.5"
                        :floor="0"
                        gaugeName="Autonomie"
                        :gaugeOptions="gaugeOptions"
                      />
                    </v-col>
                    <v-col
                      cols="6"
                      class="pt-0 pb-0"
                      align-self="end"
                    >
                      <gauge
                        :min="0"
                        :max="140"
                        :floor="90"
                        :gaugeValue="93"
                        gaugeName="Potentiel"
                        :gaugeOptions="gaugeOptions"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </base-material-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="2"
          md="6"
          class="pt-0 pb-0"
        >
          <base-select-card
            :model="selectedSite"
            color="red"
            icon="mdi-earth"
            title="Site"
            sub-icon="mdi-clock"
            sub-text="Just Updated"
            :dropdownOptions="siteList"
            @change="handleSiteChange"
          />
          <base-select-card
            v-if="selectedSite != null"
            :model="selectedCY"
            color="orange"
            icon="mdi-thermometer-lines"
            title="Année climatique"
            value="+245"
            sub-icon="mdi-clock"
            sub-text="Just Updated"
            :dropdownOptions="climaticYears"
            @change="handleCYchange"
          />
          <v-skeleton-loader
            v-if="selectedSite === null"
            max-height="130"
            class="mt-8"
            type="card"
          ></v-skeleton-loader>
        </v-col>
        <v-col
          cols="12"
          lg="10"
          class="pt-0 pb-0"
        >
          <v-row>
            <!-- farm -->
            <v-col
              cols="12"
              md="6"
              class="pt-0 pb-0"
            >
              <farm />
            </v-col>
            <!-- herd -->
            <v-col
              cols="12"
              md="6"
              class="pt-0 pb-0"
            >
              <herd />
            </v-col>
          </v-row>
          <v-row>
            <!-- barn -->
            <v-col
              cols="12"
              md="6"
              class="pt-0 pb-0"
            >
              <barn />
            </v-col>
            <!-- report -->
            <v-col
              cols="12"
              md="6"
              class="pt-0 pb-0"
            >
              <report />
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
  import Farm from './Farm'
  import Report from './Report'
  import Barn from './Barn'
  import Herd from './Herd'
  import Gauge from '@/components/base/Gauge'

  export default {
    name: 'Dashboard',
    components: {
      Farm,
      Report,
      Barn,
      Herd,
      Gauge,
    },
    mixins: [navigationGuard],
    confirmNavigation(callback) {
      this.$confirmNavigation(callback)
    },
    data() {
      return {
        gaugeOptions: {
          size: {
            width: 'auto',
            height: '100 px',
          },
          lineStyle: {
            width: 10,
          },
        },
        climaticYears: [],
      }
    },
    created() {
      if (this.selectedSite) {
        this.climaticYears = this.getClimaticYearList(this.selectedSite)
      }
    },
    computed: {
      ...mapState('simulator', {
        simulation: (state) => state,
        selectedSite: (state) => state.site,
        selectedCY: (state) => state.climaticYear,
      }),
      ...mapGetters('referential', {
        siteList: 'siteList',
        getClimaticYearList: 'climaticYearList',
        periods: 'periodList',
      }),
      ...mapGetters('simulator/farm', {
        availablePastures: 'getAvailablePasture',
      }),
      ...mapGetters('simulator/farm', {
        availablePastures: 'getAvailablePasture',
      }),
      ...mapGetters('workspace', {
        getActivatedSimulation: 'getActivatedSimulation',
      }),

      farmGraph() {
        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']
        const graph = {
          type: 'Bar',
          data: {
            labels: periods,
            series: [this.availablePastures],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 1000,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
          responsiveOptions: [
            [
              'screen and (max-width: 640px)',
              {
                seriesBarDistance: 2,
                axisX: {
                  labelInterpolationFnc: function (value) {
                    return value[0]
                  },
                },
              },
            ],
          ],
        }
        return graph
      },
    },
    methods: {
      ...mapMutations('simulator', { setSimulation: 'setSimulation' }),
      ...mapMutations('simulator', {
        setSite: 'setSite',
        setClimaticYear: 'setClimaticYear',
      }),
      ...mapActions('workspace', { activateSimulation: 'activateSimulation' }),
      addSimulationToWorkspace() {
        this.$store.commit('workspace/addSimulation', this.simulation)
      },
      goToWorkspace() {
        this.$router.push('/workspace')
      },
      loadSimulation(simulation) {
        this.setSimulation({
          name: simulation.name,
          site: simulation.site,
          climaticYear: simulation.climaticYear,
          loaded: true,
        })
        this.activateSimulation(simulation)
        this.$toast({
          message: this.$t('notifications.simulation_loaded_success'),
          type: 'success',
          timeout: 3000,
        })
        // this.$router.push('/simulation')
      },
      handleSiteChange(id) {
        this.setSite(id)
        this.climaticYears = this.getClimaticYearList(id)
      },
      handleCYchange(id) {
        this.setClimaticYear(id)
      },
    },
  }
</script>
