<template>
  <v-dialog
    v-model="showModal"
    persistent
    max-width="40em"
  >
    <v-card>
      <v-card-title>{{ $t('herd.modal.title') }}</v-card-title>
      <v-form
        ref="batchForm"
        @submit.prevent="addLot"
        v-model="valid"
        lazy-validation
      >
        <v-card-text>
          <v-select
            v-model="lotItem.type"
            :items="batchTypes"
            :label="$t('herd.modal.type')"
            item-text="name"
            item-value="id"
            return-object
            :rules="[rules.required]"
            @change="loadProfiles"
            :allow-overflow="true"
          ></v-select>
          <v-autocomplete
            v-model="lotItem.profile"
            :items="animalProfiles"
            :label="$t('herd.modal.profile')"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            return-object
            required
            clearable
            :allow-overflow="true"
          >
          </v-autocomplete>
          <v-text-field
            v-model.number="lotItem.count"
            :rules="[rules.required, rules.integer]"
            :label="$t('herd.modal.count')"
            type="number"
            hide-spin-buttons
            min="0"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="grey"
            @click="cancelAddLot"
          >
            {{ $t('btn.cancel') }}
          </v-btn>
          <v-btn
            :disabled="!valid"
            type="submit"
            color="primary"
            outlined
          >
            {{ $t('btn.save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  export default {
    name: 'HerdModal',
    props: {
      showModal: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        animalProfiles: [],
        lotItem: {
          // 0 est le plus important, n'est pas appliqué
          id: null,
          priorityOrder: null,
          type: null,
          profile: null,
          count: 0,
          housing: {
            type: null,
            presence: [
              // {
              //   period: {},
              //   animalCount: 0,
              //   days: 0,
              // },
            ],
          },
          classicFeeds: [
            // {
            //   period: {},
            //   feeds:[]
            // }
          ],
          concentratedFeeds: [
            // {
            //   period: {},
            //   feeds:[]
            // }
          ],
          pastureStrategy: [],
        },
        selectedType: null,
        animalCount: null,
        valid: true,
        rules: {
          required: (val) => !!val || this.$t('validation.required'),
          integer: (val) => /^\d+$/.test(val) || this.$t('validation.integer'),
        },
      }
    },
    computed: {
      ...mapGetters('referential', {
        batchTypes: 'batchTypeList',
        getAnimalProfiles: 'animalProfileList',
        periods: 'periodList',
      }),
      ...mapGetters('simulator/herd', {
        getNewBatchId: 'getNewBatchId',
      }),
    },
    methods: {
      loadProfiles(item) {
        this.animalProfiles = this.getAnimalProfiles(item.id)
      },
      addLot() {
        if (this.$refs.batchForm.validate()) {
          this.lotItem.housing.presence = Array.from(this.periods, (period) => ({
            period: period,
            animalCount: 0,
            days: 0,
          }))
          // le premier créé est le premier servi
          this.lotItem.id = this.getNewBatchId
          this.lotItem.priorityOrder = this.lotItem.id
          this.lotItem.classicFeeds = Array.from(this.periods, (period) => ({
            period: period,
            feeds: [],
          }))
          this.lotItem.concentratedFeeds = Array.from(this.periods, (period) => ({ period: period, feeds: [] }))
          this.lotItem.pastureStrategy = Array.from(this.periods, (period) => ({ carryOver: null }))
          this.$emit('add-lot', this.lotItem)
          this.resetForm()
        }
      },
      cancelAddLot() {
        this.resetForm()
        this.$emit('cancel-add-lot')
      },
      resetForm() {
        this.lotItem = {
          id: null,
          priorityOrder: null,
          type: null,
          profile: null,

          count: 0,
          housing: {
            type: null,
            presence: [],
          },
          classicFeeds: [],
          concentratedFeeds: [],
          pastureStrategy: [],
        }
        this.$refs.batchForm.reset()
      },
    },
  }
</script>
<style scoped></style>
