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
          <climat
            :siteModel="simulation.site"
            :siteDropdownOptions="siteList"
            @changeSite="handleSiteChange"
            :climaticYearModel="simulation.climaticYear"
            :climaticYearDropdownOptions="climaticYears"
            @changeClimaticYear="handleCYchange"
            @confirmSiteChange="deleteStics"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
          lg="3"
          class="pt-0 pb-0"
        >
          <v-card
            max-height="250px"
            min-height="250px"
            class="pa-3 mb-1 mt-0"
          ></v-card>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="6"
          class="pt-0 pb-0"
        >
          <v-card
            max-height="150px"
            class="pa-3 mb-1 mt-0"
            color="#4caf5073"
            dark
          >
            <v-card-title class="text-h3 font-weight-light">
              {{ 'La simulation' }}
            </v-card-title>
            <v-card-subtitle
              v-if="simulation.name"
              class="mt-0 text-subtitle-1 font-weight-light"
            >
              {{ $t('dashboard.simulation.name', { name: simulation.name }) }}
            </v-card-subtitle>
            <v-card-text
              v-if="simulation.description"
              class="text-body-1"
            >
              {{ $t('dashboard.simulation.description', { desc: simulation.description }) }}
            </v-card-text>
          </v-card>
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
  import Climat from './Climat.vue'

  export default {
    name: 'Dashboard',
    mixins: [navigationGuard],
    components: {
      Farm,
      Report,
      Barn,
      Herd,
      Climat,
    },
    confirmNavigation(callback) {
      this.$confirmNavigation(callback)
    },
    data() {
      return {
        climaticYears: [],
        sticsIsDeleted: false,

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
        if (!this.sticsIsDeleted) {
          console.log('site is deleted')
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
