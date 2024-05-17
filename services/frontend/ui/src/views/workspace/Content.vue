<template>
  <div>
    <v-col cols="12">
      <v-tabs
        centered
        color="primary"
        fixed-tabs
      >
        <v-tab
          v-for="(tab, tabIndex) in ['simulations', 'profiles', 'stics', 'feeds']"
          :key="tabIndex"
        >
          {{ $t('workspace.content.tabs.' + tab) }}
        </v-tab>
        <v-tab-item>
          <!-- <div>datatable des simulations du workpsace -->
          <v-data-table
            :items="workspace.simulations"
            :headers="simulationHeaders"
            fixed-header
            :options="dataTableOptions"
            :value="selectedRows"
          >
            <template v-slot:top>
              <v-toolbar
                color="white"
                flat
              >
                <v-toolbar-title> </v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-spacer></v-spacer>
                <v-btn
                  outlined
                  color="primary"
                  @click="showSimulationModal = true"
                >
                  {{ $t('workspace.content.datatables.simulations.create.btn') }}
                </v-btn>
                <v-dialog
                  persistent
                  no-click-animation
                  v-model="showSimulationModal"
                  max-width="600"
                >
                  <v-card>
                    <v-card-title>{{
                      $t('workspace.content.datatables.simulations.create.dialog.title')
                    }}</v-card-title>
                    <v-form
                      ref="simulationForm"
                      v-model="validSimulation"
                      @submit.prevent="createSimulation"
                      lazy-validation
                    >
                      <v-card-text>
                        <v-text-field
                          v-model="simulationItem.name"
                          label="Nom"
                          :rules="[simulationRules.required]"
                        ></v-text-field>
                        <v-textarea
                          v-model="simulationItem.description"
                          label="Description"
                        ></v-textarea>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          outlined
                          color="green"
                          type="submit"
                          :disabled="!validSimulation"
                        >
                          {{ $t('workspace.content.datatables.simulations.create.dialog.btn_create') }}
                        </v-btn>
                        <v-btn
                          color="grey"
                          outlined
                          @click="cancelCreateSimulation"
                        >
                          {{ $t('workspace.content.datatables.simulations.create.dialog.btn_cancel') }}
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item="{ item }">
              <tr :class="item.loaded ? 'primary white--text' : ''">
                <!-- Apply green color if loaded -->
                <td>
                  {{ item.name }}
                  <!-- Replace with appropriate data -->
                </td>
                <td>
                  {{ item.description }}
                  <!-- Replace with appropriate data -->
                </td>
                <td>
                  {{ item.lastModifiedDate }}
                  <!-- Replace with appropriate data -->
                </td>
                <td>
                  <v-tooltip
                    left
                    open-delay="500"
                    color="grey"
                    v-if="!item.loaded"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="loadSimulation(item)"
                        medium
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-head-sync-outline
                      </v-icon>
                    </template>
                    <span>Charger la simulation</span>
                  </v-tooltip>

                  <v-icon
                    v-if="!item.loaded"
                    @click="deleteSimulation(item)"
                    small
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item>
          <!-- <div>datatable des animalProfiles du workpsace avec un bouton exporter pour exporter la liste -->
          <v-data-table
            :items="workspace.animalProfiles"
            :headers="animalProfileHeaders"
            fixed-header
            :options="dataTableOptions"
          >
            <template v-slot:top>
              <v-toolbar
                color="white"
                flat
              >
                <v-toolbar-title> </v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-spacer></v-spacer>
                <v-btn
                  outlined
                  color="primary"
                  @click="showSimulationModal = true"
                >
                  {{ $t('workspace.content.datatables.simulations.create.btn') }}
                </v-btn>
                <v-dialog
                  persistent
                  no-click-animation
                  v-model="showSimulationModal"
                  max-width="600"
                >
                  <v-card>
                    <v-card-title>{{
                      $t('workspace.content.datatables.simulations.create.dialog.title')
                    }}</v-card-title>
                    <v-form
                      ref="simulationForm"
                      v-model="validSimulation"
                      @submit.prevent="createSimulation"
                      lazy-validation
                    >
                      <v-card-text>
                        <v-text-field
                          v-model="simulationItem.name"
                          label="Nom"
                          :rules="[simulationRules.required]"
                        ></v-text-field>
                        <v-textarea
                          v-model="simulationItem.description"
                          label="Description"
                        ></v-textarea>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          outlined
                          color="green"
                          type="submit"
                          :disabled="!validSimulation"
                        >
                          {{ $t('workspace.content.datatables.simulations.create.dialog.btn_create') }}
                        </v-btn>
                        <v-btn
                          color="grey"
                          outlined
                          @click="cancelCreateSimulation"
                        >
                          {{ $t('workspace.content.datatables.simulations.create.dialog.btn_cancel') }}
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn @click="modifyAnimalProfile(item)">Modifier</v-btn>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item>
          <!-- <div>datatable des stics du workpsace avec un bouton exporter pour exporter la liste -->
          <v-data-table
            :items="workspace.stics"
            :headers="sticHeaders"
            fixed-header
            :options="dataTableOptions"
          >
            <template v-slot:top>
              <v-toolbar
                color="white"
                flat
              >
                <v-toolbar-title> </v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-spacer></v-spacer>
                <v-btn
                  outlined
                  color="primary"
                  @click="showSimulationModal = true"
                >
                  {{ $t('workspace.content.datatables.simulations.create.btn') }}
                </v-btn>
                <v-dialog
                  persistent
                  no-click-animation
                  v-model="showSimulationModal"
                  max-width="600"
                >
                  <v-card>
                    <v-card-title>{{
                      $t('workspace.content.datatables.simulations.create.dialog.title')
                    }}</v-card-title>
                    <v-form
                      ref="simulationForm"
                      v-model="validSimulation"
                      @submit.prevent="createSimulation"
                      lazy-validation
                    >
                      <v-card-text>
                        <v-text-field
                          v-model="simulationItem.name"
                          label="Nom"
                          :rules="[simulationRules.required]"
                        ></v-text-field>
                        <v-textarea
                          v-model="simulationItem.description"
                          label="Description"
                        ></v-textarea>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          outlined
                          color="green"
                          type="submit"
                          :disabled="!validSimulation"
                        >
                          {{ $t('workspace.content.datatables.simulations.create.dialog.btn_create') }}
                        </v-btn>
                        <v-btn
                          color="grey"
                          outlined
                          @click="cancelCreateSimulation"
                        >
                          {{ $t('workspace.content.datatables.simulations.create.dialog.btn_cancel') }}
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn @click="modifyStic(item)">Modifier</v-btn>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item>
          <!-- <div>datatable des feeds du workpsace avec un bouton exporter pour exporter la liste -->
          <v-data-table
            :items="workspace.feeds"
            :headers="feedHeaders"
          >
            <template v-slot:top>
              <v-toolbar
                color="white"
                flat
              >
                <v-toolbar-title> </v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-spacer></v-spacer>
                <classic-feed-modal
                  :forceOpen="openClassicFeedModal"
                  :item="feedItem"
                  @add-item="createClassicFeed"
                />
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn @click="modifyFeed(item)">Modifier</v-btn>
              <v-btn @click="exportFeed(item)">Exporter</v-btn>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </div>
