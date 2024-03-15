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
                <div class="text-h3 font-weight-light">La Ferme</div>

                <div class="text-subtitle-1 font-weight-light">Complete your farm</div>
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
              <!-- Card pour le dimensionnement de la ferme -->
              <v-col cols="5">
                <v-card>
                  <v-card-title>Dimensionnement de la Ferme</v-card-title>
                  <v-card-text>
                    <v-form @submit.prevent="saveFarmDimensioning">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="farm.dimensioning.SAU"
                            label="SAU (Surface Agricole Utile)"
                            :rules="[...required, ...constraintRules]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-divider></v-divider>
                          <v-subheader>Surfaces à Contraintes</v-subheader>
                        </v-col>
                        <!-- Constrained Surfaces inputs -->
                        <v-col
                          v-for="(field, key) in constrainedSurfaces"
                          :key="key"
                          cols="12"
                        >
                          <v-text-field
                            v-model="farm.dimensioning.constrainedSurfaces[key]"
                            :label="field.label"
                            :rules="constraintRules"
                            type="number"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <v-btn
                            type="submit"
                            color="primary"
                          >
                            Enregistrer
                          </v-btn>
                        </v-col>
                      </v-row>
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
                      :items="farm.rotation"
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
                            @click="addRotationItemDialog = true"
                            outlined
                          >
                            Allouer une surface
                          </v-btn>
                          <v-dialog
                            v-model="addRotationItemDialog"
                            max-width="600px"
                          >
                            <v-form @submit.prevent="saveRotationItem">
                              <v-card>
                                <v-card-title> Ajouter un nouveau Sol </v-card-title>
                                <v-card-text>
                                  <v-form> </v-form>
                                  <v-container>
                                    <v-row>
                                      <v-col cols="12">
                                        <!-- <v-select
                                          v-model="selectedSTIC"
                                          :items="sticList"
                                          label="Code et Nom de la culture"
                                          item-text="name"
                                          item-value="id"
                                          return-object
                                        ></v-select> -->
                                        <base-material-autocomplete
                                          label="Code et Nom de la culture"
                                          v-if="sticList"
                                          :selected-item="selectedSTIC"
                                          :items="sticList"
                                          item-text="name"
                                          item-value="id"
                                          dense
                                          filled
                                          return-object
                                          @update:selectedItem="onSelectedSTICUpdated"
                                          :loading="sticsLoaded"
                                        ></base-material-autocomplete>
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
                                          v-model="rotationItem.surface"
                                          label="Surface"
                                          :rules="rotationRules"
                                          type="number"
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
                                    @click="addRotationItemDialog = false"
                                  >
                                    Annuler
                                  </v-btn>
                                  <v-btn
                                    color="primary"
                                    text
                                    type="submit"
                                    outlined
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
  import { mapState } from 'vuex'
  import { ref } from 'vue'

  const ics = ref({
    irrigable: 0,
    ploughable: 0,
    superficial: 0,
    reachable: 0,
  })

  export default {
    name: 'Farm',

    data() {
      return {
        pageColor: 'green',
        internalConstrainedSurfaces: ics,
        constraintsList: [
          { id: 1, name: 'irrigable' },
          { id: 2, name: 'ploughable' },
          { id: 3, name: 'superficial' },
          { id: 4, name: 'reachable' },
        ],
        rotationItem: {
          soil: '',
          name: '',
          constraint: '',
          surface: null,
          stic: null,
          // Ajoutez les champs pour les périodes de production
        },
        farm: this.$store.getters.farmInfo,
        addRotationItemDialog: false,
        selectedSTIC: null,
        headers: [
          { text: 'Code du sol', value: 'soil' },
          { text: 'Nom de la culture', value: 'name' },
          { text: 'Contrainte', value: 'constraint' },
          { text: 'Surface', value: 'surface' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        required: [
          (v) => {
            return !!v || 'Field is required'
          },
        ],
        constraintRules: [
          // (v) => !!v || 'Surface is required',
          (v) => {
            return this.validateSurface() || 'la somme des surfaces contraintes dépasse la SAU'
          },
        ],
        rotationRules: [
          (v) => {
            return this.validateRotation(v) || 'La surface contrainte est dépassée'
          },
        ],
      }
    },
    computed: {
      ...mapState(['simulator']),
      sticList() {
        return this.$store.getters.sticList
      },
      constrainedSurfaces() {
        return {
          irrigable: { label: 'Surfaces irrigables' },
          ploughable: { label: 'Surfaces labourables' },
          superficial: { label: 'Surfaces superficielles' },
          reachable: { label: 'Surfaces atteignables' },
        }
      },
      sticsLoaded() {
        console.log('isLoaded', this.$store.getters.isLoading('sticList'))
        return this.$store.getters.isLoading('sticList')
      },
    },
    actions: {},
    created() {
      // this.fetchSTIC()
    },
    methods: {
      onSelectedSTICUpdated(selectedItem) {
        this.selectedSTIC = selectedItem
      },
      saveFarmDimensioning() {
        // Vérifiez la validation pour chaque surface à contrainte
        const isIrrigableValid = this.validateSurface('irrigable')
        const isPloughableValid = this.validateSurface('ploughable')
        const isSuperficialValid = this.validateSurface('superficial')
        const isReachableValid = this.validateSurface('reachable')

        // Si toutes les surfaces à contrainte sont valides, soumettez le formulaire
        if (isIrrigableValid && isPloughableValid && isSuperficialValid && isReachableValid) {
          this.$store.commit('setDimensioning', this.farm.dimensioning)
          // Soumettez le formulaire ou effectuez d'autres actions requises
        } else {
          // Affichez un message d'erreur ou effectuez d'autres actions si la validation échoue
        }
      },
      validateSurface() {
        const dim = this.farm.dimensioning
        const constrainedSurfaces = { ...dim.constrainedSurfaces }
        const totalConstrainedSurfaces = Object.values(constrainedSurfaces).reduce((acc, curr) => {
          const intValue = parseInt(curr, 10)
          return acc + (isNaN(intValue) ? 0 : intValue)
        }, 0)
        return totalConstrainedSurfaces <= dim.SAU
      },
      validateRotation(value) {
        const farmDim = this.$store.getters.farmInfo.dimensioning
        if (this.rotationItem.constraint) {
          const cs = farmDim.constrainedSurfaces
          const constraint = this.rotationItem.constraint.name
          const acc = parseInt(this.internalConstrainedSurfaces[constraint]) + parseInt(value)
          return acc <= parseInt(cs[constraint])
        } else {
          const totalSurfaces = Object.values(this.farm.rotation).reduce((acc, curr) => {
            const intValue = parseInt(curr.surface, 10)
            return acc + (isNaN(intValue) ? 0 : intValue)
          }, 0)
          return totalSurfaces + parseInt(value) <= parseInt(farmDim.SAU)
        }
      },
      saveRotationItem() {
        if (this.selectedSTIC) {
          this.rotationItem.stic = this.selectedSTIC
          this.rotationItem.soil = this.selectedSTIC.code
          this.rotationItem.name = this.selectedSTIC.name
          this.rotationItem.constraint = this.rotationItem.constraint.name
          this.internalConstrainedSurfaces[this.rotationItem.constraint] += this.rotationItem.surface

          this.farm.rotation.push({ ...this.rotationItem })
          this.clearRotationItem()
          this.addRotationItemDialog = false
        } else {
          console.log("don't saved")
        }
      },
      deleteRotationItem(item) {
        const index = this.farm.rotation.indexOf(item)
        if (index > -1) {
          this.farm.rotation.splice(index, 1)
        }
      },
      clearRotationItem() {
        this.rotationItem = {
          soil: '',
          name: '',
          constraint: '',
          surface: 0,
          stic: null,
        }
        this.selectedSTIC = null
      },
      applyToSimulation() {
        this.$store.commit('setRotations', this.farm.rotation)
      },
    },
  }
</script>

<style scoped>
  /* Ajoutez vos styles ici */
</style>
