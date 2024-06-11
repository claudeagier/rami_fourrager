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
            {{ $t('herd.pasture.table.period', { id: period.id }) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t('herd.pasture.table.available') }}</td>
          <td
            v-for="(period, index) in periods"
            :key="index"
          >
            {{ availablePasture[index] }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('herd.pasture.table.carryOver') }}</td>
          <td
            v-for="(period, index) in periods"
            :key="index"
          >
            {{ availableCarryOver[index] }}
          </td>
        </tr>

        <tr>
          <td>{{ $t('herd.pasture.table.report') }}</td>
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
