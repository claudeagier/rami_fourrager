<template>
  <page-container
    container-name="report-vue"
    :page-color="pageColor"
    :title="$t('report.main.title')"
    :subtitle="$t('report.main.subtitle')"
    @apply="applyToSimulation"
  >
    <template v-slot:content>
      <v-row>
        <v-col
          cols="12"
          lg="12"
        >
          <!-- <v-tabs
                  centered
                  :color="pageColor"
                  fixed-tabs
                >
                  <v-tab
                    v-for="(tab, tabIndex) in [
                      $t('herd.main.details.tabs.overview'),
                      $t('herd.main.details.tabs.housing'),
                      $t('herd.main.details.tabs.classicfeed'),
                      $t('herd.main.details.tabs.concentratedfeed'),
                      $t('herd.main.details.tabs.pasture'),
                    ]"
                    :key="tabIndex"
                  >
                    {{ tab }}
                  </v-tab>
                  <v-tab-item>
                    <v-divider></v-divider>
                  </v-tab-item>
                </v-tabs> -->
        </v-col>
      </v-row>
    </template>
  </page-container>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import navigationGuard from '@/mixins/navigationGuard'
  import PageContainer from '@/components/base/PageContainer.vue'

  export default {
    name: 'Barn',
    mixins: [navigationGuard],
    confirmNavigation(callback) {
      this.$confirmNavigation(callback)
    },
    components: { PageContainer },
    data: () => ({
      pageColor: 'brown',
    }),

    computed: {
      ...mapGetters('referential', {
        barnStockItems: 'barnStockItemList',
      }),
      ...mapGetters('simulator/barn', {
        initialFeedStock: 'initialFeedStock',
        initialConcentratedStock: 'initialConcentratedStock',
        totalConcentratedStock: 'totalConcentratedStock',
        strawStock: 'getInitialStrawStock',
      }),
    },
    created() {},

    methods: {
      applyToSimulation() {},
    },
  }
</script>

<style scoped></style>
