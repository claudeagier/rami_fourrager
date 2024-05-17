<template>
  <v-container
    id="farm-vue"
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
                <div class="text-h3 font-weight-light">La Ferme</div>

                <div class="text-subtitle-1 font-weight-light">Complete your farm</div>
              </v-col>
              <v-col>
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
              <!-- Card pour le dimensionnement de la ferme -->
              <v-col cols="5">
                <v-card>
                  <v-card-title>Dimensionnement de la Ferme</v-card-title>
                  <v-card-text>
                    <v-form @submit.prevent="saveFarmDimensioning">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model.number="SAU"
                            label="SAU (Surface Agricole Utile)"
                            :rules="required"
                            type="number"
                            hide-spin-buttons
                            min="0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-divider></v-divider>
                          <v-subheader>Surfaces à Contraintes</v-subheader>
                        </v-col>
                        <!-- Constrained Surfaces inputs -->
                        <v-col cols="12">
                          <v-text-field
                            v-model.number="irrigable"
                            label="irrigable"
                            :rules="constraintRules"
                            type="number"
                            hide-spin-buttons
                            min="0"
                          ></v-text-field>
                          <v-text-field
                            v-model.number="ploughable"
                            label="ploughable"
                            :rules="constraintRules"
                            type="number"
                            hide-spin-buttons
                            min="0"
                          ></v-text-field>
                          <v-text-field
                            v-model.number="superficial"
                            label="superficial"
                            :rules="constraintRules"
                            type="number"
                            min="0"
                          ></v-text-field>
                          <v-text-field
                            v-model.number="reachable"
                            label="reachable"
                            :rules="constraintRules"
                            type="number"
                            min="0"
                            hide-spin-buttons
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <!-- <v-row>
                        <v-col cols="12">
                          <v-btn
                            type="submit"
                            color="primary"
                          >
                            Enregistrer
                          </v-btn>
                        </v-col>
                      </v-row> -->
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>
              <!-- Card pour la saisie des rotations des cultures -->
              <v-col cols="7">
                <v-card>
                  <v-card-title>Saisie de l'assolement</v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="rotations"
                      class="elevation-1"
                      sort-by="name"
                    >
                      <template v-slot:top>
                        <v-toolbar
                          color="white"
                          flat
                        >
                          <v-toolbar-title> Assolement des Cultures </v-toolbar-title>
                          <v-divider
                            class="mx-4"
                            inset
                            vertical
                          ></v-divider>
                          <v-spacer></v-spacer>
                          <v-btn
                            :color="pageColor"
                            dark
                            @click="showRotationItemDialog = true"
                            outlined
                          >
                            Allouer une surface
                          </v-btn>
                          <v-dialog
                            v-model="showRotationItemDialog"
                            max-width="600px"
                          >
                            <v-form
                              ref="rotationForm"
                              @submit.prevent="saveRotationItem"
                              v-model="valid"
                              lazy-validation
                            >
                              <v-card>
                                <v-card-title> Ajouter un nouveau Sol </v-card-title>
                                <v-card-text>
                                  <v-container>
                                    <v-row>
                                      <v-col cols="12">
                                        <!-- find stic in sticList -->
                                        <v-autocomplete
                                          v-model="rotationItem.stic"
                                          :items="sticList"
                                          label="Code et Nom de la culture"
                                          item-text="name"
                                          item-value="id"
                                          dense
                                          filled
                                          return-object
                                          class="autocomplet-transparent-background"
                                          :rules="required"
                                        >
                                        </v-autocomplete>
                                      </v-col>
                                      <v-col cols="12">
                                        <v-select
                                          v-model="rotationItem.constraint"
                                          :items="constraintsList"
                                          label="Contrainte"
                                          item-text="name"
                                          item-value="id"
                                          return-object
                                          clearable
                                        >
                                        </v-select>
                                      </v-col>
                                      <v-col cols="12">
                                        <v-text-field
                                          v-model.number="rotationItem.surface"
                                          label="Surface"
                                          :rules="[...required, ...rotationRules]"
                                          type="number"
                                          hide-spin-buttons
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-container>
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    text
                                    color="grey"
                                    @click="cancelRotationDialog"
                                  >
                                    Annuler
                                  </v-btn>
                                  <v-btn
                                    color="primary"
                                    text
                                    type="submit"
                                    outlined
                                    :disabled="!valid"
                                  >
                                    Enregistrer
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-form>
                          </v-dialog>
                        </v-toolbar>
                      </template>
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                          @click="deleteRotationItem(item)"
                          small
                        >
                          mdi-delete
                        </v-icon>
                        <v-icon
                          @click="editRotationItem(item)"
                          medium
                          color="green"
                          background-color="green"
                        >
                          mdi-square-edit-outline
                        </v-icon>
                      </template>
                    </v-data-table>
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
  import { mapGetters } from 'vuex'
  // TODO-FRONT modifier la manière de chargé les stics dans la simulation pour les changements d'années climatiques
  // seulement mettre le nom de la baguette et customiser la recherche de l'autocomplete
  // il faut aussi voir pour la fonction apply qui va rechercher les baguettes dans la liste par le site et l'année climatique et le nom de la baguette pour les calculs
  // on ne prend plus les stic dans le state mais dans la liste filtré
  export default {
    name: 'Farm',

    data() {
      return {
        sticList: [],
        pageColor: 'green',
        headers: [
          { text: 'Nom de la culture', value: 'name' },
          { text: 'Contrainte', value: 'constraint.name' },
          { text: 'Surface', value: 'surface' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        constraintsList: [
          { id: 1, name: 'irrigable' },
          { id: 2, name: 'ploughable' },
          { id: 3, name: 'superficial' },
          { id: 4, name: 'reachable' },
        ],
        rotationItem: {
          // soil: '',
          name: '',
          constraint: '',
          surface: null,
          stic: null,
          // Ajoutez les champs pour les périodes de production
        },
        showRotationItemDialog: false,
        oldRotationitem: null,
        valid: true,
        required: [
          (v) => {
            return !!v || 'Field is required'
          },
        ],
        constraintRules: [
          // (v) => !!v || 'Surface is required',
          (v) => {
            return this.validateSurface || 'la somme des surfaces contraintes dépasse la SAU'
          },
        ],
        rotationRules: [
          (v) => {
            return (
              this.validateRotation(this.rotationItem, this.oldRotationitem) || 'La surface contrainte est dépassée'
            )
          },
        ],
      }
    },
    created() {
      if (this.climaticYear != null) {
        this.sticList = this.getSticList(this.climaticYear)
      } else {
        console.error('climatic year required')
        this.$store.dispatch(
          'toaster/addNotification',
          {
            message: 'notifications.farm.errors.climatic_year_required',
            color: 'error', // ou 'error', 'warning', 'info', etc.
            show: true,
          },
          { root: true }
        )
      }
    },
    computed: {
      ...mapGetters('referential', {
        getSticList: 'sticList',
      }),
      ...mapGetters('simulator/farm', {
        dimensioning: 'dimensioning',
        rotations: 'rotations',
        validateRotation: 'validateRotation',
        validateSurface: 'validateSurface',
      }),
      ...mapGetters('simulator', {
        climaticYear: 'climaticYearInfo',
      }),
      SAU: {
        get() {
          return this.dimensioning.SAU
        },
        set(val) {
          this.$store.commit('simulator/farm/setSAU', val)
        },
      },
      irrigable: {
        get() {
          return this.dimensioning.constrainedSurfaces.irrigable
        },
        set(val) {
          this.$store.commit('simulator/farm/setIrrigable', val)
        },
      },
      ploughable: {
        get() {
          return this.dimensioning.constrainedSurfaces.ploughable
        },
        set(val) {
          this.$store.commit('simulator/farm/setPloughable', val)
        },
      },
      superficial: {
        get() {
          return this.dimensioning.constrainedSurfaces.superficial
        },
        set(val) {
          this.$store.commit('simulator/farm/setSuperficial', val)
        },
      },
      reachable: {
        get() {
          return this.dimensioning.constrainedSurfaces.reachable
        },
        set(val) {
          this.$store.commit('simulator/farm/setReachable', val)
        },
      },
    },
    methods: {
      editRotationItem(item) {
        this.rotationItem = { ...item }
        this.oldRotationitem = { ...item }
        this.showRotationItemDialog = true
      },
      cancelRotationDialog() {
        this.showRotationItemDialog = false
        this.clearRotationItem()
      },
      saveRotationItem() {
        if (this.$refs.rotationForm.validate()) {
          if (this.rotationItem && this.rotationItem.stic) {
            // this.rotationItem.soil = this.rotationItem.stic.code
            this.rotationItem.name = this.rotationItem.stic.name
            if (this.oldRotationitem) {
              this.$store.commit('simulator/farm/updateRotation', {
                newRotation: this.rotationItem,
                oldRotation: this.oldRotationitem,
              })
            } else {
              this.$store.commit('simulator/farm/createRotation', this.rotationItem)
            }
            this.showRotationItemDialog = false
            this.clearRotationItem()
          } else {
            return false
          }
        }
      },
      deleteRotationItem(item) {
        this.$store.commit('simulator/farm/deleteRotation', item)
      },
      clearRotationItem() {
        this.rotationItem = {
          // soil: '',
          name: '',
          constraint: '',
          surface: null,
          stic: null,
        }
        this.oldRotationitem = null
        this.$refs.rotationForm.reset()
      },
      applyToSimulation() {
        // this.$store.commit('setRotations', this.rotations)
        this.$store.dispatch('simulator/farm/setTotalAvailablePastureByPeriod')
        this.$store.dispatch('simulator/farm/dispatchProduction')
      },
    },
  }
</script>

<style>
  .autocomplet-transparent-background .v-input__control .v-input__slot {
    background-color: transparent !important;
  }
</style>
