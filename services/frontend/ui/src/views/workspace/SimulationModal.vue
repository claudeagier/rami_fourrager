<template>
  <v-dialog
    persistent
    no-click-animation
    v-model="dialog"
    max-width="600"
  >
    <v-card>
      <v-card-title>{{ $t('workspace.content.datatables.simulation.create.dialog.title') }}</v-card-title>
      <v-form
        ref="simulationForm"
        v-model="valid"
        @submit.prevent="saveItem"
        lazy-validation
      >
        <v-card-text>
          <v-text-field
            v-model="simulation.name"
            label="Nom"
            :rules="[rules.required]"
          ></v-text-field>
          <v-textarea
            v-model="simulation.description"
            label="Description"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            text
            @click="cancelModal"
          >
            {{ $t('workspace.content.datatables.simulation.create.dialog.btn_cancel') }}
          </v-btn>
          <v-btn
            outlined
            color="green"
            type="submit"
            :disabled="!valid"
          >
            {{ $t('workspace.content.datatables.simulation.create.dialog.btn_create') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import { deepCopy } from '@/plugins/utils'

  export default {
    name: 'SticModal',
    props: {
      item: {
        type: null,
        required: true,
      },
      dialog: Boolean,
    },
    watch: {
      item: {
        immediate: true,
        handler(newValue, oldValue) {
          if (newValue != null) {
            this.simulation = deepCopy(newValue)
          }
        },
      },
    },
    data() {
      return {
        simulation: {},
        valid: true,
        rules: {
          required: (value) => !!value || this.$t('validation.required'),
          number: (value) => (!isNaN(value) && isFinite(value)) || this.$t('validation.number'),
        },
      }
    },
    methods: {
      cancelModal() {
        this.clearItem()
        this.$emit('cancel-modal', 'simulation')
      },
      clearItem() {
        this.$refs.simulationForm.reset()
        this.simulation = {}
      },
      saveItem() {
        if (this.$refs.simulationForm.validate()) {
          const sim = {
            name: '',
            site: null,
            climaticYear: null,
            lastModifiedDate: '',
            loaded: false,
            farm: {
              rotations: [],
              totalAvailablePastureByPeriod: null,
              dimensioning: {
                SAU: null,
                constrainedSurfaces: { irrigable: null, ploughable: null, superficial: null, reachable: null },
              },
            },
            barn: {
              initialStocks: [],
              stockByPeriod: [],
              refusalRate: 0,
              totalStrawStockProducted: 0,
            },
            herd: {
              batchs: [],
            },
            report: {
              soldedStock: {
                P: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
                FH: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
                EH: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
                EM: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
                RC: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
                RP: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
                AS: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
                EL: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
                FL: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
                STRAW: { purchaseCost: 0, sale: 0, costOfSell: 0, productionCost: 0 },
              },
            },
          }
          sim.name = this.simulation.name
          sim.description = this.simulation.description

          this.$emit('add-item', { dialogName: 'simulation', item: deepCopy(sim) })
          this.$toast({
            message: this.$t('workspace.content.datatables.simulation.create.dialog.add_success'),
            type: 'success',
            timeout: 3000,
          })
          this.cancelModal()
        } else {
          this.$toast({
            message: this.$st('workspace.content.datatables.simulation.create.dialog.add_error'),
            type: 'warning',
            timeout: 5000,
          })
        }
      },
    },
  }
</script>

<style scoped>
  .v-text-field {
    margin-bottom: 16px;
  }
</style>
