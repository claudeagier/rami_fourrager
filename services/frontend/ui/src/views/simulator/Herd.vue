<template>
  <base-page-container
    container-name="herd-vue"
    :page-color="pageColor"
    :title="$t('herd.main.title')"
    :subtitle="$t('herd.main.subtitle')"
    @apply="applyToSimulation"
  >
    <template v-slot:content>
      <v-row>
        <v-col
          cols="12"
          lg="3"
          class="pt-0 pb-0"
        >
          <v-card
            id="batch-list"
            class="mt-0"
          >
            <v-card-title>
              <span class="font-weight-bold text-lg-h3 text-md-h4">{{ $t('herd.main.list.title') }}</span>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-spacer></v-spacer>
              <v-btn
                @click="showHerdModal"
                :color="pageColor"
                outlined
                small
                :class="{ 'animate-button': animate }"
              >
                {{ $t('herd.main.list.btn_add') }}
              </v-btn>
            </v-card-title>
            <v-card-text>
              <herd-modal
                :showModal="showModal"
                @add-lot="addLot"
                @cancel-add-lot="cancelAddLot"
              />

              <div class="scrollable-list">
                <v-card
                  v-for="(lot, index) in lots"
                  :key="index"
                  :elevation="index === selectedLot ? 4 : 2"
                  hover
                  :shaped="index === selectedLot"
                  :outlined="index === selectedLot"
                  @click="showDetails(index)"
                >
                  <v-card-title class="font-weight-bold text-lg-h4 text-md-h4">
                    <span>{{ $t('herd.main.card.title', { id: index + 1 }) }}</span>
                    <v-divider
                      class="mx-4"
                      inset
                      vertical
                    />
                    <v-spacer></v-spacer>
                    <v-icon
                      @click="deleteLot(lot)"
                      medium
                    >
                      mdi-delete
                    </v-icon>
                    <v-icon
                      @click="showDetails(index)"
                      large
                      :color="pageColor"
                    >
                      mdi-square-edit-outline
                    </v-icon>
                  </v-card-title>
                  <v-card-text>
                    <v-col cols="12">
                      {{ $t('herd.main.card.description', { count: lot.count, name: lot.profile.name }) }}
                    </v-col>
                  </v-card-text>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
          <download-file />
        </v-col>
        <v-col
          cols="12"
          lg="9"
          class="pt-0 pb-0"
        >
          <v-card
            v-if="selectedLot === null"
            class="ma-0"
            style="height: 100%"
          >
          </v-card>
          <v-card
            id="batch-details"
            class="ma-0"
            v-else
          >
            <v-card-title class="text-center justify-center py-6">
              <v-row>
                <v-col
                  cols="7"
                  class="pt-0 pb-0"
                >
                  <h1 class="font-weight-bold text-lg-h3">
                    {{ $t('herd.main.details.title', { id: selectedLot + 1 }) }}
                  </h1>
                </v-col>
                <v-col class="pt-0 pb-0">
                  <graphs-modal
                    :selectedLot="selectedLot"
                    :pageColor="pageColor"
                  />
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row
                align="center"
                justify="start"
              >
                <v-col cols="12">
                  <v-tabs
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
                      @click="$store.dispatch('simulator/herd/setHerd')"
                    >
                      {{ tab }}
                    </v-tab>
                    <!-- batch Details -->
                    <v-tab-item>
                      <v-divider></v-divider>
                      <batch-details
                        :pageColor="pageColor"
                        :selectedLot="selectedLot"
                      />
                    </v-tab-item>
                    <!-- Housing Details -->
                    <v-tab-item>
                      <v-divider></v-divider>
                      <housing-details
                        :pageColor="pageColor"
                        :selectedLot="selectedLot"
                      />
                    </v-tab-item>
                    <!-- Classic Feeds Details -->
                    <v-tab-item>
                      <v-divider></v-divider>
                      <classic-feed
                        :pageColor="pageColor"
                        :selectedLot="selectedLot"
                      />
                    </v-tab-item>
                    <!-- Concentrated Feeds Details -->
                    <v-tab-item>
                      <v-divider></v-divider>
                      <concentrated-feed
                        :pageColor="pageColor"
                        :selectedLot="selectedLot"
                      />
                    </v-tab-item>
                    <!-- Pasture Details -->
                    <v-tab-item>
                      <v-divider></v-divider>
                      <pasture-details
                        :pageColor="pageColor"
                        :selectedLot="selectedLot"
                      />
                    </v-tab-item>
                  </v-tabs>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </base-page-container>
