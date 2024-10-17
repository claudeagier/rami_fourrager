<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-data-table
      :headers="headers"
      :items="datas"
      item-key="name"
      group-by="category"
      :disable-sort="true"
      show-group-by
      hide-default-footer
      class="elevation-2"
    >
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
      <template v-slot:group.summary="{ items }">
        <th class="text-h4 font-weight-light">
          Totaux
          <!-- {{ $t('report.main.modules.stockNcost.stockTable.category.' + items[0].category) }} -->
        </th>
        <td>{{ subTotal(items, 'initialStock') }}</td>
        <td>{{ subTotal(items, 'production') }}</td>
        <td>{{ subTotal(items, 'consommation') }}</td>
        <td>{{ subTotal(items, 'finalStock') }}</td>
        <td>{{ subTotal(items, 'final_initialStock') }}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>{{ subTotal(items, 'total') }}</td>
      </template>
      <template v-slot:item.purchaseCost="{ item }">
        <v-text-field
          v-model="item.purchaseCost"
          type="number"
          @input="updateItem(item, 'purchaseCost', $event)"
        ></v-text-field>
      </template>

      <template v-slot:item.sold="{ item }">
        <v-text-field
          v-model="item.sold"
          type="number"
          @input="updateItem(item, 'sold', $event)"
        ></v-text-field>
      </template>

      <template v-slot:item.purchaseSold="{ item }">
        <v-text-field
          v-model="item.purchaseSold"
          type="number"
          @input="updateItem(item, 'purchaseSold', $event)"
        ></v-text-field>
      </template>

      <template v-slot:item.productionCost="{ item }">
        <v-text-field
          v-model="item.productionCost"
          type="number"
          @input="updateItem(item, 'productionCost', $event)"
        ></v-text-field>
      </template>

      <template v-slot:item.total="{ item }">
        {{ (item.total = totalCost(item)) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
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
        // On met à jour la valeur locale
        item[key] = value
        // On émet l'événement vers le parent pour lui transmettre l'objet modifié
        this.$emit('update-stock', { ...item })
      },
      totalCost(stock) {
        const total = 200

        // console.log('stock', stock)
        // pour les patures
        // =F32*N32+J32*K32-L32*M32
        // pour les fourrages
        // =E33*N33+J33*K33-L33*M33
        // pour les cultures
        // =(K42*J42)+(M42*L42)
        // pour la paille
        // =E46*N46+J46*K46-L46*M46
        return total
      },
      subTotal(items, column) {
        return items.reduce((sum, item) => sum + item[column], 0)
      },
    },
    data() {
      return {
        expandedGroups: [],
        headers: [
          { text: 'Name', value: 'name', groupable: false, width: 200 },
          { text: 'Category', value: 'category', align: 'right' },
          { text: 'Stock initial', value: 'initialStock', groupable: false, width: 20 },
          { text: 'Production', value: 'production', groupable: false, width: 20 },
          { text: 'Consommation', value: 'consommation', groupable: false, width: 20 },
          { text: 'Final Stock', value: 'finalStock', groupable: false, width: 20 },
          { text: 'Final-Initial Stock', value: 'final_initialStock', groupable: false, width: 20 },
          { text: 'Purchase', value: 'purchase', groupable: false, width: 20 },
          { text: 'Purchase Cost', value: 'purchaseCost', groupable: false, width: 20 },
          { text: 'Sold', value: 'sold', groupable: false, width: 20 },
          { text: 'Purchase Sold', value: 'purchaseSold', groupable: false, width: 20 },
          { text: 'Production Cost', value: 'productionCost', groupable: false, width: 20 },
          { text: 'Total en Euro', value: 'total', groupable: false, width: 20 },
        ],
      }
    },
  }
</script>
