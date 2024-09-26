<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <div v-if="simulation.loaded">
      <!-- <div>{{ simulator.simulationName }}</div> -->
      <v-row>
        <v-col
          cols="12"
          sm="3"
          lg="3"
          class="pt-0 pb-0"
        >
          <base-select-card
            :model="simulation.site"
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
          sm="3"
          lg="3"
          class="pt-0 pb-0"
        >
          <base-select-card
            v-if="simulation.site != null"
            :model="simulation.climaticYear"
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
            v-if="simulation.site === null"
            max-height="130"
            class="mt-8"
            type="card"
          ></v-skeleton-loader>
        </v-col>
        <v-col
          class="pt-0 pb-0"
          lg="6"
        >
          <base-material-card
            color="#F39C12"
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
      </v-row>
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

  export default {
    name: 'Dashboard',
    mixins: [navigationGuard],
    components: {
      Farm,
      Report,
      Barn,
      Herd,
    },
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

      farmGraph() {
        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']
        const graph = {
          type: 'Bar',
          data: {
            labels: periods,
            series: [this.availablePastures],
          },
          options: {
            // width: '300px',
            height: '100px',
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 2000,
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
                seriesBarDistance: 1,
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
        setClimaticYear: 'setClimaticYear',
      }),

      handleSiteChange(id) {
        this.$store.commit('simulator/setSite', id)
        this.$store.dispatch('simulator/applyTo', 'site')
        this.climaticYears = this.getClimaticYearList(id)
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
