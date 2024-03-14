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
        <base-material-card color="info">
          <template v-slot:heading>
            <div class="text-h3 font-weight-light">La grange</div>

            <div class="text-subtitle-1 font-weight-light">Complete your barn</div>
          </template>
          <v-data-table
            :headers="headers"
            :items="barnStock"
            class="elevation-1"
            sort-by="type"
          >
            <template v-slot:top>
              <v-toolbar
                color="white"
                flat
              >
                <v-toolbar-title>Etat initial des stocks</v-toolbar-title>
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
                      color="primary"
                      dark
                      v-on="on"
                    >
                      Add to Barn
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">Add to Barn</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col
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
                          </v-col>
                          <v-col
                            cols="12"
                            md="12"
                            sm="12"
                          >
                            <v-text-field
                              v-model="quantityInDays"
                              label="Quantity (in days)"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            md="12"
                            sm="12"
                          >
                            <v-text-field
                              v-model="quantityInTons"
                              label="Quantity (in tons)"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="close"
                        color="blue darken-1"
                        text
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        @click="save"
                        color="blue darken-1"
                        text
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                @click="deleteItem(item)"
                small
              >
                mdi-delete
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
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Barn',
    data: () => ({
      selectedItemType: null,
      selectedFeedType: null,
      selectedConcentratedFeed: null,
      quantityInDays: null,
      quantityInTons: null,
      dialog: false,
      headers: [
        {
          text: 'Type',
          align: 'start',
          sortable: false,
          value: 'type',
        },
        { text: 'Name', value: 'name' },
        { text: 'Quantity in days', value: 'quantity.days' },
        { text: 'Quantity in tons', value: 'quantity.tons' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        type: '',
        name: '',
        quantity: {
          days: '',
          tons: '',
        },
      },
      defaultItem: {
        type: '',
        name: '',
        quantity: {
          days: '',
          tons: '',
        },
      },
    }),

    computed: {
      ...mapState(['simulator']),
      itemTypes() {
        return ['feed', 'concentrated_feed'] // You can retrieve these from the store if needed
      },
      feedTypes() {
        return this.$store.getters.feedTypes
      },
      concentratedFeeds() {
        return this.$store.getters.concentratedFeeds
      },
      barnStock() {
        return this.$store.getters.barnStock
      },
    },
    created() {
      this.$store.dispatch('fetchFeedTypes')
      this.$store.dispatch('fetchConcentratedFeeds')
    },

    methods: {
      close() {
        this.dialog = false
        this.clearFields()
      },

      clearFields() {
        this.selectedItemType = null
        this.selectedFeedType = null
        this.selectedConcentratedFeed = null
        this.quantityInDays = null
        this.quantityInTons = null
      },

      save() {
        const selectedType = this.selectedItemType === 'feed' ? this.selectedFeedType : this.selectedConcentratedFeed

        if (selectedType && (this.quantityInDays || this.quantityInTons)) {
          const selectedFeed =
            this.selectedItemType === 'feed'
              ? this.feedTypes.find((feed) => feed.id === selectedType)
              : this.concentratedFeeds.find((feed) => feed.id === selectedType)

          if (selectedFeed) {
            this.$store.commit('updateBarnStock', {
              type: this.selectedItemType,
              name: selectedFeed.name,
              quantity: {
                days: this.quantityInDays,
                tons: this.quantityInTons,
              },
            })

            this.close()
          }
        } else {
          // Handle error or display message to the user
        }
      },

      deleteItem(item) {
        console.log('delete')
        // Implement deletion logic here
        this.$store.commit('deleteBarnStockItem', {
          type: item.type,
          name: item.name,
        })
      },

      initialize() {
        // Fetch initial data from the server or Vuex store
        this.$store.commit('setInitialBarnStock', [])
      },
    },
  }
</script>

<style scoped></style>
