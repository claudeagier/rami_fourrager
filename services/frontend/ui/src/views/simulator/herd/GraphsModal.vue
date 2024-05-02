<template>
  <v-dialog
    v-model="showModal"
    max-width="55em"
    persistent
    content-class="graph-modal"
    hide-overlay
    no-click-animation
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class="mr-2"
        :color="pageColor"
        outlined
        v-on="on"
      >
        {{ $t('herd.details.graph.btn') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <feeds-requirements-graph :selectedLot="selectedLot" />
      </v-card-text>
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
    methods: {
      handleScroll(event) {
        event.preventDefault() // Si nécessaire
        // Votre logique de gestion du défilement ici
      },
    },
  }
</script>
<style>
  .graph-modal.v-dialog:not(.v-dialog--fullscreen) {
    top: 0 !important;
    left: 0 !important;
    position: fixed !important;
  }
</style>
