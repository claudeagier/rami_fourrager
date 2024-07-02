<template>
  <v-container>
    <classic-feed-graph
      :selectedLot="selectedLot"
      :selection="selectedPeriodIndex"
    />
    <v-tabs
      centered
      grow
      :color="pageColor"
    >
      <v-tab
        v-for="(period, index) in periods"
        :key="index"
        @click="periodSelected(index)"
        class="period-tab"
      >
        {{ $t('herd.classicfeed.tabs.title', { period: period.id }) }}
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
              <v-toolbar-title> {{ $t('herd.classicfeed.tabs.table.title', { period: period.id }) }} </v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-spacer></v-spacer>
              <duplicate-modal
                :ids="periods"
                :sourceItem="period"
                @duplicate="duplicate"
              />
              <classic-feed-modal
                :pageColor="pageColor"
                :item="feedItem"
                :forceOpen="dialogs[index]"
                :selectedPeriodIndex="selectedPeriodIndex"
                @add-item="saveItem"
                @cancel-modal="closeModal"
              />
            </v-toolbar>
            <ration-gauge
              :color="pageColor"
              :data-feeds="feeds"
            />
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
  import RationGauge from './RationGauge.vue'
  import ClassicFeedModal from './ClassicFeedModal.vue'
  import DuplicateModal from './DuplicateModal.vue'
  import ClassicFeedGraph from './ClassicFeedGraph.vue'

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
      ClassicFeedModal,
      DuplicateModal,
      ClassicFeedGraph,
    },
    data() {
      return {
        batch: null,
        feedItem: null,
        oldFeedItem: null,
        // pour les modals des periodes
        dialogs: Array.from({ length: 13 }, () => false),
        selectedPeriodIndex: 0,
      }
    },
    created() {
      this.getEnergeticCoverageByBatch(this.selectedLot)
      this.batch = this.getBatch(this.selectedLot)
    },
    beforeMount() {},
    computed: {
      ...mapGetters('simulator/herd', {
        getBatch: 'getBatch',
        getEnergeticCoverageByBatch: 'getEnergeticCoverageByBatch',
      }),
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
      feeds: {
        get() {
          return this.getBatch(this.selectedLot).classicFeeds[this.selectedPeriodIndex].feeds
        },
      },
      headers() {
        return [
          { text: this.$t('herd.classicfeed.tabs.table.type'), value: 'type.name' },
          { text: this.$t('herd.classicfeed.tabs.table.proportion'), value: 'proportion' },
          { text: this.$t('herd.classicfeed.tabs.table.actions'), value: 'actions', sortable: false },
        ]
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
        // Ouvrir la modal de création/modification de la ration Classic Feeds
        this.feedItem = { ...item }
        this.oldFeedItem = { ...item }
        this.openModal(this.selectedPeriodIndex)
      },
      saveItem(item) {
        if (this.oldFeedItem !== null) {
          // Modification
          this.$store.commit('simulator/herd/updateClassicFeed', {
            batchId: this.selectedLot,
            periodId: this.selectedPeriodIndex,
            newFeed: item,
            oldFeed: this.oldFeedItem,
          })
        } else {
          // Ajout
          this.$store.commit('simulator/herd/createClassicFeed', {
            batchId: this.selectedLot,
            periodId: this.selectedPeriodIndex,
            newFeed: item,
          })
        }
        this.closeModal(this.selectedPeriodIndex)
      },
      duplicate({ source, targets }) {
        this.$store.commit('simulator/herd/duplicateClassicFeedsByPeriod', {
          batchId: this.selectedLot,
          source: source,
          targets: targets,
        })
      },
      deleteItem(item) {
        if (confirm(this.$t('notifications.confirm_delete_item'))) {
          this.$store.commit('simulator/herd/deleteClassicFeed', {
            batchId: this.selectedLot,
            periodId: this.selectedPeriodIndex,
            feed: item,
          })
        }
      },
      periodSelected(period) {
        this.selectedPeriodIndex = period
      },
    },
  }
</script>
<style scoped>
  /* .period-tab {
    min-width: 60px;
  } */
</style>
