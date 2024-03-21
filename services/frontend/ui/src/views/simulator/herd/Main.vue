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

                    <modal-herd
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
                        <v-card>
                          <v-card-text>
                            <v-select
                              v-model="lots[selectedLot].type"
                              :items="batchTypes"
                              label="Type de bétail"
                              item-text="name"
                              item-value="id"
                              return-object
                              required
                              :color="pageColor"
                              :item-color="pageColor"
                              @change="loadProfils"
                            ></v-select>
                            <v-select
                              v-model="lots[selectedLot].profil"
                              :items="animalProfils"
                              label="Profil"
                              item-text="name"
                              item-value="id"
                              :color="pageColor"
                              :item-color="pageColor"
                              return-object
                              required
                            ></v-select>
                            <v-text-field
                              v-model="lots[selectedLot].count"
                              :rules="[rules.required, rules.integer]"
                              label="Nombre d'animaux"
                              type="number"
                              :color="pageColor"
                            ></v-text-field>
                            <v-divider></v-divider>
                            <v-select
                              v-model="lots[selectedLot].housing.type"
                              :items="housingTypes"
                              item-text="name"
                              item-value="id"
                              return-object
                              label="Type de logement"
                              :color="pageColor"
                              :item-color="pageColor"
                            ></v-select>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <!-- Housing Details -->
                      <v-tab-item>
                        <v-divider></v-divider>
                        <housing-graph
                          :selectedLot="selectedLot"
                          :selection="selectedHousingIndex"
                        />
                        <!-- <v-btn @click="saveHousingDetails">
                              Enregistrer
                            </v-btn> -->

                        <v-tabs
                          centered
                          :color="pageColor"
                        >
                          <v-tab
                            v-for="(period, index) in 13"
                            :key="index"
                            @click="housingPeriodSelected(index)"
                          >
                            Période {{ index + 1 }}
                          </v-tab>
                          <v-tab-item
                            v-for="(period, index) in 13"
                            :key="index"
                          >
                            <v-toolbar
                              color="white"
                              flat
                            >
                              <v-toolbar-title> Présence en batiment pour la période {{ index + 1 }} </v-toolbar-title>
                              <v-divider
                                class="mx-4"
                                inset
                                vertical
                              ></v-divider>
                              <v-spacer></v-spacer>
                              <!-- <v-btn
                                color="grey"
                                text
                              >
                                dupliquer
                              </v-btn> -->
                            </v-toolbar>
                            <v-card>
                              <v-text-field
                                v-model="lots[selectedLot].housing.presence[index].animalCount"
                                :rules="[rules.required, rules.integer, presenceRule]"
                                type="number"
                                label="Nb d'animaux présents"
                                hide-spin-buttons
                                :color="pageColor"
                              ></v-text-field>
                              <v-text-field
                                v-model="lots[selectedLot].housing.presence[index].days"
                                :rules="[rules.required, rules.integer, daysRule]"
                                type="number"
                                label="Jours de présence en bâtiment (/28)"
                                hide-spin-buttons
                                :color="pageColor"
                              ></v-text-field>
                            </v-card>
                          </v-tab-item>
                        </v-tabs>
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
  import ClassicFeed from './ClassicFeed.vue'
  import ConcentratedFeed from './ConcentratedFeed.vue'
  import HousingGraph from './HousingGraph.vue'
  import ModalHerd from './ModalHerd'

  export default {
    name: 'Herd',
    components: {
      ModalHerd,
      HousingGraph,
      ConcentratedFeed,
      ClassicFeed,
    },
    data() {
      return {
        pageColor: 'orange',
        animate: false,
        // pour la modale
        showModal: false,
        lots: this.$store.getters.herdInfo.batchs,
        selectedLot: null,
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
        // data housing type
        selectedHousingIndex: null,
      }
    },
    created() {
      // ration

      this.$store.dispatch('fetchHousingTypes')
      if (this.lots.length <= 0) {
        this.animate = true
      }
    },
    computed: {
      batchTypes() {
        return this.$store.getters.batchTypeList
      },
      animalProfils() {
        return this.$store.getters.animalProfilList
      },
      housingTypes() {
        return this.$store.getters.housingTypeList
      },
    },
    methods: {
      // pour le parent
      applyToSimulation() {
        this.$store.commit('setBatchs', this.lots)
      },
      showHerdModal() {
        this.showModal = true
        // Activez l'animation en modifiant la valeur de la propriété animate
        this.animate = false
      },
      housingPeriodSelected(period) {
        console.log('housing index', period)
        this.selectedHousingIndex = period
      },
      // pour le détail
      showDetails(index) {
        this.selectedLot = index
        if (this.lots[this.selectedLot].type.id) {
          this.loadProfils(this.lots[this.selectedLot].type)
        }
      },
      // pour le retour de modal
      addLot(lot) {
        this.lots.push(lot)
        this.showModal = false
      },
      cancelAddLot() {
        this.showModal = false
      },
      deleteLot(item) {
        console.log('delete lot')
        const index = this.lots.indexOf(item)
        this.lots.splice(index, 1)
      },

      // details
      loadProfils(item) {
        this.$store.dispatch('fetchAnimalProfils', item.id)
      },

      // housing
      presenceRule(val) {
        console.log(val)
        if (!val) return true
        return (
          parseInt(val) <= parseInt(this.lots[this.selectedLot].count) ||
          "La présence en bâtiment doit être inférieure ou égale au nombre d'animaux"
        )
      },
      daysRule(val) {
        if (!val) return true
        return parseInt(val) <= 28 || 'Le nombre de jours de présence doit être inférieur ou égal à 28'
      },
      saveHousingDetails() {
        // Vous pouvez implémenter la logique pour sauvegarder les détails du logement ici
        console.log('Détails du logement enregistrés :', this.lots[this.selectedLot].housing)
      },
      // validateHousing(period) {
      //   if (!period.presence || !period.days) {
      //     return false
      //   }
      //   // Vérifie si le nombre de périodes de présence est inférieur ou égal au nombre d'animaux
      //   if (parseInt(period.presence) > parseInt(this.animalCount)) {
      //     return false
      //   }
      //   // Vérifie si le nombre de jours de présence est inférieur ou égal à 28
      //   if (parseInt(period.days) > 28) {
      //     return false
      //   }
      //   return true
      // },

      // classic feeds

      // concentrated feeds
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
