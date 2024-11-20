<template>
  <v-container>
    <base-period-layout
      :pageColor="pageColor"
      toolBarTitleKey="herd.housing.title"
      @selected="periodSelected"
      @duplicate="duplicate"
    >
      <template v-slot:graph>
        <housing-graph
          :selectedLot="selectedLot"
          :selection="selectedPeriodIndex"
        />
      </template>
      <template v-slot:tab-item>
        <v-text-field
          v-model.number="animalCount"
          :rules="[rules.required, rules.integer, presenceRule]"
          type="number"
          :label="$t('herd.housing.count')"
          hide-spin-buttons
          min="0"
          :color="pageColor"
        ></v-text-field>
        <v-text-field
          v-model.number="days"
          :rules="[rules.required, daysRule]"
          type="number"
          :label="$t('herd.housing.presence')"
          hide-spin-buttons
          min="0"
          :color="pageColor"
        ></v-text-field>
      </template>
    </base-period-layout>
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
        immediate: true,
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
          required: (val) => !!val || this.$t('validation.required'),
          integer: (val) => /^\d+$/.test(val) || this.$t('validation.integer'),
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
      periodSelected(period) {
        this.selectedPeriodIndex = period
      },
      duplicate({ source, targets }) {
        this.$store.commit('simulator/herd/duplicatePresenceByPeriod', {
          batchId: this.selectedLot,
          source: source,
          targets: targets,
        })
      },
      presenceRule(val) {
        if (!val) return true
        return parseInt(val) <= parseInt(this.batch.count) || this.$t('validation.herd.housing.presence')
      },
      daysRule(val) {
        if (!val) return true
        return parseInt(val) <= 28 || this.$t('validation.herd.housing.days')
      },
    },
  }
</script>
