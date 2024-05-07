<template>
  <div>
    <v-dialog
      max-width="500px"
      v-model="showModal"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          :color="pageColor"
          v-on="on"
          outlined
        >
          Add a concentrated feed
        </v-btn>
      </template>
      <v-form
        ref="concentratedFeedForm"
        @submit.prevent="saveItem"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title>
            <span class="text-h5"> Add a concentrated feed </span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  sm="12"
                >
                  <v-select
                    v-model="feedItem.type"
                    :items="feedTypes"
                    item-text="name"
                    item-value="id"
                    label="Feed Type"
                    return-object
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model.number="feedItem.quantity"
                    label="Quantity (kg brut/animal/j)"
                    type="number"
                    :rules="[rules.required]"
                    clearable
                    hide-spin-buttons
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="cancelModal"
              color="grey"
              text
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              text
              type="submit"
              outlined
              :disabled="!valid"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'concentratedFeedModal',
    props: {
      pageColor: {
        type: String,
        required: true,
      },
      item: {
        type: null,
        required: true,
      },
      selectedPeriodIndex: {
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
            this.feedItem = newValue
          } else {
            this.feedItem = {
              type: null,
              quantity: null,
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
        oldFeedItem: null,
        feedItem: null,
        valid: true,
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
      }
    },
    computed: {
      ...mapGetters('referential', {
        feedTypes: 'concentratedFeedList',
      }),
    },
    methods: {
      cancelModal() {
        this.showModal = false
        this.clearFeedItem()
        this.$emit('cancel-modal', this.selectedPeriodIndex)
      },
      clearFeedItem() {
        this.feedItem = {
          type: null,
          quantity: null,
        }
        this.oldFeedItem = null
        this.$refs.concentratedFeedForm.reset()
      },
      saveItem() {
        if (this.$refs.concentratedFeedForm.validate()) {
          this.$emit('add-item', this.feedItem)
          this.clearFeedItem()
          this.showModal = false
        } else {
          return false
        }
      },
    },
  }
</script>
