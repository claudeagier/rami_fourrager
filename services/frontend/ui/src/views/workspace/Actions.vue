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
      <!-- v-if="workspace.tag === 'imported' || workspace.tag === 'created'" -->
      <v-btn
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
      async importWorkspace() {
        try {
          let file

          if (window.showOpenFilePicker) {
            // Utilisation de l'API moderne si disponible
            const [fileHandle] = await window.showOpenFilePicker({
              types: [
                {
                  description: 'Fichiers JSON',
                  accept: { 'application/json': ['.json'] },
                },
              ],
              suggestedName: this.fileName || 'workspace.json',
              startIn: 'documents',
            })
            file = await fileHandle.getFile()
          } else {
            // Fallback pour les navigateurs qui ne supportent pas showOpenFilePicker (ex: Firefox)
            file = await this.selectFileFallback()
          }

          if (!file) throw new Error('Aucun fichier sélectionné.')

          const jsonData = await this.readFileAsText(file)
          const workspace = JSON.parse(jsonData)

          let isValid = false
          isValid = await validateJson(workspace, 'workspace')

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
          this.handleFileError(error, 'imported')
        }
      },
      async selectFileFallback() {
        return new Promise((resolve) => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'application/json'
          input.onchange = (event) => {
            resolve(event.target.files[0])
          }
          input.click()
        })
      },
      async exportWorkspace() {
        this.deactivateAllSimulation()

        const data = {
          simulations: this.workspace.simulations,
          stics: this.workspace.stics,
          animalProfiles: this.workspace.animalProfiles,
          classicFeeds: this.workspace.classicFeeds,
        }

        const jsonData = JSON.stringify(data, null, 2) // Beautifier JSON pour la lisibilité

        try {
          if (window.showSaveFilePicker) {
            // Utilisation de l'API moderne si disponible (Chrome, Edge)
            const fileHandle = await window.showSaveFilePicker({
              types: [
                {
                  description: 'Fichiers JSON',
                  accept: { 'application/json': ['.json'] },
                },
              ],
              suggestedName: this.fileName || 'workspace.json',
              startIn: 'documents',
            })

            const writableStream = await fileHandle.createWritable()
            await writableStream.write(jsonData)
            await writableStream.close()
          } else {
            // Fallback pour les navigateurs ne supportant pas showSaveFilePicker (Firefox, Safari)
            this.downloadFileFallback(jsonData, this.fileName || 'workspace.json')
          }

          this.tagWorkspace('exported')

          this.$toast({
            message: this.$t('notifications.workspace.file_exported.successfully'),
            type: 'success',
            timeout: 3000,
          })
        } catch (error) {
          this.handleFileError(error, 'exported')
        }
      },
      downloadFileFallback(content, fileName) {
        const blob = new Blob([content], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        URL.revokeObjectURL(url)
      },
      handleFileError(error, action) {
        if (error.name === 'AbortError') {
          this.$toast({
            message: this.$t(`notifications.workspace.file_${action}.aborted`),
            type: 'warning',
            timeout: 3000,
          })
          return
        }
        if (error instanceof ValidatorResultError) {
          error.errors.forEach((err) => {
            this.$toast({
              message: this.$t(`notifications.workspace.file_${action}.error`, { msg: `${err.stack}` }),
              type: 'error',
              timeout: 5000,
            })
          })
        } else {
          this.$toast({
            message: this.$t(`notifications.workspace.file_${action}.error`, { msg: error.message }),
            type: 'error',
            timeout: 5000,
          })
        }
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
