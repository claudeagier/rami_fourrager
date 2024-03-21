<template>
  <v-tabs
    centered
    :color="pageColor"
  >
    <v-tab
      v-for="(period, index) in 13"
      :key="index"
    >
      Période {{ index + 1 }}
    </v-tab>
    <v-tab-item
      v-for="(period, index) in 13"
      :key="index"
    >
      <v-data-table
        :headers="Headers"
        :items="lots[selectedLot].concentratedFeeds[index].feeds"
        class="elevation-1"
        sort-by="type"
        hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar
            color="white"
            flat
          >
            <v-toolbar-title> Composition of concentrated feeds for period {{ index + 1 }} </v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>

            <v-dialog
              max-width="500px"
              v-model="dialogs[index]"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  :color="pageColor"
                  outlined
                  v-on="on"
                >
                  Add a concentrated feed
                </v-btn>
              </template>
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
                          v-model="selectedFeedType[index]"
                          :items="concentratedFeeds"
                          item-text="name"
                          item-value="id"
                          label="concentrated Type"
                          return-object
                          required
                        ></v-select>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                        sm="12"
                      >
                        <v-text-field
                          v-model="selectedFeedQuantity[index]"
                          label="Quantité (kg brut/animal/j)"
                          type="number"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="closeFeed(index)"
                    text
                    color="grey"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    @click="saveFeed(index)"
                    color="primary"
                    outlined
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
            @click="deleteFeedsItem(index, item)"
            small
          >
            mdi-delete
          </v-icon>
          <v-icon
            @click="editFeedsItem(index, item)"
            medium
            color="green"
            background-color="green"
          >
            mdi-square-edit-outline
          </v-icon>
        </template>
      </v-data-table>
    </v-tab-item>
  </v-tabs>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'ConcentratedFeed',
    props: {
      selectedLot: {
        type: null,
        required: true,
      },
      pageColor: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        lots: [...this.$store.getters.herdInfo.batchs],
        // pour les modals des periodes
        dialogs: Array.from({ length: 13 }, () => false),
        oldFeed: null,
        selectedFeedIndex: null,
        selectedFeedType: Array.from({ length: 13 }, () => null),
        selectedFeedQuantity: Array.from({ length: 13 }, () => null),
        Headers: [
          { text: 'Concentrated Feed Type', value: 'type.name' },
          { text: 'Quantité (kg brut/animal/j)', value: 'quantity' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      }
    },
    created() {
      this.$store.dispatch('fetchConcentratedFeeds')
    },
    computed: {
      ...mapState(['simulator']),
      concentratedFeeds() {
        return this.$store.getters.concentratedFeedList
      },
    },
    methods: {
      // modals
      openModal(index) {
        this.$set(this.dialogs, index, true)
      },
      closeModal(index) {
        this.$set(this.dialogs, index, false)
      },
      editFeedsItem(periodIndex, item) {
        // Ouvrir la modal de création/modification de la ration Concentrated Feeds
        this.selectedFeedType[periodIndex] = item.type
        this.selectedFeedQuantity[periodIndex] = item.quantity
        this.oldFeed = item
        this.openModal(periodIndex)
      },
      closeFeed(index) {
        this.closeModal(index)
        this.oldFeed = null
        this.selectedFeedType[index] = null
        this.selectedFeedQuantity[index] = null
      },
      saveFeed(periodIndex) {
        if (this.selectedFeedType[periodIndex] && this.selectedFeedQuantity[periodIndex]) {
          const newFeed = {
            type: this.selectedFeedType[periodIndex],
            quantity: this.selectedFeedQuantity[periodIndex],
          }

          if (this.oldFeed !== null) {
            // Modification
            this.$store.commit('updateConcentratedFeed', {
              lotIndex: this.selectedLot,
              periodIndex,
              newFeed,
              oldFeed: this.oldFeed,
            })
          } else {
            // Ajout
            this.$store.commit('createConcentratedFeed', {
              lotIndex: this.selectedLot,
              periodIndex,
              newFeed,
            })
          }
          this.closeFeed(periodIndex)
        } else {
          console.error('Please fill in all fields')
        }
      },
      deleteFeedsItem(periodIndex, feed) {
        this.$store.commit('deleteConcentratedFeed', {
          lotIndex: this.selectedLot,
          periodIndex,
          feed,
        })
      },
    },
  }
</script>
