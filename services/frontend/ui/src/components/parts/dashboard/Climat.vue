<template>
  <base-dashboard-card
    :title="$t('dashboard.climat.title')"
    cardColor="#ff980080"
    icon="mdi-earth"
  >
    <template v-slot:content>
      <v-row>
        <v-col cols="12">
          <v-select
            class="ma-2"
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
          <v-select
            class="ma-2"
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

<style>
  /* Styles d'impression pour le composant climat */
  @media print {
    /* Cacher les boutons et dialogues */
    v-dialog,
    v-btn {
      display: none !important;
    }

    /* Assurer une largeur pleine pour les colonnes */
    .v-col {
      width: 100%;
      padding: 0 !important;
      margin: 0 !important;
    }

    /* Organisation des champs (v-select) */
    .v-select {
      border: 1px solid #000; /* Ajouter une bordure pour mieux distinguer les champs */
      background-color: #fff !important; /* Conserver un fond blanc */
      font-size: 14px; /* Ajuster la taille de la police */
      color: #000; /* Assurer un contraste suffisant */
      margin-bottom: 8px;
    }

    /* Masquer les détails et les icônes dans les sélecteurs */
    .v-select__selections,
    .v-select__control {
      display: block !important;
    }

    .v-select__control::after,
    .v-icon {
      display: none !important; /* Masque les icônes de sélection */
    }

    /* Espacement entre les lignes et colonnes */
    .v-row {
      margin-bottom: 16px;
    }

    /* Gérer la carte contenant les sélecteurs */
    base-dashboard-card {
      page-break-inside: avoid; /* Évite que la carte soit coupée entre deux pages */
      padding: 16px; /* Ajouter un peu d'espacement */
      border: 1px solid #ddd; /* Délimiter visuellement la carte */
    }

    /* Ajuster le titre de la carte */
    base-dashboard-card .card-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #000;
    }

    /* Masquer les ombrages inutiles pour une impression plus propre */
    base-dashboard-card {
      box-shadow: none !important;
    }
  }
</style>
