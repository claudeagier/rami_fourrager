<template>
  <base-dashboard-card
    :title="$t('dashboard.climat.title')"
    cardColor="#ff980080"
    icon="mdi-earth"
  >
    <template v-slot:content>
      <v-row>
        <v-col cols="6">
          <v-select
            ref="siteSelect"
            hide-details
            outlined
            color="orange"
            item-color="orange"
            style="background-color: white"
            :label="$t('dashboard.climat.site.label')"
            :value="selectedSite"
            :items="siteDropdownOptions"
            item-text="name"
            item-value="id"
            @change="onSiteChange"
            @click="onSiteClick"
            :light="true"
          ></v-select>
        </v-col>

        <v-col cols="6">
          <v-select
            hide-details
            outlined
            :label="$t('dashboard.climat.climaticyear.label')"
            v-model="selectedClimaticYear"
            :items="climaticYearDropdownOptions"
            item-text="name"
            item-value="id"
            color="orange"
            item-color="orange"
            style="background-color: white"
          ></v-select>
        </v-col>
        <!-- Boîte de dialogue de confirmation -->
        <v-dialog
          v-model="confirmDialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="text-h5 pb-1">{{ $t('dashboard.climat.confirmation.title') }}</v-card-title>
            <v-card-subtitle class="mt-0">{{ $t('dashboard.climat.confirmation.subtitle') }} </v-card-subtitle>
            <v-card-text>{{ $t('dashboard.climat.confirmation.punchline') }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="confirmSiteChange"
              >
                {{ $t('btn.yes') }}
              </v-btn>
              <v-btn
                color="red darken-1"
                text
                @click="cancelSiteChange"
              >
                {{ $t('btn.no') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </base-dashboard-card>
</template>

<script>
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
        readyToChange: false,
      }
    },
    computed: {
      selectedSite: {
        get() {
          return this.siteModel
        },
        set(val) {},
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
        if (this.readyToChange) {
          this.newSite = newVal
          this.$emit('changeSite', this.newSite)
        }
      },
      onSiteClick(event) {
        if (!this.readyToChange) {
          this.confirmDialog = true
        }
      },
      confirmSiteChange() {
        this.confirmDialog = false
        this.readyToChange = true
        this.$emit('confirmSiteChange')
      },
      cancelSiteChange() {
        this.readyToChange = false
        this.confirmDialog = false
        this.$refs.siteSelect.internalValue = this.selectedSite
      },
    },
  }
</script>

<style></style>