</template>
<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  import simulationSchema from '@/schemas/simulation'
  import ClassicFeedModal from './ClassicFeedModal.vue'
  export default {
    name: 'WorkspaceContent',
    components: { ClassicFeedModal },
    data() {
      return {
        selectedRows: [],
        showSimulationModal: false,
        simulationItem: {},
        feedItem: null,
        openClassicFeedModal: false,
        validSimulation: false,
        simulationRules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
      }
    },
    computed: {
      ...mapState('simulator/farm', {
        farm: (state) => state,
      }),
      ...mapState('simulator/barn', {
        barn: (state) => state,
      }),
      ...mapState('simulator/herd', {
        herd: (state) => state,
      }),
      ...mapGetters('workspace', {
        getWorkspace: 'getWorkspace',
      }),

      workspace: {
        get() {
          return this.getWorkspace
        },
      },
      dataTableOptions() {
        return {
          itemsPerPage: 4,
        }
      },
      simulationHeaders() {
        return [
          { text: this.$t('workspace.content.datatables.simulations.header.name'), value: 'name' },
          { text: this.$t('workspace.content.datatables.simulations.header.description'), value: 'description' },
          {
            text: this.$t('workspace.content.datatables.simulations.header.lastModifiedDate'),
            value: 'lastModifiedDate',
            dataType: 'Date',
          },
          {
            text: this.$t('workspace.content.datatables.simulations.header.actions'),
            value: 'actions',
            sortable: false,
          },
        ]
      },
      animalProfileHeaders() {
        return [
          { text: this.$t('workspace.content.datatables.profiles.header.batchtype'), value: 'batchType' },
          { text: this.$t('workspace.content.datatables.profiles.header.name'), value: 'profileName' },
          { text: this.$t('workspace.content.datatables.profiles.header.actions'), value: 'actions', sortable: false },
        ]
      },
      sticHeaders() {
        return [
          { text: this.$t('workspace.content.datatables.stics.header.site'), value: 'site' },
          { text: this.$t('workspace.content.datatables.stics.header.climatic_year'), value: 'climaticYear' },
          { text: this.$t('workspace.content.datatables.stics.header.name'), value: 'baguetteName' },
          { text: this.$t('workspace.content.datatables.stics.header.actions'), value: 'actions', sortable: false },
        ]
      },
      feedHeaders() {
        return [
          { text: this.$t('workspace.content.datatables.classicFeeds.header.name'), value: 'feedName' },
          {
            text: this.$t('workspace.content.datatables.classicFeeds.header.actions'),
            value: 'actions',
            sortable: false,
          },
        ]
      },
    },
    methods: {
      ...mapMutations('workspace', { activateSimulation: 'activateSimulation' }),
      ...mapMutations('simulator', { setSimulation: 'setSimulation' }),
      ...mapMutations('simulator/farm', { setFarm: 'setFarm' }),
      ...mapMutations('simulator/barn', { setBarn: 'setBarn' }),
      ...mapMutations('simulator/herd', { setHerd: 'setHerd' }),

      createSimulation() {
        if (this.$refs.simulationForm.validate()) {
          const sim = simulationSchema
          sim.name = this.simulationItem.name
          sim.description = this.simulationItem.description

          this.$store.commit('workspace/addSimulation', sim)
        } else {
          this.resetForm()
        }

        this.showSimulationModal = false
      },
      cancelCreateSimulation() {
        this.showSimulationModal = false
        this.resetForm()
      },
      resetForm() {
        this.$refs.simulationForm.reset()
        this.simulationItem = {}
      },
      loadSimulation(simulation) {
        this.setSimulation({
          name: simulation.name,
          site: simulation.site,
          climaticYear: simulation.climaticYear,
          loaded: true,
        })
        this.activateSimulation(simulation)
        this.setFarm(simulation.farm)
        this.setBarn(simulation.barn)
        this.setHerd(simulation.herd)

        // apply all
        this.$store.dispatch('simulator/barn/setStock')
        this.$store.dispatch('simulator/farm/setTotalAvailablePastureByPeriod')
        this.$store.dispatch('simulator/farm/dispatchProduction')
        this.$store.dispatch('toaster/addNotification', {
          message: 'notifications.simulation_loaded_success',
          color: 'success',
          show: true,
        })
        // this.$router.push('/simulation')
      },
      deleteSimulation(simulation) {
        this.$store.commit('workspace/deleteSimulation', simulation)
      },
      exportSimulation(simulation) {
        const data = {
          name: simulation.name,
          description: simulation.description,
          lastUpdate: simulation.lastUpdate,
        }
        const jsonData = JSON.stringify(data)

        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = 'simulation.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },

      modifyAnimalProfile(profile) {
        // Ajoutez ici la logique pour modifier le profil animal
      },
      exportAnimalProfile(profile) {
        // Ajoutez ici la logique pour exporter le profil animal
      },
      modifyStic(stic) {
        // Ajoutez ici la logique pour modifier le stic
      },
      exportStic(stic) {
        // Ajoutez ici la logique pour exporter le stic
      },
      createClassicFeed(feed) {
        console.log('create', feed)
      },
      editFeed(feed) {
        // Ajoutez ici la logique pour modifier le feed
        this.openClassicFeedModal = true
      },
      deleteFeed(feed) {},
      exportFeed(feed) {
        // Ajoutez ici la logique pour exporter le feed
      },
    },
  }
</script>
