<template>
  <v-container>
    <housing-graph
      :selectedLot="selectedLot"
      :selection="selectedPeriodIndex"
    />

    <v-tabs
      centered
      :color="pageColor"
    >
      <v-tab
        v-for="(period, index) in 13"
        :key="index"
        @click="housingPeriodSelected(index)"
      >
        Période {{ index + 1 }}
      </v-tab>
      <v-tab-item
        v-for="(period, index) in 13"
        :key="index"
      >
        <v-toolbar
          color="white"
          flat
        >
          <v-toolbar-title> Présence en batiment pour la période {{ index + 1 }} </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <!-- <v-btn
            color="grey"
            text
          >
            dupliquer
          </v-btn> -->
        </v-toolbar>
        <v-card>
          <v-text-field
            v-model="animalCount"
            :rules="[rules.required, rules.integer, presenceRule]"
            type="number"
            label="Nb d'animaux présents"
            hide-spin-buttons
            :color="pageColor"
          ></v-text-field>
          <v-text-field
            v-model="days"
            :rules="[rules.required, rules.integer, daysRule]"
            type="number"
            label="Jours de présence en bâtiment (/28)"
            hide-spin-buttons
            :color="pageColor"
          ></v-text-field>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import HousingGraph from './HousingGraph.vue'

  export default {
    name: 'housingDetails',
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
    components: {
      HousingGraph,
    },
    watch: {
      selectedLot: {
        immediate: true, // Execute lorsque le composant est monté
        handler(newValue, oldValue) {
          this.batch = this.getBatch(newValue)
        },
      },
    },
    data() {
      return {
        batch: null,
        selectedPeriodIndex: 0,
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
      }
    },
    computed: {
      ...mapGetters('simulator/herd', {
        getHousingDetailByPeriod: 'getHousingDetailByPeriod',
        getBatch: 'getBatch',
      }),
      animalCount: {
        get() {
          return this.batch.housing.presence[this.selectedPeriodIndex].animalCount
        },
        set(val) {
          this.setAnimalCount({
            batchId: this.selectedLot,
            periodId: this.selectedPeriodIndex,
            value: val,
          })
        },
      },
      days: {
        get() {
          return this.batch.housing.presence[this.selectedPeriodIndex].days
        },
        set(val) {
          this.setDays({
            batchId: this.selectedLot,
            periodId: this.selectedPeriodIndex,
            value: val,
          })
        },
      },
    },
    methods: {
      ...mapMutations('simulator/herd', {
        setAnimalCount: 'setHousingAnimalCountByPeriod',
        setDays: 'setHousingDaysByPeriod',
      }),
      housingPeriodSelected(period) {
        this.selectedPeriodIndex = period
      },
      // housing
      presenceRule(val) {
        if (!val) return true
        return (
          parseInt(val) <= parseInt(this.batch.count) ||
          "La présence en bâtiment doit être inférieure ou égale au nombre d'animaux"
        )
      },
      daysRule(val) {
        if (!val) return true
        return parseInt(val) <= 28 || 'Le nombre de jours de présence doit être inférieur ou égal à 28'
      },
    },
  }
</script>
