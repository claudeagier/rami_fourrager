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
        v-for="(period, index) in periods"
        :key="index"
        @click="periodSelected(index)"
      >
        {{ $t('period', { id: period.id }) }}
      </v-tab>
      <v-tab-item
        v-for="(period, index) in periods"
        :key="index"
      >
        <v-toolbar
          color="white"
          flat
        >
          <v-toolbar-title> {{ $t('herd.housing.title', { id: period.id }) }} </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <duplicate-modal
            :ids="periods"
            :sourceItem="period"
            @duplicate="duplicate"
          />
        </v-toolbar>
        <v-card>
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
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import HousingGraph from './HousingGraph.vue'
  import DuplicateModal from './DuplicateModal.vue'

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
      DuplicateModal,
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
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
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
