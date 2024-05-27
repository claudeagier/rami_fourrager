<template>
  <v-dialog
    v-model="showModal"
    persistent
    max-width="40em"
  >
    <v-card>
      <v-card-title>Ajouter un lot</v-card-title>
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
            label="Type de bétail"
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
            label="Nombre d'animaux"
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
            Annuler
          </v-btn>
          <v-btn
            :disabled="!valid"
            type="submit"
            color="primary"
            outlined
          >
            Ajouter
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
        },
        selectedType: null,
        animalCount: null,
        valid: true,
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
      }
    },
    computed: {
      ...mapGetters('referential', {
        batchTypes: 'batchTypeList',
        getAnimalProfiles: 'animalProfileList',
        periods: 'periodList',
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
          this.lotItem.classicFeeds = Array.from(this.periods, (period) => ({ period: period, feeds: [] }))
          this.lotItem.concentratedFeeds = Array.from(this.periods, (period) => ({ period: period, feeds: [] }))
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
          type: null,
          profile: null,
          count: 0,
          housing: {
            type: null,
            presence: [],
          },
          classicFeeds: [],
          concentratedFeeds: [],
        }
        this.$refs.batchForm.reset()
      },
    },
  }
</script>
<style scoped></style>
