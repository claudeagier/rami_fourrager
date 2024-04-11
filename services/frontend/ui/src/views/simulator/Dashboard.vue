<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <div>
      <workspace-export />
    </div>
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
          value="+245"
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
          :dropdownOptions="climaticYearList"
          @change="handleCYchange"
        />
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
          <h3 class="card-title font-weight-light mt-2 ml-2">La grange</h3>
          <v-btn
            class="ml-2"
            min-width="0"
            to="/barn"
          >
            La grange
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
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                >
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h3 class="card-title font-weight-light mt-2 ml-2">La ferme</h3>
          <v-btn
            class="ml-2"
            min-width="0"
            to="/farm"
          >
            La Ferme
          </v-btn>
          <!--
          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Last Last Campaign Performance
          </p> -->

          <!-- <template v-slot:actions>
            <v-icon
              class="mr-1"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="text-caption grey--text font-weight-light">
              campaign sent 26 minutes ago
            </span>
          </template> -->
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
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                >
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h3 class="card-title font-weight-light mt-2 ml-2">le troupeau</h3>
          <v-btn
            class="ml-2"
            min-width="0"
            to="/herd"
          >
            Le troupeau
          </v-btn>
          <!--
          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Last Last Campaign Performance
          </p> -->

          <!-- <template v-slot:actions>
            <v-icon
              class="mr-1"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="text-caption grey--text font-weight-light">
              campaign sent 26 minutes ago
            </span>
          </template> -->
        </base-material-chart-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex'
  import WorkspaceExport from './WorkspaceExport.vue'

  export default {
    name: 'Dashboard',
    components: { WorkspaceExport },
    data() {
      return {
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
      this.$store.dispatch('simulator/fetchSites')
    },
    computed: {
      ...mapState('simulator', {
        selectedSite: (state) => state.site,
        selectedCY: (state) => state.climaticYear,
      }),
      ...mapGetters('simulator', {
        siteList: 'siteList',
        climaticYearList: 'climaticYearList',
        periods: 'periodList',
      }),
      ...mapGetters('simulator/farm', {
        availablePastures: 'getAvailablePasture',
      }),
      farmGraph() {
        // const rotations = this.$store.getters.farmRotation
        // const rotationExample = {
        //   soil: 'code baguettes',
        //   name: 'nom de la baguette',
        //   constraint: 'constraintSurfaces_key or null',
        //   surface: 15,
        //   stic: {
        //     // les autres champs de stic db
        //     stic_period: [
        //       {
        //         id: 1,
        //         period_id: 1,
        //         production: 2.5,
        //         farming_method: 'P',
        //       },
        //     ],
        //   },
        // }
        // rotations.forEach((rot) => {
        //   const periods = rot.stic.stic_period
        //   const count = Array.from({ length: periods.length }, () => 0)
        //   for (let i = 0; i < periods; i++) {
        //     if (periods[i].farming_method === 'P') {
        //       count[periods[i].period_id] += periods[i].production // float
        //     }
        //   }
        // })
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
      ...mapMutations('simulator', {
        setSite: 'setSite',
        setClimaticYear: 'setClimaticYear',
      }),
      handleSiteChange(id) {
        this.setSite(id)
        this.$store.dispatch('simulator/fetchClimaticYears', id)
      },
      handleCYchange(id) {
        this.setClimaticYear(id)
        this.$store.dispatch('simulator/fetchStics', id)
      },
    },
  }
</script>
