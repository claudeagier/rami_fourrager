<template>
  <base-page-container
    container-name="barn-vue"
    :page-color="pageColor"
    :title="$t('barn.main.title')"
    :subtitle="$t('barn.main.subtitle')"
    @apply="applyToSimulation"
  >
    <template v-slot:content>
      <v-row>
        <v-col
          cols="5"
          class="pt-0 pb-0"
        >
          <v-card>
            <v-card-title>
              <div class="text-h4 font-weight-light">{{ $t('barn.straw.title') }}</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model.number="strawQuantity"
                :label="$t('barn.straw.quantity')"
                type="number"
                hide-spin-buttons
                min="0"
              ></v-text-field>
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-title>
              <div class="text-h4 font-weight-light">{{ $t('barn.concentrated.title') }}</div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model.number="energeticQuantity"
                :label="$t('barn.concentrated.energeticQuantity')"
                type="number"
                hide-spin-buttons
                min="0"
              ></v-text-field>
              <v-text-field
                v-model.number="proteicQuantity"
                :label="$t('barn.concentrated.proteicQuantity')"
                type="number"
                hide-spin-buttons
                min="0"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="7"
          class="pt-0 pb-0"
        >
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="initialFeedStock"
                class="elevation-1"
                sort-by="type"
              >
                <template v-slot:top>
                  <v-toolbar
                    color="white"
                    flat
                  >
                    <v-toolbar-title class="text-h4 font-weight-light">
                      {{ $t('barn.table.title') }}
                    </v-toolbar-title>
                    <v-divider
                      class="mx-4"
                      inset
                      vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog
                      max-width="500px"
                      v-model="dialog"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn
                          class="mb-2"
                          :color="pageColor"
                          outlined
                          v-on="on"
                        >
                          {{ $t('barn.modal.title') }}
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-h4">{{ $t('barn.modal.add_btn') }}</span>
                        </v-card-title>

                        <v-card-text>
                          <v-container>
                            <v-row>
                              <!-- <v-col
                            cols="12"
                            md="12"
                            sm="12"
                          >
                            <v-select
                              v-model="selectedItemType"
                              :items="itemTypes"
                              label="Item Type"
                            ></v-select>
                          </v-col>
                          <v-col
                            v-if="selectedItemType === 'feed'"
                            cols="12"
                            md="12"
                            sm="12"
                          >
                            <v-select
                              v-model="selectedFeedType"
                              :items="feedTypes"
                              item-text="name"
                              item-value="id"
                              label="Feed Type"
                            ></v-select>
                          </v-col>
                          <v-col
                            v-else-if="selectedItemType === 'concentrated_feed'"
                            cols="12"
                            md="12"
                            sm="12"
                          >
                            <v-select
                              v-model="selectedConcentratedFeed"
                              :items="concentratedFeeds"
                              item-text="name"
                              item-value="id"
                              label="Concentrated Feed"
                            ></v-select>
                          </v-col> -->

                              <!-- <v-col
                            cols="12"
                            md="12"
                            sm="12"
                          >
                            <v-text-field
                              v-model.number="quantityInDays"
                              label="Quantity (in days)"
                            ></v-text-field>
                          </v-col> -->
                              <v-col
                                cols="12"
                                md="12"
                                sm="12"
                              >
                                <v-select
                                  v-model="selectedItem"
                                  :items="barnStockItems"
                                  item-text="name"
                                  item-value="code"
                                  :label="$t('barn.modal.select_label')"
                                  return-object
                                ></v-select>
                              </v-col>
                              <v-col
                                cols="12"
                                md="12"
                                sm="12"
                              >
                                <v-text-field
                                  v-model.number="quantityInTons"
                                  :label="$t('barn.modal.quantity', { unity: selectedItem?.unity })"
                                  type="number"
                                  hide-spin-buttons
                                  min="0"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            @click="close"
                            color="grey"
                            text
                          >
                            {{ $t('btn.cancel') }}
                          </v-btn>
                          <v-btn
                            @click="save"
                            color="primary"
                            text
                            outlined
                          >
                            {{ $t('btn.save') }}
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                </template>
                <template v-slot:[`item.concentrated`]="{ value }">
                  <v-chip :color="getColor(value)"> {{ !value ? '' : $t('barn.table.concentrated') }}</v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon
                    @click="deleteItem(item)"
                    small
                  >
                    mdi-delete
                  </v-icon>
                  <v-icon
                    medium
                    color="green"
                    background-color="green"
                  >
                    mdi-square-edit-outline
                  </v-icon>
                </template>
                <!-- <template v-slot:no-data>
                    <v-btn
                      @click="initialize"
                      color="primary"
                    >
                      Reset
                    </v-btn>
                  </template> -->
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </base-page-container>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import navigationGuard from '@/mixins/navigationGuard'

  // TODO-FRONT ajouter les stock de concentré et les stocks de paille
  export default {
    name: 'Barn',
    mixins: [navigationGuard],
    confirmNavigation(callback) {
      this.$confirmNavigation(callback)
    },
    data: () => ({
      pageColor: 'brown',
      // selectedItemType: null,
      selectedItem: null,
      // selectedFeedType: null,
      // selectedConcentratedFeed: null,
      // quantityInDays: null,
      quantityInTons: null,
      dialog: false,

      editedIndex: -1,
      editedItem: {
        // type: '',
        code: '',
        name: '',
        quantity: 0,
      },
      defaultItem: {
        // type: '',
        code: '',
        name: '',
        quantity: 0,
      },
    }),

    computed: {
      // itemTypes() {
      //   return ['feed', 'concentrated_feed'] // You can retrieve these from the store if needed
      // },
      ...mapGetters('referential', {
        barnStockItems: 'barnStockItemList',
      }),
      ...mapGetters('simulator/barn', {
        initialFeedStock: 'initialFeedStock',
        initialConcentratedStock: 'initialConcentratedStock',
        totalConcentratedStock: 'totalConcentratedStock',
        strawStock: 'getInitialStrawStock',
      }),
      strawQuantity: {
        get() {
          return this.strawStock
        },
        set(val) {
          this.$store.commit('simulator/barn/setInitialStrawStock', val)
        },
      },
      energeticQuantity: {
        get() {
          return this.initialConcentratedStock.energeticQuantity
        },
        set(val) {
          this.$store.commit('simulator/barn/setEnergeticQuantity', val)
        },
      },
      proteicQuantity: {
        get() {
          return this.initialConcentratedStock.proteicQuantity
        },
        set(val) {
          this.$store.commit('simulator/barn/setProteicQuantity', val)
        },
      },
      headers() {
        return [
          // {
          //   text: 'Type',
          //   align: 'start',
          //   sortable: false,
          //   value: 'type',
          // },
          { text: this.$t('barn.table.concentrated'), value: 'concentrated' },
          { text: this.$t('barn.table.name'), value: 'name' },
          // { text: 'Quantity in days', value: 'quantity.days' },
          { text: this.$t('barn.table.quantity'), value: 'quantity' },
          { text: this.$t('barn.table.unity'), value: 'unity' },
          { text: this.$t('barn.table.actions'), value: 'actions', sortable: false },
        ]
      },
    },
    created() {},
    beforeDestroy() {
      this.applyToSimulation()
    },
    methods: {
      getColor(concentrated) {
        if (concentrated) {
          return 'grey'
        } else {
          return 'white'
        }
      },
      close() {
        this.dialog = false
        this.clearFields()
      },

      clearFields() {
        // this.selectedItemType = null
        // this.selectedFeedType = null
        // this.selectedConcentratedFeed = null
        // this.quantityInDays = null
        this.selectedItem = null
        this.quantityInTons = null
      },

      save() {
        // const selectedType = this.selectedItemType === 'feed' ? this.selectedFeedType : this.selectedConcentratedFeed

        // if (selectedType && (this.quantityInDays || this.quantityInTons)) {
        // if (selectedType && this.quantityInTons) {
        // const selectedFeed =
        //   this.selectedItemType === 'feed'
        //     ? this.feedTypes.find((feed) => feed.id === selectedType)
        //     : this.concentratedFeeds.find((feed) => feed.id === selectedType)

        // if (selectedFeed) {
        if (this.selectedItem) {
          this.$store.commit('simulator/barn/saveInitialFeedStock', {
            // type: this.selectedItemType,
            ...this.selectedItem,
            quantity: this.quantityInTons,
          })
          this.$toast({
            message: this.$t('barn.table.dialog.add_success'),
            type: 'success',
            timeout: 3000,
          })
          this.close()
        }
      },

      deleteItem(item) {
        if (confirm(this.$t('notifications.confirm_delete_item'))) {
          this.$store.commit('simulator/barn/deleteBarnStockItem', item)
          this.$toast({
            message: this.$t('barn.table.dialog.delete_success'),
            type: 'success',
            timeout: 3000,
          })
        }
      },

      initialize() {
        this.$store.commit('simulator/barn/setInitialBarnStock', [])
      },
      applyToSimulation() {
        this.$store.dispatch('simulator/barn/setStock')
        this.$toast({
          message: this.$t('barn.main.messages.apply_success'),
          type: 'success',
          timeout: 3000,
        })
      },
    },
  }
</script>

<style scoped></style>
