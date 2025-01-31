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
              <tr :class="item.loaded ? 'primary white--text' : ''">
                <!-- Apply green color if loaded -->
                <td>
                  {{ item.name }}
                  <!-- Replace with appropriate data -->
                </td>
                <!-- <td>
                  {{ item.description }}
                  </td> -->
                <td>
                  <v-icon
                    @click="deleteItem('mapping', item)"
                    small
                  >
                    mdi-delete
                  </v-icon>
                  <v-icon
                    @click="editItem('mapping', item)"
                    medium
                    color="green"
                    background-color="green"
                  >
                    mdi-square-edit-outline
                  </v-icon>
                  <v-btn
                    @click="loadMapping(item)"
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
          <!-- choisir la ou les simulations à se servir pour compléter les valeurs du csv -->
          <v-card>
            <v-card-title> pour quel simulation ? </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-list
                    flat
                    subheader
                    three-line
                  >
                    <!-- <v-subheader>General</v-subheader> -->

                    <v-list-item-group
                      multiple
                      active-class=""
                    >
                      <v-list-item>
                        <template v-slot:default="{ active }">
                          <v-list-item-action>
                            <v-checkbox :input-value="active"></v-checkbox>
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-list-item-title>{{ 'Toutes les simulations' }}</v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                      <v-list-item
                        v-for="(item, index) in workspace.simulations"
                        :key="index"
                      >
                        <template v-slot:default="{ active }">
                          <v-list-item-action>
                            <v-checkbox :input-value="active"></v-checkbox>
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                            <v-list-item-subtitle> {{ item.description }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-col>
                <v-col>
                  <v-btn
                    color="primary"
                    outlined
                  >
                    {{ $t('btn.exportToCSV') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { deepCopy } from '@/plugins/utils'
  import MappingModal from './MappingModal.vue'

  export default {
    name: 'export',
    components: {
      MappingModal,
    },
    data() {
      return {
        dialog: false,
        newItem: null,
        oldItem: null,
      }
    },
    computed: {
      ...mapGetters('workspace', {
        getWorkspace: 'getWorkspace',
        getActivatedSimulation: 'getActivatedSimulation',
      }),
      workspace: {
        get() {
          return this.getWorkspace
        },
      },
      mappings() {
        return [
          { name: 'cap2er', json: '', loaded: true },
          { name: 'thèse doctorat', json: '', loaded: false },
          { name: 'revue', json: '', loaded: false },
        ]
      },
      headers() {
        return [
          { text: this.$t('workspace.content.datatables.mapping.header.name'), value: 'name', width: 500 },
          // { text: this.$t('workspace.content.datatables.mapping.header.climatic_year'), value: 'climaticYear' },
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
      ...mapActions('workspace', { loadSimulator: 'loadSimulator' }),

      loadMapping(simulation) {
        // this.$router.push('/simulation')
      },
      deleteSimulation(simulation) {
        if (confirm(this.$t('notifications.confirm_delete_item'))) {
          this.$store.commit('workspace/deleteSimulation', simulation)
          this.$toast({
            message: this.$t('workspace.content.datatables.simulation.delete_success'),
            type: 'success',
            timeout: 3000,
          })
        }
      },
      // exportSimulation(simulation) {
      //   const data = {
      //     name: simulation.name,
      //     description: simulation.description,
      //     lastUpdate: simulation.lastUpdate,
      //   }
      //   const jsonData = JSON.stringify(data)

      //   const blob = new Blob([jsonData], { type: 'application/json' })
      //   const url = URL.createObjectURL(blob)

      //   const a = document.createElement('a')
      //   a.href = url
      //   a.download = 'simulation.json'
      //   document.body.appendChild(a)
      //   a.click()
      //   document.body.removeChild(a)
      //   URL.revokeObjectURL(url)
      // },

      closeModal() {
        this.dialog = false
        this.oldItem = null
        this.newItem = null
      },

      // datatables
      saveItem({ dialogName, item }) {
        if (this.oldItem !== null && this.oldItem !== undefined) {
          // Modification
          this.$store.commit('workspace/updateItem', {
            dialog: dialogName,
            newItem: deepCopy(item),
            oldItem: deepCopy(this.oldItem),
          })
        } else {
          // Ajout
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
