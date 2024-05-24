<template>
  <base-material-card color="#065c4a">
    <template v-slot:heading>
      <v-row>
        <v-col cols="10">
          <div class="text-h3 font-weight-light">{{ $t('workspace.actions.title') }}</div>
        </v-col>
      </v-row>
    </template>
    <v-card-text>
      <!-- création de l'espace de travail dans le state -->
      <div v-if="workspace.tag === undefined">
        {{ $t('workspace.actions.create.content') }}
        <br />
        <br />
        {{ $t('workspace.actions.create.description') }}
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
        {{ $t('workspace.actions.export.content') }}
        <br />
        <br />
        {{ $t('workspace.actions.export.description') }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="workspace.tag === undefined"
        outlined
        color="#065c4a"
        @click="createWorkspace"
      >
        {{ $t('workspace.actions.create.btn') }}
      </v-btn>
      <v-btn
        v-if="workspace.tag === undefined || workspace.tag === 'exported'"
        outlined
        color="#065c4a"
        @click="importWorkspace"
      >
        {{ $t('workspace.actions.import.btn') }}
      </v-btn>
      <v-btn
        v-if="workspace.tag === 'imported' || workspace.tag === 'created'"
        outlined
        color="#065c4a"
        @click="exportWorkspace"
      >
        {{ $t('workspace.actions.export.btn') }}
      </v-btn>
    </v-card-actions>
  </base-material-card>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import workspaceSchema from '@/schemas/workspace'

  export default {
    name: 'Actions',
    data() {
      return {
        showImportModal: false, // Ajout d'une propriété pour contrôler l'affichage de la modal d'importation
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
            message: 'notifications.workspace.file_exported.successfully',
            type: 'success',
            timeout: 3000,
          })
        } catch (error) {
          console.error("Erreur lors de l'exportation du fichier:", error)
          this.$toast({
            message: 'notifications.workspace.file_exported.error',
            type: 'error',
            timeout: 5000,
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
          const reader = new FileReader()

          reader.readAsText(file)
          reader.onload = (e) => {
            const jsonData = e.target.result
            const workspace = JSON.parse(jsonData)
            workspace.lastModifiedDate = file.lastModifiedDate.toLocaleDateString()

            this.refreshWorkspace(workspace)

            this.$toast({
              message: 'notifications.workspace.file_imported.successfully',
              type: 'success',
              timeout: 3000,
            })
          }
        } catch (error) {
          console.error('Error selecting file:', error)
          this.$toast({
            message: 'notifications.workspace.file_imported.error',
            type: 'error',
            timeout: 5000,
          })
        }
      },

      createWorkspace() {
        this.setWorkspace({ ...workspaceSchema })
      },
    },
  }
</script>
