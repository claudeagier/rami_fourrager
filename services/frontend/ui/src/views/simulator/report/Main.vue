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
              <v-col
                cols="12"
                lg="9"
                sm="9"
              >
                <div class="text-h3 font-weight-light">
                  <!-- {{ $t('barn.main.title') }} -->
                  Le bilan
                </div>
                <div class="text-subtitle-1 font-weight-light">
                  {{ $t('barn.main.subtitle') }}
                  Le bilan de la simulation
                </div>
              </v-col>
              <v-col>
                <div>
                  <v-btn
                    :color="pageColor"
                    style="background-color: white"
                    outlined
                    @click="applyToSimulation"
                  >
                    {{ $t('btn.apply') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </template>
          <v-card-text>
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
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import navigationGuard from '@/mixins/navigationGuard'

  export default {
    name: 'Barn',
    mixins: [navigationGuard],
    confirmNavigation(callback) {
      this.$confirmNavigation(callback)
    },
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
