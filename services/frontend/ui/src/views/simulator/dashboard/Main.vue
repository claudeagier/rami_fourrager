<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <div v-if="simulation.loaded">
      <!-- <div>{{ simulator.simulationName }}</div> -->
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
  import Farm from './Farm'
  import Report from './Report'
  import Barn from './Barn'
  import Herd from './Herd'
  import Climat from './Climat.vue'
  import Simulation from './Simulation.vue'
  import Autonomy from './Autonomy'

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
