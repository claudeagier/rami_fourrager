<template>
  <v-card>
    <feeds-requirements-graph :selectedLot="selectedLot" />
  </v-card>
</template>

<script>
  import FeedsRequirementsGraph from './FeedsRequirementsGraph.vue'

  export default {
    name: 'GraphsLayout',
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
        // showModal: false,
      }
    },
    methods: {
      // handleScroll(event) {
      //   event.preventDefault() // Si nécessaire
      //   // Votre logique de gestion du défilement ici
      // },
    },
  }
</script>
