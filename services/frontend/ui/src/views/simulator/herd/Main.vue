<template>
  <v-container
    id="typography"
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
                <div class="text-h3 font-weight-light">Le troupeau</div>

                <div class="text-subtitle-1 font-weight-light">Complete your herd</div>
              </v-col>
              <v-col cols="2">
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
              <v-col cols="4">
                <v-card>
                  <v-card-text>
                    <v-row>
                      <v-col cols="7"><span class="text-md-h3">Liste des lots</span></v-col>
                      <v-col>
                        <v-btn
                          @click="showHerdModal"
                          :color="pageColor"
                          outlined
                          :class="{ 'animate-button': animate }"
                        >
                          Ajouter un lot
                        </v-btn>
                      </v-col>
                    </v-row>

                    <herd-modal
                      :showModal="showModal"
                      @add-lot="addLot"
                      @cancel-add-lot="cancelAddLot"
                    />
                    <v-card
                      v-for="(lot, index) in lots"
                      :key="index"
                    >
                      <v-card-title>Lot {{ index + 1 }}</v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="9"> {{ lot.count }} {{ lot.profil.name }} </v-col>
                          <v-col>
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
                              mdi-play-box-outline
                            </v-icon>
                            <!-- <v-btn
                              @click="showDetails(index)"
                              :color="pageColor"
                            >
                              Voir plus
                            </v-btn> -->
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card v-if="selectedLot !== null">
                  <v-card-title class="text-center justify-center py-6">
                    <h1 class="font-weight-bold text-h2">Lot {{ selectedLot + 1 }}</h1>
                  </v-card-title>
                  <v-card-text>
                    <v-tabs
                      centered
                      :color="pageColor"
                      fixed-tabs
                    >
                      <v-tab
                        v-for="(tab, tabIndex) in ['Overview', 'Housing', 'Classic Feeds', 'Concentrated Feeds']"
                        :key="tabIndex"
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
                    </v-tabs>
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
  import ClassicFeed from './ClassicFeed.vue'
  import ConcentratedFeed from './ConcentratedFeed.vue'
  import HerdModal from './HerdModal'
  import HousingDetails from './HousingDetails.vue'
  import BatchDetails from './BatchDetails.vue'

  export default {
    name: 'Herd',
    components: {
      HerdModal,
      HousingDetails,
      ConcentratedFeed,
      ClassicFeed,
      BatchDetails,
    },
    data() {
      return {
        pageColor: 'orange',
        animate: false,
        // pour la modale
        showModal: false,
        selectedLot: null,
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
      }
    },
    created() {
      this.$store.dispatch('simulator/fetchHousingTypes')
      if (this.lots.length <= 0) {
        this.animate = true
      }
    },
    computed: {
      ...mapGetters('simulator', {
        batchTypes: 'batchTypeList',
        animalProfils: 'animalProfilList',
        housingTypes: 'housingTypeList',
      }),
      ...mapState('simulator/herd', {
        batchs: (state) => state.batchs,
      }),

      lots: {
        get() {
          return this.batchs
        },
        set(val) {},
      },
      // housingType: {
      //   get(){
      //     return this.housingType
      //   }
      // }
    },
    methods: {
      // pour le parent
      applyToSimulation() {
        this.$store.commit('setBatchs', this.lots)
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
      },

      // pour le retour de modal
      addLot(lot) {
        this.$store.commit('simulator/herd/addBatch', lot)
        this.showModal = false
      },
      updateLot(lot) {
        this.$store.commit('simulator/herd/updatelot', { newBatch: lot, oldBatch: this.oldbatch })
        this.selectedLot = null
      },
      cancelAddLot() {
        this.showModal = false
      },
      deleteLot(lot) {
        this.selectedLot = null
        this.$store.commit('simulator/herd/deleteBatch', lot)
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
</style>
