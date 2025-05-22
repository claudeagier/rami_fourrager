<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-data-table
            :items="mappings"
            :headers="headers"
            fixed-header
            :options="dataTableOptions"
          >
            <template v-slot:top>
              <v-toolbar
                color="white"
                flat
              >
                <v-toolbar-title class="text-h4 font-weight-light">
                  {{ $t('workspace.content.datatables.mapping.title') }}
                </v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-spacer></v-spacer>
                <mapping-modal
                  :forceOpen="dialog"
                  :item="newItem"
                  @add-item="saveItem"
                  @cancel-modal="closeModal"
                />
              </v-toolbar>
            </template>
            <template v-slot:item="{ item }">
              <tr :class="item.inUse ? 'primary white--text' : ''">
                <td>
                  {{ item.name }}
                </td>
                <td>
                  <v-icon
                    v-if="!item.protected"
                    @click="deleteItem('mapping', item)"
                    small
                  >
                    mdi-delete
                  </v-icon>
                  <v-icon
                    @click="editItem('mapping', item)"
                    medium
                    color="green"
                  >
                    mdi-square-edit-outline
                  </v-icon>
                  <v-btn
                    @click="onUseMapping(item)"
                    small
                    outlined
                    color="primary"
                  >
                    {{ 'utiliser ce mapping' }}
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="8"> Pour quelle simulation ? </v-col>
              <v-col>
                <v-btn
                  color="primary"
                  outlined
                  @click="exportSelectedSimulations"
                >
                  {{ $t('btn.exportToCSV') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-list
                  flat
                  subheader
                  three-line
                >
                  <v-list-item>
                    <v-list-item-action>
                      <v-checkbox
                        v-model="selectAllSimulations"
                        @change="toggleSelectAll"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Toutes les simulations</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item
                    v-for="(item, index) in workspace.simulations"
                    :key="index"
                  >
                    <v-list-item-action>
                      <v-checkbox
                        :input-value="selectedSimulations.includes(index)"
                        @change="toggleSimulation(index)"
                        :disabled="selectAllSimulations"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <preview-modal
      :forceOpen="previewDialog"
      :rows="previewRows"
      @close-modal="closePreview"
    />
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { deepCopy } from '@/plugins/utils'
  import MappingModal from './MappingModal.vue'
  import PreviewModal from './previewModal.vue'

  export default {
    name: 'export',
    components: {
      MappingModal,
      PreviewModal,
    },
    mounted() {
      this.deactivateAllMapping()
    },
    data() {
      return {
        dialog: false,
        newItem: null,
        oldItem: null,
        selectedSimulations: [],
        selectAllSimulations: false,
        previewDialog: false,
        previewRows: [],
      }
    },
    computed: {
      ...mapGetters('workspace', {
        getWorkspace: 'getWorkspace',
        mappings: 'getMappings',
      }),
      ...mapGetters('workspace/mapper', {
        getterList: 'getList',
        mapper: 'getMapper',
      }),

      workspace() {
        return this.getWorkspace
      },
      headers() {
        return [
          { text: this.$t('workspace.content.datatables.mapping.header.name'), value: 'name', width: 500 },
          {
            text: this.$t('workspace.content.datatables.mapping.header.actions'),
            value: 'actions',
            sortable: false,
          },
        ]
      },
      dataTableOptions() {
        return {
          itemsPerPage: 4,
        }
      },
    },
    methods: {
      ...mapActions('workspace', {
        activateMapping: 'activateMapping',
        deactivateAllMapping: 'deactivateAllMapping',
      }),
      ...mapActions('workspace/mapper', {
        loadMappingAction: 'loadMapping',
        loadSimulationsSelected: 'loadSimulationsSelected',
        prepareExport: 'prepareExport',
      }),

      loadMapper(what, data) {
        if (what === 'mapping' && data) {
          this.loadMappingAction(data).then(() => {
            this.activateMapping(data)
            this.$emit('mapping-loaded', data)
          })
        }
        if (what === 'simulations' && Array.isArray(data)) {
          this.loadSimulationsSelected(data)
        }
      },

      onUseMapping(item) {
        this.loadMapper('mapping', item)
      },

      toggleSelectAll() {
        if (this.selectAllSimulations) {
          this.selectedSimulations = this.workspace.simulations.map((_, idx) => idx)
          this.loadMapper('simulations', this.workspace.simulations)
        } else {
          this.selectedSimulations = []
        }
      },

      toggleSimulation(index) {
        if (this.selectedSimulations.includes(index)) {
          this.selectedSimulations = this.selectedSimulations.filter((i) => i !== index)
        } else {
          this.selectedSimulations.push(index)
        }

        const sims = this.selectedSimulations.map((i) => this.workspace.simulations[i])
        this.loadMapper('simulations', sims)
      },
      exportSelectedSimulations() {
        this.prepareExport().then((rows) => {
          if (rows.length > 0) {
            this.previewRows = rows
            this.previewDialog = true
          } else {
            // this.$toast?.info?.('Aucune donnée à exporter.')
          }
        })
      },
      downLoadCsv(csv) {
        this.previewDialog = false
      },

      closeModal() {
        this.dialog = false
        this.oldItem = null
        this.newItem = null
        this.deactivateAllMapping()
      },
      closePreview() {
        this.previewDialog = false
      },
      saveItem({ dialogName, item }) {
        if (this.oldItem !== null && this.oldItem !== undefined) {
          this.$store.commit('workspace/updateItem', {
            dialog: dialogName,
            newItem: deepCopy(item),
            oldItem: deepCopy(this.oldItem),
          })
        } else {
          this.$store.commit('workspace/addItem', {
            dialog: dialogName,
            newItem: deepCopy(item),
          })
        }
        this.closeModal()
      },

      editItem(dialogName, item) {
        this.oldItem = deepCopy(item)
        this.newItem = deepCopy(item)
        this.dialog = true
      },

      deleteItem(dialogName, item) {
        if (confirm(this.$t('notifications.confirm_delete_item'))) {
          this.$store.commit('workspace/deleteItem', { dialog: dialogName, item: deepCopy(item) })
        }
      },
    },
  }
</script>
