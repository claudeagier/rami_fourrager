<template>
  <v-container>
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
      @focus="confirmUpdate"
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
          // changer toutes les présences de housing en demandant confirmation
          const presences = Array.from(this.batch.housing.presence, (presenceByPeriod) => ({
            period: presenceByPeriod.period,
            animalCount: val,
            days: presenceByPeriod.days,
          }))
          this.setBatchAllPresences({
            batchId: this.selectedLot,
            presences: presences,
          })

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
        setBatchAllPresences: 'setBatchAllPresences',
      }),
      loadProfiles(type) {
        if (type.id) {
          this.animalProfiles = this.getAnimalProfiles(type.id)
        }
      },
      confirmUpdate() {
        this.$toast({
          message: this.$t('notifications.herd.animalcount'),
          type: 'info',
          timeout: 5000,
        })
      },
    },
  }
</script>
