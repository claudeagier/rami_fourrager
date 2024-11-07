<template>
  <base-dashboard-card
    :title="$t('dashboard.simulation.title')"
    cardColor="#4caf5073"
    titleColor="transparent"
    :dark="true"
    icon="mdi-head-cog-outline"
    :description="$t('dashboard.simulation.description', { desc: simulation.description })"
  >
    <template
      v-slot:subtitle
      v-if="simulation.name"
    >
      {{ $t('dashboard.simulation.name', { name: simulation.name }) }}
    </template>
  </base-dashboard-card>
</template>
<script>
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
