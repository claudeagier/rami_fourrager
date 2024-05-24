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
        <!-- <div>datatable des simulations du workpsace -->
        <v-tab-item>
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
                  @click="dialogs.simulation = true"
                >
                  {{ $t('workspace.content.datatables.simulations.create.btn') }}
                </v-btn>
                <simulation-modal
                  :dialog.sync="dialogs.simulation"
                  @add-item="saveItem"
                  @cancel-modal="closeModal"
                  :item="newItems.simulation"
                />
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
        <!-- <div>datatable des animalProfiles du workpsace avec un bouton exporter pour exporter la liste -->
        <v-tab-item>
          <!-- <v-data-table
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
                  @click="dialogs.simulation = true"
                >
                  {{ $t('workspace.content.datatables.simulations.create.btn') }}
                </v-btn>
                <v-dialog
                  persistent
                  no-click-animation
                  v-model="dialogs.simulation"
                  max-width="600"
                >
                  <v-card>
                    <v-card-title>{{
                      $t('workspace.content.datatables.simulations.create.dialog.title')
                    }}</v-card-title>
                    <v-form
                      ref="simulationForm"
                      v-model="valid.simulation"
                      @submit.prevent="createSimulation"
                      lazy-validation
                    >
                      <v-card-text>
                        <v-text-field
                          v-model="newItems.simulation.name"
                          label="Nom"
                          :rules="[rules.required]"
                        ></v-text-field>
                        <v-textarea
                          v-model="newItems.simulation.description"
                          label="Description"
                        ></v-textarea>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          outlined
                          color="green"
                          type="submit"
                          :disabled="!valid.simulation"
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
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn @click="modifyAnimalProfile(item)">Modifier</v-btn>
            </template>
          </v-data-table> -->
        </v-tab-item>
        <!-- <div>datatable des stics du workpsace avec un bouton exporter pour exporter la liste -->
        <v-tab-item>
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
                  @click="dialogs.stic = true"
                >
                  {{ $t('workspace.content.datatables.stics.create.btn') }}
                </v-btn>
                <stic-modal
                  :dialog.sync="dialogs.stic"
                  @add-item="saveItem"
                  @cancel-modal="closeModal"
                  :item="newItems.stic"
                />
              </v-toolbar>
            </template>
            <template v-slot:item="{ item }">
              <tr>
                <!-- Apply green color if loaded -->
                <td>
                  {{ getSite(item.climatic_year_id).name }}
                  <!-- Replace with appropriate data -->
                </td>
                <td>
                  {{ getClimaticYearById(item.climatic_year_id).name }}
                  <!-- Replace with appropriate data -->
                </td>
                <td>
                  {{ item.name }}
                  <!-- Replace with appropriate data -->
                </td>
                <td>
                  <!-- <template v-slot:[`item.actions`]="{ item }"> -->
                  <v-icon
                    @click="deleteItem('stic', item)"
                    small
                  >
                    mdi-delete
                  </v-icon>
                  <v-icon
                    @click="editItem('stic', item)"
                    medium
                    color="green"
                    background-color="green"
                  >
                    mdi-square-edit-outline
                  </v-icon>
                  <!-- </template> -->
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-tab-item>
        <!-- <div>datatable des feeds du workpsace avec un bouton exporter pour exporter la liste -->
        <v-tab-item>
          <v-data-table
            :items="workspace.classicFeeds"
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
                  :forceOpen="dialogs.classicFeed"
                  :item="newItems.classicFeed"
                  @add-item="saveItem"
                  @cancel-modal="closeModal"
                />
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                @click="deleteItem('classicFeed', item)"
                small
              >
                mdi-delete
              </v-icon>
              <v-icon
                @click="editItem('classicFeed', item)"
                medium
                color="green"
                background-color="green"
              >
                mdi-square-edit-outline
              </v-icon>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { deepCopy } from '@/plugins/utils'
  import ClassicFeedModal from './ClassicFeedModal.vue'
  import SticModal from './SticModal.vue'
  import SimulationModal from './SimulationModal.vue'

  export default {
    name: 'WorkspaceContent',
    components: { ClassicFeedModal, SticModal, SimulationModal },
    data() {
      return {
        dialogs: {
          simulation: false,
          classicFeed: false,
          stic: false,
        },
        newItems: {
          simulation: null,
          classicFeed: null,
          stic: null,
        },
        oldItems: {
          simulation: null,
          classicFeed: null,
          stic: null,
        },
        valid: {
          simulation: false,
        },
        selectedRows: [],
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
      }
    },
    created() {
      const sim = this.getActivatedSimulation
      if (sim) {
        this.loadSimulation(sim)
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
        getActivatedSimulation: 'getActivatedSimulation',
      }),
      ...mapGetters('referential', {
        getSite: 'getSiteByClimaticYearId',
        getClimaticYearById: 'getClimaticYearById',
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
          { text: this.$t('workspace.content.datatables.stics.header.name'), value: 'name' },
          { text: this.$t('workspace.content.datatables.stics.header.actions'), value: 'actions', sortable: false },
        ]
      },
      feedHeaders() {
        return [
          { text: this.$t('workspace.content.datatables.classicFeeds.header.name'), value: 'name' },
          {
            text: this.$t('workspace.content.datatables.classicFeeds.header.correspondingStock'),
            value: 'correspondingStock',
          },
          {
            text: this.$t('workspace.content.datatables.classicFeeds.header.actions'),
            value: 'actions',
            sortable: false,
          },
        ]
      },
    },
    methods: {
      ...mapActions('workspace', { loadSimulator: 'loadSimulator' }),

      loadSimulation(simulation) {
        this.loadSimulator(simulation)
        this.$toast({
          message: 'notifications.simulation_loaded_success',
          type: 'success',
          timeout: 3000,
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

      closeModal(dialogName) {
        this.dialogs[dialogName] = false
        this.oldItems[dialogName] = null
        this.newItems[dialogName] = null
      },

      // datatables
      saveItem({ dialogName, item }) {
        if (this.oldItems[dialogName] !== null && this.oldItems[dialogName] !== undefined) {
          // Modification
          this.$store.commit('workspace/updateItem', {
            dialog: dialogName,
            newItem: deepCopy(item),
            oldItem: deepCopy(this.oldItems[dialogName]),
          })
        } else {
          // Ajout
          this.$store.commit('workspace/addItem', {
            dialog: dialogName,
            newItem: deepCopy(item),
          })
        }
        this.closeModal(dialogName)
        // this.newItems[dialogName] = null
        // this.oldItems[dialogName] = null
      },

      editItem(dialogName, item) {
        this.oldItems[dialogName] = deepCopy(item)
        this.newItems[dialogName] = deepCopy(item)
        this.dialogs[dialogName] = true
      },

      deleteItem(dialogName, item) {
        this.$store.commit('workspace/deleteItem', { dialog: dialogName, item: item })
      },
    },
  }
</script>
