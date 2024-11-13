<template>
  <v-container>
    <v-row>
      <v-col
        cols="6"
        class="pt-0 pb-0"
      >
        <v-card
          outlined
          elevation="2"
        >
          <v-card-title class="text-h4 grey--text">
            <v-icon color="primary">mdi-autorenew</v-icon>
            {{ $t('report.main.modules.global.dimensioning.title') }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <dimensioning />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="6"
        class="pt-7 pb-0"
      >
        <!-- Deuxième colonne -->
        <autonomy />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  // TODO traduction
  import Autonomy from '@/components/parts/dashboard/Autonomy.vue'
  import { mapGetters } from 'vuex'
  import Dimensioning from '../Dimensioning.vue'
  export default {
    name: 'global-module',
    components: { Autonomy, Dimensioning },
    props: {
      data: {
        type: Object,
      },
    },
    data() {
      return {
        gaugeOptions: {
          size: {
            width: 'auto',
            height: '200 px',
          },
          lineStyle: {
            width: 10,
          },
        },
      }
    },
    computed: {
      ...mapGetters('simulator/report', {
        dimensioning: 'getDimensioning',
      }),
      initOptions() {
        return {
          width: 300,
          height: 300,
        }
      },
    },
  }
</script>
