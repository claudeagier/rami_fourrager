<template>
  <base-material-card color="#065c4a">
    <template v-slot:heading>
      <v-row>
        <v-col cols="10">
          <div class="text-h4 font-weight-light">{{ $t('workspace.actions.title') }}</div>
        </v-col>
      </v-row>
    </template>
    <v-card-text class="text-body-2">
      <!-- création de l'espace de travail dans le state -->
      <div v-if="workspace.tag === undefined">
        <v-alert
          dense
          text
          prominent
          type="warning"
        >
          {{ $t('workspace.actions.create.content') }}
          <br />
          {{ $t('workspace.actions.create.description') }}
        </v-alert>
      </div>

      <!-- si j'ai un workspace de paramétré dans le state avec un tag exporté -->

      <div v-if="workspace.tag === 'exported'">
        {{ $t('workspace.actions.import.content') }}
        <br />
        <br />
        {{ $t('workspace.actions.import.description') }}
      </div>

      <!-- si un espace de travail dans le state mais qui n'est pas tagué exporté -->
      <div v-if="workspace.tag === 'imported' || workspace.tag === 'created'">
        <v-alert
          dense
          text
          prominent
          type="warning"
        >
          {{ $t('workspace.actions.export.content') }}
          <br />
          <br />
          {{ $t('workspace.actions.export.description') }}
        </v-alert>
      </div>
    </v-card-text>
    <template v-slot:actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="workspace.tag === undefined"
        outlined
        color="#065c4a"
        @click="createWorkspace"
        class="text-h6"
        :class="{ 'animate-button': animateWorkspaceCreation }"
      >
        {{ $t('workspace.actions.create.btn') }}
      </v-btn>
      <!-- v-if="workspace.tag === 'exported'" -->
      <v-btn
        outlined
        color="grey lighten-1"
        @click="importWorkspace"
        class="text-h6"
      >
        {{ $t('workspace.actions.import.btn') }}
      </v-btn>
      <v-btn
        v-if="workspace.tag === 'imported' || workspace.tag === 'created'"
        outlined
        color="primary"
        @click="exportWorkspace"
        class="text-h6"
      >
        {{ $t('workspace.actions.export.btn') }}
      </v-btn>
    </template>
  </base-material-card>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import { validateJson } from '@/plugins/utils'
  import { ValidatorResultError } from 'jsonschema'

  export default {
    name: 'Actions',
    data() {
      return {
        showImportModal: false, // Ajout d'une propriété pour contrôler l'affichage de la modal d'importation
        animateWorkspaceCreation: true,
      }
    },
    computed: {
      ...mapGetters('workspace', {
        getWorkspace: 'getWorkspace',
      }),

      workspace: {
        get() {
          return this.getWorkspace
        },
      },
    },
    created() {
      if (this.workspace.tag) {
        this.animateWorkspaceCreation = false
      }
    },
    methods: {
      ...mapMutations('workspace', {
        setWorkspace: 'setWorkspace',
        refreshWorkspace: 'refreshWorkspace',
        tagWorkspace: 'setTag',
        deactivateAllSimulation: 'deactivateAllSimulation',
      }),

      async exportWorkspace() {
        this.deactivateAllSimulation()

        const data = {
          simulations: this.workspace.simulations,
          stics: this.workspace.stics,
          animalProfiles: this.workspace.animalProfiles,
          classicFeeds: this.workspace.classicFeeds,
        }

        const jsonData = JSON.stringify(data)
        try {
          // Demander à l'utilisateur de choisir un emplacement pour enregistrer le fichier
          const fileHandle = await window.showSaveFilePicker({
            types: [
              {
                description: 'Fichiers JSON',
                accept: {
                  'application/json': ['.json'],
                },
              },
            ],
            suggestedName: this.fileName || 'workspace.json',
            startIn: 'documents',
          })

          // Obtenir un objet FileSystemWritableFileStream pour écrire des données dans le fichier
          const writableStream = await fileHandle.createWritable()

          // Écrire les données JSON dans le fichier
          await writableStream.write(jsonData)

          // Fermer le flux d'écriture
          await writableStream.close()

          this.tagWorkspace('exported')
          // Afficher une notification de réussite
          this.$toast({
            message: this.$t('notifications.workspace.file_exported.successfully'),
            type: 'success',
            timeout: 300,
          })
        } catch (error) {
          console.error("Erreur lors de l'exportation du fichier:", error)
          this.$toast({
            message: this.$t('notifications.workspace.file_exported.error'),
            type: 'error',
            timeout: 500,
          })
        }
      },
      async importWorkspace() {
        try {
          const [fileHandle] = await window.showOpenFilePicker({
            types: [
              {
                description: 'Fichiers JSON',
                accept: {
                  'application/json': ['.json'],
                },
              },
            ],
            suggestedName: this.fileName || 'workspace.json',
            startIn: 'documents',
          })

          const file = await fileHandle.getFile()

          const jsonData = await this.readFileAsText(file)
          const workspace = JSON.parse(jsonData)
          var isValid = false
          try {
            isValid = await validateJson(workspace, 'workspace')
          } catch (error) {
            console.error('Validation error:', error)
            throw error
          }
          if (isValid) {
            workspace.lastModifiedDate = new Date(file.lastModified).toLocaleDateString()
            await this.refreshWorkspace(workspace)
            this.$toast({
              message: this.$t('notifications.workspace.file_imported.successfully'),
              type: 'success',
              timeout: 3000,
            })
          }
        } catch (error) {
          if (error instanceof ValidatorResultError) {
            error.errors.forEach((err) => {
              this.$toast({
                message: this.$t('notifications.workspace.file_imported.error', {
                  msg: `${err.stack}`,
                }),
                type: 'error',
                timeout: 5000,
              })
            })
          } else {
            console.error('Error selecting file:', error)
            this.$toast({
              message: this.$t('notifications.workspace.file_imported.error', { msg: error.message }),
              type: 'error',
              timeout: 5000,
            })
          }
        }
      },
      readFileAsText(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsText(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = (error) => reject(error)
        })
      },

      createWorkspace() {
        this.setWorkspace({
          tag: 'created',
          simulations: [],
          stics: [],
          animalProfiles: [],
          classicFeeds: [],
        })
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
