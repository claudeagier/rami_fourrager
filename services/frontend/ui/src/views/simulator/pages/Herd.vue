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
        <base-material-card color="orange">
          <template v-slot:heading>
            <v-row>
              <v-col cols="10">
                <div class="text-h3 font-weight-light">Le troupeau</div>

                <div class="text-subtitle-1 font-weight-light">Complete your herd</div>
              </v-col>
              <v-col cols="2">
                <div>
                  <v-btn
                    color="orange"
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
                          color="orange"
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
                              color="orange"
                            >
                              mdi-play-box-outline
                            </v-icon>
                            <!-- <v-btn
                              @click="showDetails(index)"
                              color="orange"
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
                      color="orange"
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
                              color="orange"
                              item-color="orange"
                              @change="loadProfils"
                            ></v-select>
                            <v-select
                              v-model="lots[selectedLot].profil"
                              :items="animalProfils"
                              label="Profil"
                              item-text="name"
                              item-value="id"
                              color="orange"
                              item-color="orange"
                              return-object
                              required
                            ></v-select>
                            <v-text-field
                              v-model="lots[selectedLot].count"
                              :rules="[rules.required, rules.integer]"
                              label="Nombre d'animaux"
                              type="number"
                              color="orange"
                            ></v-text-field>
                            <v-divider></v-divider>
                            <v-select
                              v-model="lots[selectedLot].housing.type"
                              :items="housingTypes"
                              item-text="name"
                              item-value="id"
                              return-object
                              label="Type de logement"
                              color="orange"
                              item-color="orange"
                            ></v-select>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <!-- Housing Details -->
                      <v-tab-item>
                        <v-divider></v-divider>

                        <!-- <v-btn @click="saveHousingDetails">
                              Enregistrer
                            </v-btn> -->
                        <v-tabs
                          centered
                          color="orange"
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
                                color="orange"
                              ></v-text-field>
                              <v-text-field
                                v-model="lots[selectedLot].housing.presence[index].days"
                                :rules="[rules.required, rules.integer, daysRule]"
                                type="number"
                                label="Jours de présence en bâtiment (/28)"
                                hide-spin-buttons
                                color="orange"
                              ></v-text-field>
                            </v-card>
                          </v-tab-item>
                        </v-tabs>
                      </v-tab-item>
                      <!-- Classic Feeds Details -->
                      <v-tab-item>
                        <v-divider></v-divider>
                        <v-tabs
                          centered
                          color="orange"
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
                                  <v-toolbar-title>
                                    Composition of classic feeds for period {{ index + 1 }}
                                  </v-toolbar-title>
                                  <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                  ></v-divider>
                                  <v-spacer></v-spacer>
                                  <v-dialog
                                    max-width="500px"
                                    v-model="dialogs[1][index]"
                                  >
                                    <template v-slot:activator="{ on }">
                                      <v-btn
                                        color="orange"
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
                                  <!-- <v-btn
                                    color="grey"
                                    text
                                  >
                                    dupliquer
                                  </v-btn> -->
                                </v-toolbar>
                                <ration-gauge
                                  color="orange"
                                  :data-feeds="lots[selectedLot].classicFeeds[index].feeds"
                                />
                              </template>
                              <template v-slot:[`item.actions`]="{ item }">
                                <v-icon
                                  @click="editClassicFeedsItem(index, item)"
                                  small
                                >
                                  mdi-pencil
                                </v-icon>
                                <v-icon
                                  @click="deleteClassicFeedsItem(index, item)"
                                  small
                                >
                                  mdi-delete
                                </v-icon>
                              </template>
                            </v-data-table>
                          </v-tab-item>
                        </v-tabs>
                      </v-tab-item>
                      <!-- Concentrated Feeds Details -->
                      <v-tab-item>
                        <v-divider></v-divider>
                        <v-tabs
                          centered
                          color="orange"
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
                              :headers="concentratedHeaders"
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
                                  <v-toolbar-title>
                                    Composition of concentrated feeds for period {{ index + 1 }}
                                  </v-toolbar-title>
                                  <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                  ></v-divider>
                                  <v-spacer></v-spacer>

                                  <v-dialog
                                    max-width="500px"
                                    v-model="dialogs[2][index]"
                                  >
                                    <template v-slot:activator="{ on }">
                                      <v-btn
                                        color="orange"
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
                                                v-model="selectedConcentratedFeedType[index]"
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
                                                v-model="selectedConcentratedFeedQuantity[index]"
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
                                          @click="closeConcentratedFeed(index)"
                                          text
                                        >
                                          Cancel
                                        </v-btn>
                                        <v-btn
                                          @click="saveConcentratedFeed(index)"
                                          color="primary"
                                          outlined
                                        >
                                          Save
                                        </v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </v-dialog>
                                  <!-- <v-btn
                                    color="grey"
                                    text
                                  >
                                    dupliquer
                                  </v-btn> -->
                                </v-toolbar>
                              </template>
                              <template v-slot:[`item.actions`]="{ item }">
                                <v-icon
                                  @click="editConcentratedFeedsItem(index, item)"
                                  small
                                >
                                  mdi-pencil
                                </v-icon>
                                <v-icon
                                  @click="deleteConcentratedFeedsItem(index, item)"
                                  small
                                >
                                  mdi-delete
                                </v-icon>
                              </template>
                            </v-data-table>
                          </v-tab-item>
                        </v-tabs>
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
  import { mapState } from 'vuex'
  import ModalHerd from '../component/ModalHerd'
  import RationGauge from '../component/RationGauge.vue'

  export default {
    name: 'Herd',
    components: {
      ModalHerd,
      RationGauge,
    },
    data() {
      return {
        animate: false,
        // pour la modale
        showModal: false,
        lots: this.$store.getters.herdInfo.batchs,
        selectedLot: null,
        // pour les modals des periodes
        dialogs: Array.from({ length: 3 }, () => Array.from({ length: 13 }, () => false)),
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
        // datatable classicFeed
        selectedClassicFeedIndex: null,
        selectedClassicFeedType: Array.from({ length: 13 }, () => null),
        selectedClassicFeedProportion: Array.from({ length: 13 }, () => null),
        classicHeaders: [
          { text: 'Classic Feed Type', value: 'type.name' },
          { text: 'Proportion (%)', value: 'proportion' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        // datatable concentratedFeed
        selectedConcentratedFeedIndex: null,
        selectedConcentratedFeedType: Array.from({ length: 13 }, () => null),
        selectedConcentratedFeedQuantity: Array.from({ length: 13 }, () => null),
        concentratedHeaders: [
          { text: 'Concentrated Feed Type', value: 'type.name' },
          { text: 'Quantité (kg brut/animal/j)', value: 'quantity' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      }
    },
    created() {
      // ration
      this.$store.dispatch('fetchFeedTypes')
      this.$store.dispatch('fetchConcentratedFeeds')
      this.$store.dispatch('fetchHousingTypes')
      if (this.lots.length <= 0) {
        this.animate = true
      }
    },
    computed: {
      ...mapState(['simulator']),
      batchTypes() {
        return this.$store.getters.batchTypeList
      },
      animalProfils() {
        return this.$store.getters.animalProfilList
      },
      housingTypes() {
        return this.$store.getters.housingTypeList
      },
      feedTypes() {
        return this.$store.getters.feedTypeList
      },
      concentratedFeeds() {
        return this.$store.getters.concentratedFeedList
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
      // pour le détail
      showDetails(index) {
        this.selectedLot = index
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
        console.log('load profil', item)
        this.$store.dispatch('fetchAnimalProfils', item.id)
      },

      // modals
      openModal(type, index) {
        this.$set(this.dialogs[type], index, true)
      },
      closeModal(type, index) {
        this.$set(this.dialogs[type], index, false)
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
      saveClassicFeed(periodIndex, item) {
        if (this.selectedClassicFeedType[periodIndex] && this.selectedClassicFeedProportion[periodIndex]) {
          // Vérifier si la modal est utilisée pour la modification ou l'ajout
          if (this.selectedClassicFeedIndex !== null) {
            const index = this.selectedClassicFeedIndex
            // Modification d'une ration existante
            this.lots[this.selectedLot].classicFeeds[periodIndex].feeds.splice(index, 1, {
              type: this.selectedClassicFeedType[periodIndex],
              proportion: this.selectedClassicFeedProportion[periodIndex],
            })
          } else {
            // Ajout d'une nouvelle ration
            this.lots[this.selectedLot].classicFeeds[periodIndex].feeds.push({
              type: this.selectedClassicFeedType[periodIndex],
              proportion: this.selectedClassicFeedProportion[periodIndex],
            })
          }
          this.closeClassicFeed(periodIndex) // Fermer la modal après sauvegarde
        } else {
          console.error('Please fill in all fields')
        }
      },
      editClassicFeedsItem(periodIndex, item) {
        console.log('edit item', item)
        // Ouvrir la modal de création/modification de la ration Classic Feeds
        this.selectedClassicFeedType[periodIndex] = item.type
        this.selectedClassicFeedProportion[periodIndex] = item.proportion
        this.openModal(1, periodIndex)
        // Enregistrer l'index de la ration Classic Feeds actuellement modifiée
        this.selectedClassicFeedIndex = this.lots[this.selectedLot].classicFeeds[periodIndex].feeds.indexOf(item)
      },
      deleteClassicFeedsItem(periodIndex, item) {
        const index = this.lots[this.selectedLot].classicFeeds[periodIndex].feeds.indexOf(item)
        if (index > -1) {
          this.lots[this.selectedLot].classicFeeds[periodIndex].feeds.splice(index, 1)
        }
      },
      closeClassicFeed(index) {
        this.closeModal(1, index)
        this.selectedClassicFeedType.fill(null)
        this.selectedClassicFeedProportion.fill(null)
      },
      // concentrated feeds
      saveConcentratedFeed(periodIndex, item) {
        if (this.selectedConcentratedFeedType[periodIndex] && this.selectedConcentratedFeedQuantity[periodIndex]) {
          // Vérifier si la modal est utilisée pour la modification ou l'ajout
          if (this.selectedConcentratedFeedIndex !== null) {
            const index = this.selectedConcentratedFeedIndex
            // Modification d'une ration existante
            this.lots[this.selectedLot].concentratedFeeds[periodIndex].feeds.splice(index, 1, {
              type: this.selectedConcentratedFeedType[periodIndex],
              quantity: this.selectedConcentratedFeedQuantity[periodIndex],
            })
          } else {
            // Ajout d'une nouvelle ration
            this.lots[this.selectedLot].concentratedFeeds[periodIndex].feeds.push({
              type: this.selectedConcentratedFeedType[periodIndex],
              quantity: this.selectedConcentratedFeedQuantity[periodIndex],
            })
          }
          this.closeConcentratedFeed(periodIndex) // Fermer la modal après sauvegarde
        } else {
          console.error('Please fill in all fields')
        }
      },
      editConcentratedFeedsItem(periodIndex, item) {
        console.log('edit item', item)
        // Ouvrir la modal de création/modification de la ration Concentrated Feeds
        this.selectedConcentratedFeedType[periodIndex] = item.type
        this.selectedConcentratedFeedQuantity[periodIndex] = item.quantity
        this.openModal(2, periodIndex)
        // Enregistrer l'index de la ration Concentrated Feeds actuellement modifiée
        this.selectedConcentratedFeedIndex =
          this.lots[this.selectedLot].concentratedFeeds[periodIndex].feeds.indexOf(item)
      },
      deleteConcentratedFeedsItem(periodIndex, item) {
        const index = this.lots[this.selectedLot].concentratedFeeds[periodIndex].feeds.indexOf(item)
        if (index > -1) {
          this.lots[this.selectedLot].concentratedFeeds[periodIndex].feeds.splice(index, 1)
        }
      },
      closeConcentratedFeed(index) {
        this.closeModal(2, index)
        this.selectedConcentratedFeedType.fill(null)
        this.selectedConcentratedFeedQuantity.fill(null)
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
