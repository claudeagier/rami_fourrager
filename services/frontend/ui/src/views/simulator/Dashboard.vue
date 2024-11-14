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
  import Farm from '@/components/parts/dashboard/Farm'
  import Report from '@/components/parts/dashboard/Report'
  import Barn from '@/components/parts/dashboard/Barn'
  import Herd from '@/components/parts/dashboard/Herd'
  import Climat from '@/components/parts/dashboard/Climat.vue'
  import Autonomy from '@/components/parts/dashboard/Autonomy'
  import Simulation from '@/components/parts/dashboard/Simulation.vue'
  // TODO impression
  // TODO mise en page
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
