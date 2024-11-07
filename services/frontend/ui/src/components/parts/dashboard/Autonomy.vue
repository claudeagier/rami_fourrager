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
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-alert
                    v-bind="attrs"
                    v-on="on"
                    class="pa-1 ma-2"
                    dense
                    :type="
                      autonomy > 0 ? $t('autonomy.autonomy.step.high.color') : $t('autonomy.autonomy.step.low.color')
                    "
                  >
                    {{
                      autonomy > 0 ? $t('autonomy.autonomy.step.high.label') : $t('autonomy.autonomy.step.low.label')
                    }}
                  </v-alert>
                </template>

                <span>{{ $t('autonomy.autonomy.tooltip.punchline') }}</span>
                <br />
                <span>{{ $t('autonomy.autonomy.tooltip.details') }}</span>
              </v-tooltip>
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-alert
                    v-bind="attrs"
                    v-on="on"
                    class="pa-1 ma-2"
                    dense
                    :type="
                      potential >= 90
                        ? $t('autonomy.potential.step.high.color')
                        : $t('autonomy.potential.step.low.color')
                    "
                  >
                    {{
                      potential >= 90
                        ? $t('autonomy.potential.step.high.label', { rating: potential })
                        : $t('autonomy.potential.step.low.label', { rating: potential })
                    }}
                  </v-alert>
                </template>
                <span>{{ $t('autonomy.potential.tooltip.punchline') }}</span>
                <br />
                <span>{{ $t('autonomy.potential.tooltip.details') }}</span>
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
  // TODO traduction
  // TEST les couleurs des alertes en fonction de la trad
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
