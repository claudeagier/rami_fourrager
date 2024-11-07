<template>
  <base-dashboard-card
    title="dashboard.simulation.title"
    cardColor="#4caf5073"
    titleColor="transparent"
    :dark="true"
    icon="mdi-head-cog-outline"
  >
    <template
      v-slot:subtitle
      v-if="simulation.name"
    >
      {{ $t('dashboard.simulation.name', { name: simulation.name }) }}
    </template>
    <template v-slot:content>
      {{ $t('dashboard.simulation.description', { desc: simulation.description }) }}
    </template>
  </base-dashboard-card>
  <!-- <v-card
    max-height="150px"
    color="#4caf5073"
    dark
  >
    <v-card-title
      class="text-h3 font-weight-light"
      style="font-size: 18px !important"
    >
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
  </v-card> -->
</template>
<script>
  // TODO simulation description en infobulles
  import { mapState } from 'vuex'
  export default {
    name: 'SimulationCard',
    computed: {
      ...mapState('simulator', {
        simulation: (state) => state,
      }),
    },
  }
</script>
