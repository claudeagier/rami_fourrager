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
              <v-col
                cols="12"
                lg="9"
                sm="9"
              >
                <div class="text-h3 font-weight-light">{{ $t('farm.main.title') }}</div>

                <div class="text-subtitle-1 font-weight-light">{{ $t('farm.main.subtitle') }}</div>
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
              <!-- Card pour le dimensionnement de la ferme -->
              <v-col cols="5">
                <v-card>
                  <v-card-title class="text-h4 font-weight-light">{{ $t('farm.dimensioning.title') }}</v-card-title>
                  <v-card-text>
                    <v-form @submit.prevent="saveFarmDimensioning">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model.number="SAU"
                            :label="$t('farm.dimensioning.sau')"
                            :rules="required"
                            type="number"
                            hide-spin-buttons
                            min="0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-divider></v-divider>
                          <v-subheader>{{ $t('farm.dimensioning.constrainedSurfaces') }}</v-subheader>
                        </v-col>
                        <!-- Constrained Surfaces inputs -->
                        <v-col cols="12">
                          <v-text-field
                            v-model.number="irrigable"
                            :label="$t('farm.dimensioning.irrigable')"
                            :rules="constraintRules"
                            type="number"
                            hide-spin-buttons
                            min="0"
                          ></v-text-field>
                          <v-text-field
                            v-model.number="ploughable"
                            :label="$t('farm.dimensioning.ploughable')"
                            :rules="constraintRules"
                            type="number"
                            hide-spin-buttons
                            min="0"
                          ></v-text-field>
                          <v-text-field
                            v-model.number="superficial"
                            :label="$t('farm.dimensioning.superficial')"
                            :rules="constraintRules"
                            type="number"
                            min="0"
                          ></v-text-field>
                          <v-text-field
                            v-model.number="reachable"
                            :label="$t('farm.dimensioning.reachable')"
                            :rules="constraintRules"
                            type="number"
                            min="0"
                            hide-spin-buttons
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>
              <!-- Card pour la saisie des rotations des cultures -->
              <v-col cols="7">
                <v-card>
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
                          <v-toolbar-title class="text-h4 font-weight-light">
                            {{ $t('farm.rotations.table.title') }}
                          </v-toolbar-title>
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
                            {{ $t('farm.rotations.table.btn_add') }}
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
                                <v-card-title> {{ $t('farm.rotations.modal.title') }} </v-card-title>
                                <v-card-text>
                                  <v-container>
                                    <v-row>
                                      <v-col cols="12">
                                        <v-autocomplete
                                          v-model="rotationItem.name"
                                          :items="sticList"
                                          :label="$t('farm.rotations.modal.name')"
                                          item-text="name"
                                          item-value="name"
                                          dense
                                          filled
                                          class="autocomplet-transparent-background"
                                          :rules="required"
                                        >
                                        </v-autocomplete>
                                      </v-col>
                                      <v-col cols="12">
                                        <v-select
                                          v-model="rotationItem.constraint"
                                          :items="constraintsList"
                                          :label="$t('farm.rotations.modal.constraint')"
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
                                          :label="$t('farm.rotations.modal.surface')"
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
                                    {{ $t('btn.cancel') }}
                                  </v-btn>
                                  <v-btn
                                    color="primary"
                                    type="submit"
                                    outlined
                                    :disabled="!valid"
                                  >
                                    {{ $t('btn.save') }}
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
  import navigationGuard from '@/mixins/navigationGuard'
  export default {
    name: 'Farm',
    mixins: [navigationGuard],
    confirmNavigation(callback) {
      this.$confirmNavigation(callback)
    },
    data() {
      return {
        sticList: [],
        pageColor: 'green',
        headers: [
          { text: this.$t('farm.rotations.table.headers.name'), value: 'name' },
          { text: this.$t('farm.rotations.table.headers.constraint'), value: 'constraint.name' },
          { text: this.$t('farm.rotations.table.headers.surface'), value: 'surface' },
          { text: this.$t('farm.rotations.table.headers.actions'), value: 'actions', sortable: false },
        ],
        constraintsList: [
          { id: 1, name: this.$t('farm.dimensioning.irrigable') },
          { id: 2, name: this.$t('farm.dimensioning.ploughable') },
          { id: 3, name: this.$t('farm.dimensioning.superficial') },
          { id: 4, name: this.$t('farm.dimensioning.reachable') },
        ],
        rotationItem: {
          // soil: '',
          name: '',
          constraint: '',
          surface: null,
          // Ajoutez les champs pour les périodes de production
        },
        showRotationItemDialog: false,
        oldRotationitem: null,
        valid: true,
        required: [
          (v) => {
            return !!v || this.$t('validation.required')
          },
        ],
        constraintRules: [
          // (v) => !!v || 'Surface is required',
          (v) => {
            return this.validateSurface || this.$t('validation.farm.dimensioning.overSAU')
          },
        ],
        rotationRules: [
          (v) => {
            return (
              this.validateRotation(this.rotationItem, this.oldRotationitem) ||
              this.$t('validation.farm.dimensioning.over_constrained_surface')
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
        this.$toast({
          message: this.$t('notifications.farm.errors.climatic_year_required'),
          type: 'error',
          timeout: 5000,
        })
      }
    },
    beforeDestroy() {
      this.applyToSimulation()
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
          if (this.rotationItem) {
            if (this.oldRotationitem) {
              this.$store.commit('simulator/farm/updateRotation', {
                newRotation: this.rotationItem,
                oldRotation: this.oldRotationitem,
              })
            } else {
              this.$store.commit('simulator/farm/createRotation', this.rotationItem)
            }
            this.$toast({
              message: this.$t('farm.rotations.table.dialog.add_success'),
              type: 'success',
              timeout: 3000,
            })

            this.showRotationItemDialog = false
            this.clearRotationItem()
          } else {
            this.$toast({
              message: this.$t('farm.rotations.table.dialog.add_error'),
              type: 'error',
              timeout: 5000,
            })
            return false
          }
        }
      },
      deleteRotationItem(item) {
        if (confirm(this.$t('notifications.confirm_delete_item'))) {
          this.$store.commit('simulator/farm/deleteRotation', item)
          this.$toast({
            message: this.$t('farm.rotations.table.dialog.delete_success'),
            type: 'success',
            timeout: 3000,
          })
        }
      },
      clearRotationItem() {
        this.rotationItem = {
          // soil: '',
          name: '',
          constraint: '',
          surface: null,
        }
        this.oldRotationitem = null
        this.$refs.rotationForm.reset()
      },
      applyToSimulation() {
        // this.$store.commit('setRotations', this.rotations)
        this.$store.dispatch('simulator/farm/setTotalAvailablePastureByPeriod')
        this.$store.dispatch('simulator/farm/dispatchProduction')
        this.$store.dispatch('simulator/farm/applyToWorkspace')
        this.$toast({
          message: this.$t('farm.main.messages.apply_success'),
          type: 'success',
          timeout: 3000,
        })
      },
    },
  }
</script>

<style>
  .autocomplet-transparent-background .v-input__control .v-input__slot {
    background-color: transparent !important;
  }
</style>
