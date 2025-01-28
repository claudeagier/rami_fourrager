<template>
  <v-card
    outlined
    elevation="2"
  >
    <v-data-table
      :headers="headers"
      :items="datas"
      item-key="name"
      group-by="category"
      :disable-sort="true"
      show-group-by
      hide-default-footer
      class="elevation-2"
      fixed-header
    >
      <template v-slot:top>
        <v-toolbar
          color="white"
          flat
        >
          <v-toolbar-title class="text-h4 font-weight-light"> {{ title }} </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer></v-spacer>

          <cost-indicator pageColor="primary" />
          <v-btn
            outlined
            color="grey"
            @click="exportToCSV"
            class="ml-1"
          >
            {{ $t('btn.exportToCSV') }}
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:group.header="{ items, group, isOpen, toggle }">
        <th
          colspan="12"
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
              {{ $t('report.main.modules.stockNcost.stockTable.category.' + items[0].category) }}
            </v-col>
          </v-row>
        </th>
      </template>

      <template v-slot:item.initialStock="{ item }"> {{ round(item.initialStock, 0) }}</template>
      <template v-slot:item.production="{ item }"> {{ round(item.production, 0) }}</template>
      <template v-slot:item.consommation="{ item }"> {{ round(item.consommation, 0) }}</template>
      <template v-slot:item.finalStock="{ item }"> {{ round(item.finalStock, 0) }}</template>
      <template v-slot:item.final_initialStock="{ item }"> {{ round(item.final_initialStock, 0) }}</template>
      <template v-slot:item.purchase="{ item }"> {{ round(item.purchase, 0) }}</template>
      <template v-slot:item.purchaseCost="{ item }">
        <v-text-field
          v-model.number="item.purchaseCost"
          type="number"
          hide-spin-buttons
          min="0"
          hide-details
          dense
          single-line
          @change="updateItem(item, 'purchaseCost', $event)"
        ></v-text-field>
      </template>
      <template v-slot:item.sale="{ item }">
        <v-text-field
          v-model.number="item.sale"
          type="number"
          min="0"
          hide-spin-buttons
          hide-details
          dense
          single-line
          @change="updateItem(item, 'sale', $event)"
        ></v-text-field>
      </template>
      <template v-slot:item.costOfSell="{ item }">
        <v-text-field
          v-model.number="item.costOfSell"
          type="number"
          min="0"
          hide-spin-buttons
          hide-details
          dense
          single-line
          @change="updateItem(item, 'costOfSell', $event)"
        ></v-text-field>
      </template>
      <template v-slot:item.productionCost="{ item }">
        <v-text-field
          v-model.number="item.productionCost"
          type="number"
          min="0"
          hide-spin-buttons
          hide-details
          dense
          single-line
          @change="updateItem(item, 'productionCost', $event)"
        ></v-text-field>
      </template>
      <template v-slot:item.total="{ item }">
        {{ (item.total = round(totalCost(item), 0)) }}
      </template>

      <template v-slot:group.summary="{ items }">
        <th class="text-h4 font-weight-light">Totaux</th>
        <td>{{ round(subTotal(items, 'initialStock'), 0) }}</td>
        <td>{{ round(subTotal(items, 'production'), 0) }}</td>
        <td>{{ round(subTotal(items, 'consommation'), 0) }}</td>
        <td>{{ round(subTotal(items, 'finalStock'), 0) }}</td>
        <td>{{ round(subTotal(items, 'final_initialStock'), 0) }}</td>
        <td>{{ round(subTotal(items, 'purchase'), 0) }}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>{{ round(subTotal(items, 'total'), 0) }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import _ from 'lodash'
  import CostIndicator from '@components/parts/report/modules/stockNcost/costIndicator'

  export default {
    name: 'stock-table',
    components: {
      CostIndicator,
    },
    props: {
      title: {
        type: String,
        required: true,
      },
      datas: {
        type: Array,
        required: true,
      },
    },
    methods: {
      updateItem(item, key, value) {
        item[key] = value
        this.$emit('update-stock', { code: item.code, key: key, value: value })
      },
      round(value, digit) {
        return _.round(value, digit)
      },
      totalCost(stock) {
        let total = 0
        if (stock.category === '1_fourrage' && stock.code === 'P') {
          total =
            stock.consommation * stock.productionCost +
            stock.purchase * stock.purchaseCost -
            stock.sale * stock.costOfSell
        }
        if (stock.category === '3_straw' || (stock.category === '1_fourrage' && stock.code !== 'P')) {
          total =
            stock.production * stock.productionCost +
            stock.purchase * stock.purchaseCost -
            stock.sale * stock.costOfSell
        }
        if (stock.category === '2_concentrated') {
          total = stock.purchase * stock.purchaseCost + stock.sale * stock.costOfSell
        }
        return total
      },
      subTotal(items, column) {
        return items.reduce((sum, item) => sum + item[column], 0)
      },

      exportToCSV() {
        // Récupérer les en-têtes visibles
        const headers = this.headers.map((header) => header.text)

        // Récupérer les données à exporter
        const rows = this.datas.map((item) => this.headers.map((header) => item[header.value] || ''))

        // Générer le contenu CSV
        const csvContent = [headers, ...rows].map((row) => row.map((value) => `"${value}"`).join(';')).join('\r\n')

        // Créer et télécharger le fichier CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'export.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
    },
    data() {
      return {
        expandedGroups: [],
        headers: [
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.name'),
            value: 'name',
            groupable: false,
            width: 200,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.initialStock'),
            value: 'initialStock',
            groupable: false,
            width: 20,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.production'),
            value: 'production',
            groupable: false,
            width: 20,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.consommation'),
            value: 'consommation',
            groupable: false,
            width: 20,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.finalStock'),
            value: 'finalStock',
            groupable: false,
            width: 20,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.final_initialStock'),
            value: 'final_initialStock',
            groupable: false,
            width: 20,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.purchase'),
            value: 'purchase',
            groupable: false,
            width: 80,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.purchaseCost'),
            value: 'purchaseCost',
            groupable: false,
            width: 80,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.sale'),
            value: 'sale',
            groupable: false,
            width: 80,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.costOfSell'),
            value: 'costOfSell',
            groupable: false,
            width: 80,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.productionCost'),
            value: 'productionCost',
            groupable: false,
            width: 80,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.total'),
            value: 'total',
            groupable: false,
            width: 80,
          },
        ],
      }
    },
  }
</script>
