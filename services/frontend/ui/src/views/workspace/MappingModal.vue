<template>
  <div>
    <v-dialog
      max-width="600px"
      v-model="showModal"
      persistent
      no-click-animation
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="green"
          v-on="on"
          outlined
        >
          {{ $t('workspace.content.datatables.mapping.create.btn') }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5"> {{ $t('workspace.content.datatables.mapping.create.dialog.title') }} </span>
        </v-card-title>

        <!-- <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="6"
                sm="12"
              > -->

        <v-form
          ref="workspaceMappingForm"
          @submit.prevent="saveItem"
          v-model="valid"
          lazy-validation
        >
          <v-card-text>
            <div>
              créer un nouveau mapping
              <!-- bouton pour ouvrir une modale -->
              <!-- la modale avec le formulaire de construction du mapping -->
              <!-- un formulaire qui complète un tableau au fur et à mesure -->
              <!-- la clé du champ qui est l'entête de colonne -->
              <!-- demander si le champ est à saisir ou à aller chercher dans la simulation -->
              <!--    si le champs est à saisir faire apparaitre un texte field
              si le champs est à compléter avec une valeur de la simulation
                choisir parmis les valeurs à disposition dans une liste de champs -->

              <!-- création d'un  mapping en json et sauvegarde dans workspace.json -->
              <div>sauvegarder le mapping</div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="cancelModal"
              color="grey"
              text
            >
              {{ $t('workspace.content.datatables.mapping.create.dialog.btn_cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              type="submit"
              outlined
              :disabled="!valid"
            >
              {{ $t('workspace.content.datatables.mapping.create.dialog.btn_create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'mappingModal',
    props: {
      item: {
        type: null,
        required: true,
      },
      forceOpen: {
        type: Boolean,
        required: true,
      },
    },
    watch: {
      item: {
        immediate: true,
        handler(newValue, oldValue) {
          if (newValue != null) {
            this.mappingItem = newValue
          } else {
            this.mappingItem = {
              name: '',
            }
          }
        },
      },
      forceOpen: {
        immediate: true,
        handler(newValue, oldvalue) {
          if (newValue === true) {
            this.showModal = true
          }
        },
      },
    },
    data() {
      return {
        showModal: false,
        valid: true,
        mappingItem: null,
        rules: {
          required: (value) => !!value || this.$t('validation.required'),
          number: (value) => (!isNaN(value) && isFinite(value)) || this.$t('validation.number'),
        },
      }
    },
    computed: {
      ...mapGetters('referential', {
        barnStockItems: 'barnStockItemList',
      }),
    },
    methods: {
      cancelModal() {
        this.showModal = false
        this.clearItem()
        this.$emit('cancel-modal', 'mapping')
      },
      clearItem() {
        this.mappingItem = {
          name: '',
        }
        this.$refs.workspaceMappingForm.resetValidation()
      },
      saveItem() {
        if (this.$refs.workspaceMappingForm.validate()) {
          this.$emit('add-item', { dialogName: 'mapping', item: this.mappingItem })
          this.showModal = false
          this.clearItem()
        } else {
          return false
        }
      },
    },
  }
</script>
