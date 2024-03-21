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
        :headers="classicHeaders"
        :items="lots[selectedLot].classicFeeds[index].feeds"
        class="elevation-1"
        sort-by="type"
        hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar
            color="white"
            flat
          >
            <v-toolbar-title> Composition of classic feeds for period {{ index + 1 }} </v-toolbar-title>
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
                  v-on="on"
                  outlined
                >
                  Add a classic feed
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5"> Add a classic feed </span>
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
                          v-model="selectedClassicFeedType[index]"
                          :items="feedTypes"
                          item-text="name"
                          item-value="id"
                          label="Feed Type"
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
                          v-model="selectedClassicFeedProportion[index]"
                          label="Proportion (%)"
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
                    @click="closeClassicFeed(index)"
                    color="grey"
                    text
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    @click="saveClassicFeed(index)"
                    outlined
                    color="primary"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <ration-gauge
            :color="pageColor"
            :data-feeds="lots[selectedLot].classicFeeds[index].feeds"
          />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            @click="deleteClassicFeedsItem(index, item)"
            small
          >
            mdi-delete
          </v-icon>
          <v-icon
            @click="editClassicFeedsItem(index, item)"
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
  import RationGauge from './RationGauge.vue'

  export default {
    name: 'ClassicFeed',

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
    components: {
      RationGauge,
    },
    data() {
      return {
        lots: this.$store.getters.herdInfo.batchs,
        oldFeed: null,
        // pour les modals des periodes
        dialogs: Array.from({ length: 13 }, () => false),
        selectedClassicFeedIndex: null,
        selectedClassicFeedType: Array.from({ length: 13 }, () => null),
        selectedClassicFeedProportion: Array.from({ length: 13 }, () => null),
        classicHeaders: [
          { text: 'Classic Feed Type', value: 'type.name' },
          { text: 'Proportion (%)', value: 'proportion' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      }
    },
    created() {
      this.$store.dispatch('fetchFeedTypes')
    },
    computed: {
      ...mapState(['simulator']),
      feedTypes() {
        return this.$store.getters.feedTypeList
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
      editClassicFeedsItem(periodIndex, item) {
        // Ouvrir la modal de création/modification de la ration Classic Feeds
        this.selectedClassicFeedType[periodIndex] = item.type
        this.selectedClassicFeedProportion[periodIndex] = item.proportion
        this.oldFeed = item
        this.openModal(periodIndex)
      },
      saveClassicFeed(periodIndex) {
        if (this.selectedClassicFeedType[periodIndex] && this.selectedClassicFeedProportion[periodIndex]) {
          const newFeed = {
            type: this.selectedClassicFeedType[periodIndex],
            proportion: this.selectedClassicFeedProportion[periodIndex],
          }

          if (this.oldFeed !== null) {
            // Modification
            this.$store.commit('updateClassicFeed', {
              lotIndex: this.selectedLot,
              periodIndex,
              newFeed,
              oldFeed: this.oldFeed,
            })
          } else {
            // Ajout
            this.$store.commit('createClassicFeed', {
              lotIndex: this.selectedLot,
              periodIndex,
              newFeed,
            })
          }
          this.closeClassicFeed(periodIndex)
        } else {
          console.error('Please fill in all fields')
        }
      },
      deleteClassicFeedsItem(periodIndex, feed) {
        this.$store.commit('deleteClassicFeed', {
          lotIndex: this.selectedLot,
          periodIndex,
          feed,
        })
      },
      closeClassicFeed(index) {
        this.closeModal(index)
        this.oldFeed = null
        this.selectedClassicFeedType[index] = null
        this.selectedClassicFeedProportion[index] = null
      },
    },
  }
</script>
