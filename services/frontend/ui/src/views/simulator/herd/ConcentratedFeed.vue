<template>
  <v-container>
    <v-tabs
      centered
      :color="pageColor"
    >
      <v-tab
        v-for="(period, index) in periods"
        :key="index"
        @click="periodSelected(index)"
      >
        {{ $t('herd.concentratedfeed.tabs.title', { period: period.id }) }}
      </v-tab>
      <v-tab-item
        v-for="(period, index) in periods"
        :key="index"
      >
        <v-data-table
          :headers="headers"
          :items="feeds"
          class="elevation-1"
          sort-by="type"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar
              color="white"
              flat
            >
              <v-toolbar-title>
                {{ $t('herd.concentratedfeed.tabs.table.title', { period: period.id }) }}
              </v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <duplicate-modal
                :ids="periods"
                :sourceItem="period"
                @duplicate="duplicate"
              />
              <concentrated-feed-modal
                :pageColor="pageColor"
                :item="feedItem"
                :forceOpen="dialogs[index]"
                :selectedPeriodIndex="selectedPeriodIndex"
                @add-item="saveItem"
                @cancel-modal="closeModal"
              />
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              @click="deleteItem(item)"
              small
            >
              mdi-delete
            </v-icon>
            <v-icon
              @click="editItem(item)"
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
  </v-container>
</template>
<script>
  import { mapGetters } from 'vuex'
  import ConcentratedFeedModal from './ConcentratedFeedModal.vue'
  import DuplicateModal from './DuplicateModal.vue'

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
    components: {
      ConcentratedFeedModal,
      DuplicateModal,
    },
    data() {
      return {
        headers: [
          { text: this.$t('herd.concentratedfeed.tabs.table.name'), value: 'type.name' },
          { text: this.$t('herd.concentratedfeed.tabs.table.quantity'), value: 'quantity' },
          { text: this.$t('herd.concentratedfeed.tabs.table.actions'), value: 'actions', sortable: false },
        ],
        batch: null,
        feedItem: null,
        oldFeedItem: null,
        // pour les modals des periodes
        dialogs: Array.from({ length: 13 }, () => false),
        selectedPeriodIndex: 0,
      }
    },
    created() {
      this.$store.dispatch('simulator/fetchFeedTypes')
    },
    beforeMount() {
      this.batch = this.getBatch(this.selectedLot)
    },
    computed: {
      ...mapGetters('simulator/herd', {
        getBatch: 'getBatch',
      }),
      ...mapGetters('simulator', {
        getConcentratedFeed: 'getConcentratedFeedByPeriod',
        periods: 'periodList',
      }),
      feeds: {
        get() {
          return this.batch.concentratedFeeds[this.selectedPeriodIndex].feeds
        },
      },
    },
    methods: {
      // modals
      openModal(index) {
        this.$set(this.dialogs, index, true)
      },
      closeModal(index) {
        this.feedItem = null
        this.oldFeedItem = null
        this.$set(this.dialogs, index, false)
      },

      editItem(item) {
        // Ouvrir la modal de création/modification de la ration Concentrated Feeds
        this.feedItem = { ...item }
        this.oldFeedItem = { ...item }
        this.openModal(this.selectedPeriodIndex)
      },
      saveItem(item) {
        if (this.oldFeedItem !== null) {
          // Modification
          this.$store.commit('simulator/herd/updateConcentratedFeed', {
            batchId: this.selectedLot,
            periodId: this.selectedPeriodIndex,
            newFeed: item,
            oldFeed: this.oldFeedItem,
          })
        } else {
          // Ajout
          this.$store.commit('simulator/herd/createConcentratedFeed', {
            batchId: this.selectedLot,
            periodId: this.selectedPeriodIndex,
            newFeed: item,
          })
        }
        this.closeModal(this.selectedPeriodIndex)
      },
      duplicate({ source, targets }) {
        this.$store.commit('simulator/herd/duplicateConcentratedFeedsByPeriod', {
          batchId: this.selectedLot,
          source: source,
          targets: targets,
        })
      },
      deleteItem(item) {
        this.$store.commit('simulator/herd/deleteConcentratedFeed', {
          batchId: this.selectedLot,
          periodId: this.selectedPeriodIndex,
          feed: item,
        })
      },
      periodSelected(period) {
        this.selectedPeriodIndex = period
      },
    },
  }
</script>
