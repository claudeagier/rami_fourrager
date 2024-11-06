<template>
  <base-dashboard-card
    title="dashboard.climat.title"
    cardColor="#ff980080"
    icon="mdi-earth"
    :dark="true"
  >
    <template v-slot:content>
      <v-row>
        <v-col cols="6">
          <v-select
            ref="siteSelect"
            hide-details
            outlined
            label="Site"
            :value="selectedSite"
            :items="siteDropdownOptions"
            item-text="name"
            item-value="id"
            @change="onSiteChange"
          ></v-select>
        </v-col>

        <v-col cols="6">
          <v-select
            hide-details
            outlined
            label="Année Climatique"
            v-model="selectedClimaticYear"
            :items="climaticYearDropdownOptions"
            item-text="name"
            item-value="id"
          ></v-select>
        </v-col>
        <v-dialog
          v-model="confirmDialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="text-h5 pb-1">Confirmation</v-card-title>
            <v-card-subtitle class="mt-0">Si vous changez de site, l'assolement actuel sera effacé </v-card-subtitle>
            <v-card-text>Voulez-vous vraiment changer de site ?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="confirmSiteChange"
              >
                Oui
              </v-btn>
              <v-btn
                color="red darken-1"
                text
                @click="cancelSiteChange"
              >
                Non
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- Boîte de dialogue de confirmation -->
    </template>
  </base-dashboard-card>
</template>

<script>
  // TODO traduction
  // FIXME problème d'evenement sur le changement de site
  export default {
    name: 'SelectCard',
    props: {
      siteModel: {
        type: Number,
        default: 0,
      },
      climaticYearModel: {
        type: Number,
        default: 0,
      },
      siteDropdownOptions: {
        type: Array,
        default: () => [],
      },
      climaticYearDropdownOptions: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        confirmDialog: false,
        newSite: this.siteModel,
      }
    },
    computed: {
      selectedSite: {
        get() {
          return this.siteModel
        },
        set(val) {
          console.log('setsite')
          this.$emit('changeSite', val)
        },
      },
      selectedClimaticYear: {
        get() {
          return this.climaticYearModel
        },
        set(val) {
          this.$emit('changeClimaticYear', val)
        },
      },
    },
    methods: {
      onSiteChange(newVal) {
        this.newSite = newVal
        this.confirmDialog = true
      },
      confirmSiteChange() {
        this.selectedSite = this.newSite
        this.confirmDialog = false
        this.$emit('confirmSiteChange')
      },
      cancelSiteChange() {
        this.confirmDialog = false
        this.$refs.siteSelect.internalValue = this.selectedSite
      },
    },
  }
</script>

<style></style>
