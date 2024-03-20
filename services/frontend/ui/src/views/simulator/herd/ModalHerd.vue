<template>
  <v-dialog
    v-model="showModal"
    persistent
    max-width="40em"
  >
    <v-card>
      <v-card-title>Ajouter un lot</v-card-title>
      <v-form @submit.prevent="addLot">
        <v-card-text>
          <v-select
            v-model="lotItem.type"
            :items="batchTypes"
            label="Type de bétail"
            item-text="name"
            item-value="id"
            return-object
            required
            @change="loadProfils"
          ></v-select>
          <v-select
            v-model="lotItem.profil"
            :items="animalProfils"
            label="Profil"
            item-text="name"
            item-value="id"
            return-object
            required
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
            :disabled="!isFormValid"
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
  import { mapState } from 'vuex'
  export default {
    name: 'ModalHerd',
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
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
      }
    },
    created() {
      this.$store.dispatch('fetchBatchTypes')
    },
    computed: {
      ...mapState(['simulator']),
      batchTypes() {
        return this.$store.getters.batchTypeList
      },
      animalProfils() {
        return this.$store.getters.animalProfilList
      },
      isFormValid() {
        if (!this.validateForm()) {
          return false
        }
        return true
      },
    },
    methods: {
      loadProfils(item) {
        this.$store.dispatch('fetchAnimalProfils', item.id)
      },
      addLot() {
        if (this.lotItem.type && this.lotItem.count && this.lotItem.profil && this.validateForm()) {
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
      },
      validateForm() {
        return true
      },
    },
  }
</script>
<style scoped></style>
