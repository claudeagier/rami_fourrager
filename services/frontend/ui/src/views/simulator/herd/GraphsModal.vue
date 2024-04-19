<template>
  <modal
    :width="300"
    :height="300"
    :adaptive="true"
  >
    <feeds-requirements-graph :selectedLot="selectedLot" />
  </modal>
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
    overscroll-behavior: contain;
  }
</style>
