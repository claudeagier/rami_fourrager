<template>
  <v-container>
    <v-btn
      color="primary"
      @click="dialog = true"
    >
      Afficher les données
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="800px"
    >
      <v-card>
        <v-card-title>Données Exportées</v-card-title>
        <v-card-text>
          <div
            v-for="(bloc, blocName) in filteredBlocks"
            :key="blocName"
          >
            <v-card class="mb-5">
              <v-card-title>{{ bloc.label }}</v-card-title>
              <v-data-table
                :headers="headers"
                :items="Object.values(bloc.content)"
                :disable-sort="true"
                hide-default-footer
                class="elevation-2"
                fixed-header
              >
                <template v-slot:item.value="{ item }">
                  <v-text-field
                    v-if="typeof item.value === 'string'"
                    v-model="item.value"
                    dense
                  ></v-text-field>
                  <v-text-field
                    v-else-if="typeof item.value === 'number'"
                    v-model.number="item.value"
                    type="number"
                    dense
                  ></v-text-field>
                  <v-text-field
                    v-else-if="typeof item.value === 'object'"
                    v-model="item.value.quantity"
                    dense
                  >
                    <template v-slot:append>
                      {{ item.value.unity }}
                    </template>
                  </v-text-field>
                </template>
              </v-data-table>
            </v-card>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            @click="dialog = false"
          >
            Fermer
          </v-btn>
          <v-btn
            color="primary"
            @click="exportCSV"
          >
            Exporter CSV
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { exportGesBV } from './ges.js'

  export default {
    data() {
      return {
        headers: [
          { text: 'Champ', value: 'label', width: 500 },
          { text: 'Valeur', value: 'value' },
        ],
        exportGesBV,
        dialog: false,
      }
    },
    computed: {
      filteredBlocks() {
        const filteredExportGesBV = {}

        Object.keys(this.exportGesBV).forEach((blockKey) => {
          const block = this.exportGesBV[blockKey]
          const filteredContent = {}

          // Filtrer les entrées "unknown" dans le bloc
          Object.keys(block.content).forEach((contentKey) => {
            if (contentKey !== 'unknown') {
              filteredContent[contentKey] = block.content[contentKey]
            }
          })

          filteredExportGesBV[blockKey] = {
            label: block.label,
            content: filteredContent,
          }
        })

        return filteredExportGesBV
      },
    },
    methods: {
      exportCSV() {
        let csvContent = 'data:text/csv;charset=utf-8,'

        // Générer les entêtes (les keys de "content")
        const headers = []
        Object.entries(this.exportGesBV).forEach(([blocName, bloc]) => {
          Object.keys(bloc.content).forEach((contentKey) => {
            if (contentKey !== 'unknown' && !headers.includes(contentKey)) {
              headers.push(contentKey)
            }
          })
        })

        csvContent += `${headers.join(';')}\n`

        // Remplir les lignes avec les valeurs
        const rows = []
        const maxRows = Math.max(...Object.values(this.exportGesBV).map((bloc) => Object.keys(bloc.content).length))

        // Pour chaque ligne, récupérer les valeurs correspondantes aux contentKeys
        for (let i = 0; i < maxRows; i++) {
          const row = []
          Object.entries(this.exportGesBV).forEach(([blocName, bloc]) => {
            const blocContentKeys = Object.keys(bloc.content)
            const currentContentKey = blocContentKeys[i]

            if (currentContentKey) {
              const value = bloc.content[currentContentKey]
              // Vérifier que la valeur est définie avant de l'ajouter
              const val =
                value !== undefined && value !== null
                  ? typeof value === 'object'
                    ? `${value.quantity} ${value.unity}` // pour les objets
                    : value
                  : '' // Si la valeur est undefined ou null, ajouter une cellule vide
              row.push(val)
            } else {
              row.push('') // Si la ligne n'a pas de donnée pour ce contentKey, on ajoute une cellule vide
            }
          })
          rows.push(row)
        }

        // Ajouter les lignes au contenu CSV
        rows.forEach((row) => {
          csvContent += `${row.join(';')}\n`
        })

        // Créer un Blob et générer un URL pour le téléchargement
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

        // Créer un lien de téléchargement
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'export.csv')

        // Simuler un clic sur le lien pour démarrer le téléchargement
        link.click()

        // Révoquer l'URL après le téléchargement
        URL.revokeObjectURL(url)
      },
    },
  }
</script>

<style scoped></style>
