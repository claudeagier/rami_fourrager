<template>
  <v-dialog
    v-model="dialog"
    max-width="40em"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class="mr-2"
        color="grey"
        outlined
        text
        v-on="on"
      >
        Dupliquer
      </v-btn>
    </template>
    <v-form
      ref="duplicateForm"
      @submit.prevent="duplicate"
      v-model="valid"
      lazy-validation
    >
      <v-card>
        <v-card-title>Choisissez les éléments cibles</v-card-title>
        <v-card-text>
          <v-text-field
            :v-model="sourceItem"
            :value="sourceItem.name"
            label="Elément source"
            readonly
          >
          </v-text-field>
          <v-select
            v-model="selectedTargets"
            :items="sources"
            item-text="name"
            item-value="id"
            label="Éléments cibles"
            multiple
            outlined
            dense
            clearable
            return-object
            :rules="[rules.required, rules.notEmpty]"
            :menu-props="{ offsetY: true, closeOnClick: true }"
          >
            <template v-slot:prepend-item>
              <v-checkbox
                class="ml-4"
                v-model="isSelectAll"
                @click="toggleSelectAll()"
                hide-details
                ripple
              >
                <template v-slot:label>
                  <span> Select All </span>
                </template>
              </v-checkbox>
              <v-divider />
            </template>
          </v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            text
            @click="close"
          >
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            outlined
            :disabled="!valid"
          >
            Dupliquer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
  export default {
    name: 'DuplicateModal',
    props: {
      ids: {
        type: Array,
        required: true,
      },
      sourceItem: {
        type: null,
        required: true,
      },
    },
    watch: {
      sourceItem: {
        immediate: true,
        handler(newValue, oldValue) {
          if (newValue != null) {
            this.sources = this.ids.filter((element) => element.id !== newValue.id)
          }
        },
      },
    },
    data() {
      return {
        valid: true,
        sources: [],
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          notEmpty: (val) => val.length > 0,
        },
        dialog: false,
        selectedTargets: [],
        isSelectAll: false,
      }
    },
    methods: {
      duplicate() {
        if (this.$refs.duplicateForm.validate()) {
          this.$emit('duplicate', {
            source: this.sourceItem,
            targets: this.selectedTargets,
          })
          this.close()
        } else {
          // Gérer le cas où une sélection n'a pas été faite
          console.error("Veuillez sélectionner l'élément source et les éléments cibles.")
        }
      },
      toggleSelectAll() {
        if (this.isSelectAll) {
          this.selectedTargets = this.sources
        } else {
          this.selectedTargets = []
        }
      },
      close() {
        this.dialog = false
        this.clear()
      },
      clear() {
        this.$refs.duplicateForm.resetValidation()
        this.selectedTargets = []
        this.isSelectAll = false
      },
    },
  }
</script>
