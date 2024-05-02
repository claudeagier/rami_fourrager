<template>
  <v-container>
    <v-btn @click="exportData">Exporter</v-btn>
    <v-file-input
      ref="fileInput"
      @change="importData"
    />
  </v-container>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    name: 'Actions',
    // mounted() {
    //   // Cela simule le clic sur le bouton de sélection de fichier lorsqu'on clique sur le bouton "Importer"
    //   // const fileInput = this.$refs.fileInput
    //   // this.$refs.fileInput.addEventListener('click', () => {
    //   //   fileInput.click()
    //   // })
    // },
    computed: {
      ...mapState('simulator', {
        simulation: (state) => state,
      }),
      ...mapState('simulator/farm', {
        farm: (state) => state,
      }),
      ...mapState('simulator/barn', {
        barn: (state) => state,
      }),
      ...mapState('simulator/herd', {
        herd: (state) => state,
      }),
    },
    methods: {
      ...mapMutations('simulator', { setSimulation: 'setSimulation' }),
      ...mapMutations('simulator/farm', { setFarm: 'setFarm' }),
      ...mapMutations('simulator/barn', { setBarn: 'setBarn' }),
      ...mapMutations('simulator/herd', { setHerd: 'setHerd' }),
      exportData() {
        const data = {
          name: this.simulation.simulationName,
          site: this.simulation.site,
          climaticYear: this.simulation.climaticYear,
          farm: this.farm,
          barn: this.barn,
          herd: this.herd,
        }
        const jsonData = JSON.stringify(data)

        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = 'data.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },
      importData(event) {
        if (event !== null && event !== undefined) {
          console.log('event', event)
          const file = event
          const reader = new FileReader()
          reader.readAsText(file)
          reader.onload = (e) => {
            const jsonData = e.target.result
            const simulation = JSON.parse(jsonData)
            // TODO-FRONT à modifier lorsque j'aurai l'import export standard
            this.setSimulation({
              name: simulation.simulationName,
              site: simulation.site,
              climaticYear: simulation.climaticYear,
            })
            this.setFarm(simulation.farm)
            this.setBarn(simulation.barn)
            this.setHerd(simulation.herd)

            // set lists
            this.$store.dispatch('simulator/fetchClimaticYears', simulation.site)
            this.$store.dispatch('simulator/fetchStics', simulation.climaticYear)

            // apply all
            this.$store.dispatch('simulator/barn/setStock')
            this.$store.dispatch('simulator/farm/setTotalAvailablePastureByPeriod')
            this.$store.dispatch('simulator/farm/dispatchProduction')
            this.$store.dispatch('toaster/addNotification', {
              message: 'notifications.simulation_loaded_success',
              color: 'success', // ou 'error', 'warning', 'info', etc.
              show: true,
            })
          }
        }
      },
    },
  }
</script>
