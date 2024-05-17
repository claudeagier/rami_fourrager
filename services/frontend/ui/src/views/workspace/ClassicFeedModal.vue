<template>
  <div>
    <v-dialog
      max-width="500px"
      v-model="showModal"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="green"
          v-on="on"
          outlined
        >
          {{ $t('workspace.content.datatables.classicFeeds.create.btn') }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5"> {{ $t('workspace.content.datatables.classicFeeds.create.dialog.title') }} </span>
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
          ref="classicFeedForm"
          @submit.prevent="saveItem"
          v-model="valid"
          lazy-validation
        >
          <v-card-text>
            <v-text-field
              v-model="feedItem.name"
              :rules="[rules.required]"
              :label="$t('workspace.content.datatables.classicFeeds.create.dialog.name')"
              required
            ></v-text-field>

            <v-select
              v-model="feedItem.correspondingStock"
              :items="barnStockItems"
              item-text="name"
              item-value="code"
              :label="$t('workspace.content.datatables.classicFeeds.create.dialog.correspondingStock')"
              :rules="[rules.required]"
            ></v-select>

            <v-subheader>{{
              $t('workspace.content.datatables.classicFeeds.create.dialog.nutritional_values')
            }}</v-subheader>

            <v-row>
              <v-col
                v-for="(value, key) in feedItem.nutritional_values"
                :key="key"
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="feedItem.nutritional_values[key]"
                  :label="key"
                  :rules="[rules.number]"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <!-- </v-col>
            </v-row>
          </v-container>
        </v-card-text> -->

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="cancelModal"
              color="grey"
              text
            >
              {{ $t('workspace.content.datatables.classicFeeds.create.dialog.btn_cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              type="submit"
              outlined
              :disabled="!valid"
            >
              {{ $t('workspace.content.datatables.classicFeeds.create.dialog.btn_create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import classicFeedSchema from '@/schemas/classicFeed'

  export default {
    name: 'classicFeedModal',
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
            this.feedItem = newValue
          } else {
            this.feedItem = { ...classicFeedSchema }
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
        feedItem: { ...classicFeedSchema },
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
        this.clearFeedItem()
      },
      clearFeedItem() {
        this.feedItem = {
          name: '',
          correspondingStock: '',
          nutritional_values: {
            UEL: 0,
            UEB: 0,
            UEM: 0,
            UFL: 0,
            PDI_inf: 0,
            UFV: 0,
            PDIN: 0,
            PDIE: 0,
            rejection: 0,
          },
        }
        this.oldFeedItem = null
        this.$refs.classicFeedForm.reset()
      },
      saveItem() {
        if (this.$refs.classicFeedForm.validate()) {
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
