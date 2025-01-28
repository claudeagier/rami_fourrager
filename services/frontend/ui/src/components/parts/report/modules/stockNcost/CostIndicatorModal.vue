<template>
  <v-container>
    <v-card
      outlined
      elevation="2"
      style="width: 500px"
    >
      <v-card-title>
        {{ $t('report.main.modules.stockNcost.stockTable.costIndicator.modal.title') }}
        <v-spacer></v-spacer>
        <v-btn
          outlined
          color="info"
          @click="exportToCSV"
          class="btn-export"
        >
          {{ $t('btn.exportToCSV') }}
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row justify="center">
          <v-col cols="6">
            <v-card
              outlined
              class="kpi-card--content"
            >
              <v-card-text style="padding-bottom: 0">
                <div class="kpi-value">
                  <span class="text-h3 font-weight-bold kpi-number">{{ round(kpi.totalCost, 0) + ' €' }}</span>
                </div>
              </v-card-text>
              <v-card-subtitle class="text-center kpi-subtitle">
                {{ $t('report.main.modules.stockNcost.stockTable.costIndicator.modal.kpi.totalCost') }}
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card
              outlined
              class="kpi-card--content"
            >
              <v-card-text style="padding-bottom: 0">
                <div class="kpi-value">
                  <span class="text-h3 font-weight-bold kpi-number">{{ round(kpi.concentratedPart, 0) + ' %' }}</span>
                </div>
              </v-card-text>
              <v-card-subtitle class="text-center kpi-subtitle">
                {{ $t('report.main.modules.stockNcost.stockTable.costIndicator.modal.kpi.concentratedPart') }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="formattedItems"
          class="elevation-2"
          dense
          item-value="key"
          :group-by="['category']"
          :disable-sort="true"
          hide-default-footer
          disable-pagination
          fixed-header
        >
          <!-- Affichage des groupes (catégories) -->
          <template v-slot:group.header="{ items, group, isOpen, toggle }">
            <th
              colspan="3"
              style="border-top: thick double grey"
            >
              <v-row>
                <v-col cols="1">
                  <v-btn
                    icon
                    dense
                    dark
                    color="primary"
                    @click="toggle()"
                  >
                    <v-icon dense>
                      {{ isOpen ? 'mdi-arrow-collapse-vertical' : 'mdi-arrow-expand-vertical' }}
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col
                  class="text-h4 font-weight-light"
                  align-self="center"
                >
                  {{ $t('report.main.modules.stockNcost.stockTable.costIndicator.modal.category.' + group) }}
                </v-col>
              </v-row>
            </th>
          </template>
          <!-- Affichage des lignes (clés et valeurs) -->
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.without }}</td>
              <td>{{ item.with }}</td>
              <td>
                {{ $t('report.main.modules.stockNcost.stockTable.costIndicator.modal.unity.' + item.key) }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import _ from 'lodash'

  export default {
    name: 'CostIndicatorModal',
    methods: {
      round(value, digit) {
        return _.round(value, digit)
      },
      exportToCSV() {
        // Ajouter un nouvel en-tête pour la catégorie
        const headers = [
          this.$t('report.main.modules.stockNcost.stockTable.costIndicator.modal.typeOfProduction'), // Type de production
          ...this.headers.map((header) => header.text), // Colonnes existantes
        ].join(';')

        // Construire les lignes du CSV avec la catégorie incluse
        const rows = this.formattedItems.map((item) =>
          [
            this.$t(`report.main.modules.stockNcost.stockTable.costIndicator.modal.category.${item.category}`), // Traduction de la catégorie
            item.without,
            item.with,
            this.$t(`report.main.modules.stockNcost.stockTable.costIndicator.modal.unity.${item.key}`), // Traduction de l'unité
          ].join(';')
        )

        // Combiner les en-têtes et les lignes
        const csvContent = [headers, ...rows].join('\r\n')

        // Créer un Blob pour le contenu CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

        // Créer un lien pour télécharger le fichier CSV
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'cost_indicators.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
    },
    computed: {
      ...mapGetters('simulator/report', {
        pastureStock: 'getPastureStock',
        feedStocks: 'getClassicFeedsStock',
        concentratedStock: 'getConcentratedFeedsStock',
        strawStock: 'getStrawStock',
        getCostIndicators: 'getCostIndicators',
        getKpis: 'getCIKpis',
      }),
      kpi() {
        return this.getKpis(this.groupedStocks)
      },
      groupedStocks() {
        const all = [...this.pastureStock, ...this.feedStocks, ...this.concentratedStock, ...this.strawStock]
        return Object.groupBy(all, ({ category }) => category)
      },
      headers() {
        return [
          { text: this.$t('report.main.modules.stockNcost.stockTable.costIndicator.modal.without'), value: 'without' },
          { text: this.$t('report.main.modules.stockNcost.stockTable.costIndicator.modal.with'), value: 'with' },
          { text: this.$t('report.main.modules.stockNcost.stockTable.costIndicator.modal.key'), value: 'key' },
        ]
      },
      formattedItems() {
        const items = []
        for (const [category, subcategories] of Object.entries(this.getCostIndicators(this.groupedStocks))) {
          // Traiter les valeurs dans "without"
          if (subcategories.without) {
            for (const key of Object.keys(subcategories.without)) {
              items.push({
                category,
                key,
                without: _.round(subcategories.without[key]),
                with: _.round(subcategories.with?.[key]) || '-',
              })
            }
          }
          // Traiter les clés uniquement présentes dans "with"
          if (subcategories.with) {
            for (const key of Object.keys(subcategories.with)) {
              if (!subcategories.without || !(key in subcategories.without)) {
                items.push({
                  category,
                  key,
                  without: '-',
                  with: _.round(subcategories.with[key], 0),
                })
              }
            }
          }
        }
        return items
      },
    },
  }
</script>

<style scoped>
  .kpi-card {
    margin: 20px;
  }
  .kpi-card--content {
    border-radius: 12px;
    background: #f9f9f9;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }
  .kpi-value {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .kpi-number {
    color: #4caf50;
  }
  .kpi-subtitle {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #888;
  }
  .btn-export {
    color: #9e9e9e !important;
  }
</style>
