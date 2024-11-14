<template>
  <base-dashboard-card
    :title="$t('dashboard.report.title')"
    cardColor="blue"
    titleColor="transparent"
    :dark="true"
    icon="mdi-chart-box-outline"
    :withButton="true"
  >
    <template v-slot:content>
      <dimensioning />
    </template>
    <template v-slot:button>
      <v-btn
        icon
        to="/simulation/report"
        color="white"
        dense
      >
        <v-icon
          large
          dense
        >
          mdi-eye-outline
        </v-icon>
      </v-btn>
    </template>
  </base-dashboard-card>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Dimensioning from '../report/Dimensioning.vue'
  export default {
    name: 'report-dashboard',
    components: {
      Dimensioning,
    },
  }
</script>
