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
      <!-- <div>{{ simulator.simulationName }}</div> -->
      <v-row>
        <v-col
          cols="12"
          sm="6"
          lg="3"
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
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
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
        </v-col>
        <v-col>
          <base-material-card color="#F39C12">
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
            </v-card-text>
          </base-material-card>
        </v-col>
      </v-row>
      <v-row>
        <!-- barn -->
        <v-col
          cols="12"
          md="6"
        >
          <base-material-chart-card
            :data="dataCompletedTasksChart.data"
            :options="dataCompletedTasksChart.options"
            color="brown"
            type="Line"
          >
            <h3 class="card-title font-weight-light mt-2 ml-2">{{ $t('barn.title') }}</h3>
            <v-btn
              class="ml-2"
              min-width="0"
              to="/simulation/barn"
            >
              {{ $t('btn.complete') }}
            </v-btn>
          </base-material-chart-card>
        </v-col>
        <!-- farm -->
        <v-col
          cols="12"
          md="6"
        >
          <base-material-chart-card
            :data="farmGraph.data"
            :options="farmGraph.options"
            :responsive-options="farmGraph.responsiveOptions"
            :type="farmGraph.type"
            color="green"
          >
            <h3 class="card-title font-weight-light mt-2 ml-2">{{ $t('farm.title') }}</h3>
            <v-btn
              class="ml-2"
              min-width="0"
              to="/simulation/farm"
            >
              {{ $t('btn.complete') }}
            </v-btn>
          </base-material-chart-card>
        </v-col>
        <!-- herd -->
        <v-col
          cols="12"
          md="6"
        >
          <base-material-chart-card
            :data="dataCompletedTasksChart.data"
            :options="dataCompletedTasksChart.options"
            type="Line"
            color="orange"
          >
            <h3 class="card-title font-weight-light mt-2 ml-2">{{ $t('herd.title') }}</h3>
            <v-btn
              class="ml-2"
              min-width="0"
              to="/simulation/herd"
            >
              {{ $t('btn.complete') }}
            </v-btn>
          </base-material-chart-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import navigationGuard from '@/mixins/navigationGuard'

  export default {
    name: 'Dashboard',
    components: {},
    mixins: [navigationGuard],
    confirmNavigation(callback) {
      this.$confirmNavigation(callback)
    },
    data() {
      return {
        climaticYears: [],

        dataCompletedTasksChart: {
          data: {
            labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
            series: [[230, 750, 450, 300, 280, 240, 200, 190]],
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
        },
        emailsSubscriptionChart: {
          data: {
            labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
            series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]],
          },
          options: {
            axisX: {
              showGrid: false,
            },
            low: 0,
            high: 1000,
            chartPadding: {
              top: 0,
              right: 5,
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
        },
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
