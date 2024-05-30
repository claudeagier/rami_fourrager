<template>
  <v-container
    id="barn-vue"
    fluid
    tag="section"
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="12">
        <base-material-card :color="pageColor">
          <template v-slot:heading>
            <v-row>
              <v-col cols="10">
                <div class="text-h3 font-weight-light">La grange</div>
                <div class="text-subtitle-1 font-weight-light">Complete your barn</div>
              </v-col>
              <v-col>
                <div>
                  <v-btn
                    :color="pageColor"
                    style="background-color: white"
                    outlined
                    @click="applyToSimulation"
                  >
                    Appliquer à la simulation
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </template>
          <v-card-text>
            <v-row>
              <v-col cols="5">
                <v-card>
                  <v-card-text>
                    <div>Stock de concentré</div>
                    <div>Stock de paille</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="7">
                <v-card>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="initialStock"
                      class="elevation-1"
                      sort-by="type"
                    >
                      <template v-slot:top>
                        <v-toolbar
                          color="white"
                          flat
                        >
                          <v-toolbar-title>{{ $t('barn.table.title') }}</v-toolbar-title>
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
                                <span class="text-h5">{{ $t('barn.modal.add_btn') }}</span>
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
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
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
        initialStock: 'initialStock',
      }),
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
          this.$store.commit('simulator/barn/saveInitialStock', {
            // type: this.selectedItemType,
            ...this.selectedItem,
            quantity: this.quantityInTons,
          })

          this.close()
        }
        // } else {
        //   // Handle error or display message to the user
        // }
      },

      deleteItem(item) {
        this.$store.commit('simulator/barn/deleteBarnStockItem', item)
      },

      initialize() {
        this.$store.commit('simulator/barn/setInitialBarnStock', [])
      },
      applyToSimulation() {
        this.$store.dispatch('simulator/barn/setStock')
      },
    },
  }
</script>

<style scoped></style>
