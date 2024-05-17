<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-select
          v-model="type"
          :items="batchTypes"
          label="Type de bétail"
          item-text="name"
          item-value="id"
          return-object
          required
          :color="pageColor"
          :item-color="pageColor"
          @change="loadProfils"
        ></v-select>
        <v-select
          v-model="profil"
          :items="animalProfiles"
          label="Profil"
          item-text="name"
          item-value="id"
          :color="pageColor"
          :item-color="pageColor"
          return-object
          required
        ></v-select>
        <v-text-field
          v-model.number="count"
          :rules="[rules.required, rules.integer]"
          label="Nombre d'animaux"
          type="number"
          min="0"
          :color="pageColor"
          hide-spin-buttons
        ></v-text-field>
        <v-divider></v-divider>
        <v-select
          v-model="housingType"
          :items="housingTypes"
          item-text="name"
          item-value="id"
          return-object
          label="Type de logement"
          :color="pageColor"
          :item-color="pageColor"
        ></v-select>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
  import { mapState, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'batchDetails',
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
          this.loadProfils(this.batch.type)
        },
      },
    },
    data() {
      return {
        animalProfiles: [],
        batch: null,
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
        housingTypes: 'housingTypeList',
      }),
      ...mapGetters('simulator/herd', {
        getBatch: 'getBatch',
      }),

      type: {
        get() {
          return this.batch.type
        },
        set(val) {
          this.setBatchType({
            batchId: this.selectedLot,
            value: val,
          })
        },
      },
      profil: {
        get() {
          return this.batch.profil
        },
        set(val) {
          this.setBatchProfil({
            batchId: this.selectedLot,
            value: val,
          })
        },
      },
      count: {
        get() {
          return this.batch.count
        },
        set(val) {
          this.setBatchCount({
            batchId: this.selectedLot,
            value: val,
          })
        },
      },
      housingType: {
        get() {
          return this.batch.housing.type
        },
        set(val) {
          this.setBatchHousingType({
            batchId: this.selectedLot,
            value: val,
          })
        },
      },
    },
    methods: {
      ...mapMutations('simulator/herd', {
        setBatchType: 'setBatchType',
        setBatchProfil: 'setBatchProfil',
        setBatchCount: 'setBatchCount',
        setBatchHousingType: 'setBatchHousingType',
      }),
      loadProfils(type) {
        if (type.id) {
          this.animalProfiles = this.getAnimalProfiles(type.id)
        }
      },
    },
  }
</script>