</template>
<script>
  import { mapState } from 'vuex'
  import ClassicFeed from '@/components/parts/herd/ClassicFeed.vue'
  import ConcentratedFeed from '@/components/parts/herd/ConcentratedFeed.vue'
  import HerdModal from '@/components/parts/herd/HerdModal'
  import HousingDetails from '@/components/parts/herd/HousingDetails.vue'
  import BatchDetails from '@/components/parts/herd/BatchDetails.vue'
  import PastureDetails from '@/components/parts/herd/PastureDetails'
  import navigationGuard from '@/mixins/navigationGuard'
  import GraphsModal from '@/components/parts/herd/GraphsModal.vue'
  import DownloadFile from '../../components/core/DownloadFile.vue'

  export default {
    name: 'Herd',
    mixins: [navigationGuard],
    confirmNavigation(callback) {
      this.$confirmNavigation(callback)
    },
    components: {
      HerdModal,
      HousingDetails,
      ConcentratedFeed,
      ClassicFeed,
      BatchDetails,
      PastureDetails,
      GraphsModal,
      DownloadFile,
    },
    data() {
      return {
        pageColor: 'orange',
        animate: false,
        // pour la modale
        showModal: false,
        showGraphModal: false,
        selectedLot: null,
        rules: {
          required: (val) => !!val || this.$t('validation.required'),
          integer: (val) => /^\d+$/.test(val) || this.$t('validation.integer'),
        },
      }
    },
    created() {
      if (this.lots.length <= 0) {
        this.animate = true
      }
    },
    beforeDestroy() {
      this.applyToSimulation()
    },
    computed: {
      ...mapState('simulator/herd', {
        batchs: (state) => state.batchs,
      }),

      lots: {
        get() {
          return this.batchs
        },
        set(val) {},
      },
    },
    methods: {
      // pour le parent
      applyToSimulation() {
        this.$store.dispatch('simulator/herd/setHerd')
        this.$toast({
          message: this.$t('notifications.herd.apply_success'),
          type: 'success',
          timeout: 3000,
        })
      },
      showHerdModal() {
        this.showModal = true
        this.selectedLot = null
        // Activez l'animation en modifiant la valeur de la propriété animate
        this.animate = false
      },
      // pour le détail
      showDetails(index) {
        this.selectedLot = index
        this.$store.dispatch('simulator/herd/setHerd')
      },

      // pour le retour de modal
      addLot(lot) {
        this.$store.commit('simulator/herd/addBatch', lot)
        this.showModal = false
      },
      cancelAddLot() {
        this.showModal = false
      },
      deleteLot(lot) {
        this.selectedLot = null
        if (confirm(this.$t('notifications.confirm_delete_item'))) {
          this.$store.commit('simulator/herd/deleteBatch', lot)
          this.$toast({
            message: this.$t('notifications.herd.delete_batch_success'),
            type: 'success',
            timeout: 3000,
          })
        }
      },
    },
  }
</script>

<style scoped>
  /* Définissez les animations CSS */
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Appliquez l'animation au bouton lorsque la classe animate-button est activée */
  .animate-button {
    animation: pulse 0.5s ease 3;
  }

  #batch-details {
    overflow-y: auto;
    height: calc(75vh - 42px);
  }

  .scrollable-list {
    overflow-y: auto;
    max-height: calc(75vh - 210px); /* Adjust height according to your needs */
  }

  /* .scrollable-list::-webkit-scrollbar {
    width: 0;
  } */
  .vertical-text {
    background-color: #f0f0f0; /* Fond gris */
    color: white;
    font-size: 10em; /* Taille de la police */
    font-weight: bold; /* Gras */
    transform: rotate(-90deg); /* Rotation de 90 degrés */
    display: flex; /* Utilisation de flexbox */
    align-items: center; /* Alignement vertical */
    justify-content: center; /* Alignement horizontal */
    height: 0.6em;
    width: auto;
    /* position: absolute;
    left: 0;
    top: 0;
    z-index: 10; */
  }
  .adaptive-text-button {
    white-space: normal; /* Permet d'enrouler le texte sur plusieurs lignes */
    text-align: center; /* Centre le texte si besoin */
    line-height: 1.5; /* Ajoute de l'espacement entre les lignes */
  }
</style>
