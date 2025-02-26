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
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ $t('herd.pasture.table.period', { id: period.id }) }}
                </div>
              </template>
              <span>
                {{ period.dates }}
              </span>
            </v-tooltip>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <td
                v-bind="attrs"
                v-on="on"
              >
                {{ $t('herd.pasture.table.available.header') }}
              </td>
            </template>
            <p>
              {{ $t('herd.pasture.table.available.tooltip') }}
            </p>
          </v-tooltip>
          <td
            v-for="(period, index) in periods"
            :key="index"
          >
            {{ availablePasture[index] }}
          </td>
        </tr>
        <tr>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <td
                v-bind="attrs"
                v-on="on"
              >
                {{ $t('herd.pasture.table.carryOver.header') }}
              </td>
            </template>
            <p>
              {{ $t('herd.pasture.table.carryOver.tooltip') }}
            </p>
          </v-tooltip>
          <td
            v-for="(period, index) in periods"
            :key="index"
          >
            {{ availableCarryOver[index] }}
          </td>
        </tr>

        <tr>
          <v-tooltip
            top
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <td
                v-bind="attrs"
                v-on="on"
              >
                {{ $t('herd.pasture.table.report.header') }}
              </td>
            </template>
            <p>
              {{ $t('herd.pasture.table.report.tooltip') }}
            </p>
          </v-tooltip>
          <td
            v-for="(period, index) in periods"
            :key="index"
          >
            <pasture-strategy-form
              :selected-lot="selectedLot"
              :period="index"
            ></pasture-strategy-form>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import PastureStrategyForm from './PastureStrategyForm.vue'
  export default {
    name: 'PastureDetails',
    components: { PastureStrategyForm },
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
        getBatch: 'getBatch',
        getAvailableGreenPastureByAnimal: 'getAvailableGreenPastureByAnimal',
        getAvailableCarryOverPastureByAnimal: 'getAvailableCarryOverPastureByAnimal',
      }),
      availablePasture() {
        return this.getAvailableGreenPastureByAnimal(this.selectedLot)
      },
      availableCarryOver() {
        return this.getAvailableCarryOverPastureByAnimal(this.selectedLot)
      },
    },
  }
</script>
