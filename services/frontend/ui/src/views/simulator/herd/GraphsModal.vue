<template>
  <v-dialog
    content-class="graph-modal"
    v-model="showModal"
    background-color="white"
    no-click-animation
    persistent
    hide-overlay
    max-width="50em"
    max-height="40em"
    origin="top left"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :color="pageColor"
        v-on="on"
        outlined
      >
        {{ $t('herd.details.graph.btn') }}
      </v-btn>
    </template>
    <v-card>
      <feeds-requirements-graph :selectedLot="selectedLot" />
    </v-card>
  </v-dialog>
</template>
<script>
  import FeedsRequirementsGraph from './FeedsRequirementsGraph.vue'

  export default {
    name: 'GraphsModal',
    components: {
      FeedsRequirementsGraph,
    },
    props: {
      selectedLot: {
        type: null,
        required: true,
      },
      pageColor: {
        type: String,
        required: true,
      },
    },
    watch: {
      selectedLot: {
        immediate: true,
        handler(newValue, oldValue) {
          // this.batch = this.getBatch(newValue)
        },
      },
    },
    data() {
      return {
        showModal: false,
      }
    },
  }
</script>
<style>
  .graph-modal.v-dialog:not(.v-dialog--fullscreen) {
    top: 0 !important;
    left: 0 !important;
    position: absolute !important;
  }
</style>
