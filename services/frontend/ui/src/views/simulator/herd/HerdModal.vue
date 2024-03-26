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
          ></v-select>
          <v-select
            v-model="lotItem.profil"
            :items="animalProfils"
            label="Profil"
            item-text="name"
            item-value="id"
            return-object
            :rules="[rules.required]"
          ></v-select>
          <v-text-field
            v-model="lotItem.count"
            :rules="[rules.required, rules.integer]"
            label="Nombre d'animaux"
            type="number"
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
            presence: Array.from({ length: 13 }, () => ({ period: null, animalCount: 0, days: 0 })),
            // presence: [
            //   // {
            //   //   period: {},
            //   //   animalCount: 0,
            //   //   days: 0,
            //   // },
            // ],
          },
          classicFeeds: Array.from({ length: 13 }, () => ({ period: null, feeds: [] })),
          concentratedFeeds: Array.from({ length: 13 }, () => ({ period: null, feeds: [] })),
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
      }),
    },
    methods: {
      loadProfils(item) {
        this.$store.dispatch('simulator/fetchAnimalProfils', item.id)
      },
      addLot() {
        if (this.$refs.batchForm.validate()) {
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
            presence: Array.from({ length: 13 }, () => ({ period: null, animalCount: 0, days: 0 })),
          },
          classicFeeds: Array.from({ length: 13 }, () => ({ period: null, feeds: [] })),
          concentratedFeeds: Array.from({ length: 13 }, () => ({ period: null, feeds: [] })),
        }
        this.$refs.batchForm.reset()
      },
    },
  }
</script>
<style scoped></style>
