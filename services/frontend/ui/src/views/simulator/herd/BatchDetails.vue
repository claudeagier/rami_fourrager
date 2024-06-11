<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-select
          v-model="type"
          :items="batchTypes"
          :label="$t('herd.details.type')"
          item-text="name"
          item-value="id"
          return-object
          required
          :color="pageColor"
          :item-color="pageColor"
          @change="loadProfiles"
        ></v-select>
        <v-autocomplete
          v-model="profile"
          :items="animalProfiles"
          :label="$t('herd.details.profile')"
          :item-color="pageColor"
          :color="pageColor"
          item-text="name"
          item-value="id"
          filled
          return-object
          required
          clearable
        >
        </v-autocomplete>
        <v-text-field
          v-model.number="count"
          :rules="[rules.required, rules.integer]"
          :label="$t('herd.details.count')"
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
          :label="$t('herd.details.housing_types')"
          :color="pageColor"
          :item-color="pageColor"
        ></v-select>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'

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
          this.loadProfiles(this.batch.type)
        },
      },
    },
    data() {
      return {
        animalProfiles: [],
        batch: null,
        rules: {
          required: (val) => !!val || this.$t('valiation.required'),
          integer: (val) => /^\d+$/.test(val) || this.$t('validation.integer'),
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
      profile: {
        get() {
          return this.batch.profile
        },
        set(val) {
          this.setBatchProfile({
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
        setBatchProfile: 'setBatchProfile',
        setBatchCount: 'setBatchCount',
        setBatchHousingType: 'setBatchHousingType',
      }),
      loadProfiles(type) {
        if (type.id) {
          this.animalProfiles = this.getAnimalProfiles(type.id)
        }
      },
    },
  }
</script>
