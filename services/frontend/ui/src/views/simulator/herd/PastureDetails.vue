<template>
  <v-container>
    <v-simple-table>
      <thead>
        <tr>
          <th></th>
          <th
            v-for="(period, index) in periods"
            :key="index"
          >
            Période {{ period.id }}
          </th>
          <!-- <th>Période</th>
          <th>Nb d'animaux présents</th>
          <th>Jours de présence en bâtiment (/28)</th>
          <th>Autre Propriété 1</th>
          <th>Autre Propriété 2</th> -->
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Animal count</td>
          <td
            v-for="(period, index) in periods"
            :key="index"
          >
            <v-text-field
              v-model.number="animalCount[index]"
              :rules="[rules.required, rules.integer, presenceRule]"
              type="number"
              label="Nb d'animaux présents"
              hide-spin-buttons
              min="0"
              :color="pageColor"
              @input="updateAnimalCount(index, $event)"
            ></v-text-field>
          </td>
        </tr>
        <tr>
          <td>Présence</td>
          <td
            v-for="(period, index) in periods"
            :key="index"
          >
            <v-text-field
              v-model.number="days[index]"
              :rules="[rules.required, daysRule]"
              type="number"
              label="Jours de présence en bâtiment (/28)"
              hide-spin-buttons
              min="0"
              :color="pageColor"
              @input="updateDays(index, $event)"
            ></v-text-field>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  // import DuplicateModal from './DuplicateModal.vue'

  export default {
    name: 'PastureDetails',
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
      // HousingGraph,
      // DuplicateModal,
    },
    beforeMount() {
      this.batch = this.getBatch(this.selectedLot)
    },
    data() {
      return {
        batch: null,
        pastureStrategy: Array.from({ length: 13 }, (v, k) => ({ period_id: k + 1, carryOver: 0 })),
        selectedPeriodIndex: 0,
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
      }
    },
    computed: {
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
      ...mapGetters('simulator/herd', {
        getHousingDetailByPeriod: 'getHousingDetailByPeriod',
        getBatch: 'getBatch',
      }),
      animalCount() {
        return this.periods.map((_, index) => this.getAnimalCount(index))
      },
      days() {
        return this.periods.map((_, index) => this.getDays(index))
      },
    },
    methods: {
      ...mapMutations('simulator/herd', {
        setAnimalCount: 'setHousingAnimalCountByPeriod',
        setDays: 'setHousingDaysByPeriod',
      }),
      getAnimalCount(index) {
        return this.batch.housing.presence[index].animalCount
      },
      updateAnimalCount(index, value) {
        this.setAnimalCount({
          batchId: this.selectedLot,
          periodId: index,
          value: value,
        })
      },
      getDays(index) {
        return this.batch.housing.presence[index].days
      },
      updateDays(index, value) {
        this.setDays({
          batchId: this.selectedLot,
          periodId: index,
          value: value,
        })
      },
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
