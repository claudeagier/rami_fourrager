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
            @change="loadProfils"
            :allow-overflow="true"
          ></v-select>
          <v-select
            v-model="lotItem.profil"
            :items="animalProfils"
            label="Profil"
            item-text="name"
            item-value="id"
            return-object
            :rules="[rules.required]"
            :allow-overflow="true"
          ></v-select>
          <v-text-field
            v-model.number="lotItem.count"
            :rules="[rules.required, rules.integer]"
            label="Nombre d'animaux"
            type="number"
            hide-spin-buttons
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
        lotItem: {
          type: null,
          profil: null,
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
    created() {
      this.$store.dispatch('simulator/fetchBatchTypes')
    },
    computed: {
      ...mapGetters('simulator', {
        batchTypes: 'batchTypeList',
        animalProfils: 'animalProfilList',
        periods: 'periodList',
      }),
    },
    methods: {
      loadProfils(item) {
        this.$store.dispatch('simulator/fetchAnimalProfils', item.id)
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
          profil: null,
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
