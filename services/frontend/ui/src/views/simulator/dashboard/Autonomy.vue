<template>
  <base-dashboard-card
    title="Autonomie"
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
                    type="warning"
                  >
                    Pas autonome
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
                    type="success"
                  >
                    Au potentiel
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
    methods: {},
  }
</script>

<style lang="scss" scoped></style>
