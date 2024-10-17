<template>
  <base-dashboard-card
    title="autonomy.title"
    cardColor="blue lighten-3"
    :dark="true"
    icon="mdi-recycle-variant"
  >
    <template v-slot:content>
      <v-row justify="center">
        <v-col cols="12">
          <v-row>
            <v-col
              cols="12"
              class="pt-0 pb-0"
            >
              <!-- <base-gauge
                :gaugeValue="-0.02"
                :min="-0.5"
                :max="0.5"
                :floor="0"
                gaugeName="Autonomie"
                :gaugeOptions="gaugeOptions"
              /> -->
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-alert
                    v-bind="attrs"
                    v-on="on"
                    class="pa-1 ma-2"
                    dense
                    :type="autonomy ? 'success' : 'warning'"
                  >
                    {{ autonomy ? 'Autonome' : 'Pas autonome' }}
                  </v-alert>
                </template>

                <span> Produisant les fourrages grossiers nécessaires </span>
              </v-tooltip>
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-alert
                    v-bind="attrs"
                    v-on="on"
                    class="pa-1 ma-2"
                    dense
                    :type="potential ? 'success' : 'warning'"
                  >
                    {{ potential ? 'Au potentiel' : 'Pas au potentiel' }}
                  </v-alert>
                </template>

                <span> Valorisant l'intégralité de la production fourragère de l'exploitation </span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </base-dashboard-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Autonomy',
    created() {},
    data() {
      return {
        gaugeOptions: {
          size: {
            width: 'auto',
            height: '80 px',
          },
          lineStyle: {
            width: 10,
          },
        },
      }
    },
    computed: {
      ...mapGetters('simulator/report', {
        autonomy: 'getAutonomy',
        potential: 'getPotential',
      }),
    },
    methods: {},
  }
</script>

<style lang="scss" scoped></style>
