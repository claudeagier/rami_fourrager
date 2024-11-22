<template>
  <base-material-card color="orange">
    <template v-slot:heading>
      <v-row>
        <v-col>
          <div class="text-h3 font-weight-light">{{ $t('herd.title') }}</div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <div>
            <v-btn
              class="ml-2"
              color="orange"
              style="background-color: white"
              outlined
              min-width="0"
              to="/simulation/herd"
            >
              {{ $t('btn.complete') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:content>
      <div class="herd-chart-container">
        <v-row
          v-for="(batch, index) in batchs"
          :key="index"
        >
          <graph-feeds-requirements
            :selected-lot="index"
            @click="handleRequirementsClick"
            :withYaxis="false"
            :withLegend="false"
            :xAxisLabelRotate="true"
            :layout="{ width: 'auto', height: '200px' }"
            :withTitle="true"
            :title="$t('dashboard.herd.graph.title', { id: index + 1 })"
          />
        </v-row>
      </div>
    </template>
  </base-material-card>
</template>
<script>
  import GraphFeedsRequirements from '@/components/parts/herd/GraphFeedsRequirements.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'herd-dashboard',
    components: {
      GraphFeedsRequirements,
    },
    data() {
      return {}
    },
    computed: {
      ...mapState('simulator/herd', {
        batchs: (state) => state.batchs,
      }),
    },
    methods: {
      handleRequirementsClick(params) {
        this.selectedPeriodIndex = params.dataIndex
      },
    },
  }
</script>
<style>
  .herd-chart-container {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 300px; /* Définissez la hauteur max de votre conteneur */
    padding: 10px; /* Espace en haut pour éviter le tronquage */
    -ms-overflow-style: none; /* Pour Internet Explorer et Edge */
    scrollbar-width: none; /* Pour Firefox */
  }
  .herd-chart-container::-webkit-scrollbar {
    display: none; /* Masque la scrollbar pour Chrome, Safari et Opera */
  }
</style>
