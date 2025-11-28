<template>
  <v-card>
    <v-img
      height="150px"
      src="@/assets/images/partners/logo_cap2er.png"
    />
    <v-card-title class="text-center pa-3">
      <div>
        <h3 class="text-center">{{ "Exporter vers CAP'2ER Niveau 1" }}</h3>
      </div>
    </v-card-title>
    <v-card-actions class="pa-4">
      <v-spacer></v-spacer>
      <v-btn
        outlined
        color="primary"
        @click="configure"
      >
        {{ $t('btn.configure') }}
      </v-btn>
    </v-card-actions>
  </v-card>

  <!-- <div>
      <v-data-table
        :headers="headers"
        :items="items"
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <td>
            <v-edit-dialog
              :return-value.sync="props.item.key"
              lazy
            >
              {{ props.item.key }}
              <v-text-field
                slot="input"
                label="Edit"
                v-model="props.item.key"
                single-line
                counter
                :rules="[max25chars]"
              ></v-text-field>
            </v-edit-dialog>
          </td>
          <td class="text-xs-right">{{ props.item.key }}</td>
          <td class="text-xs-right">{{ props.item.key }}</td>
          <td class="text-xs-right">{{ props.item.key }}</td>
          <td class="text-xs-right">{{ props.item.key }}</td>
          <td class="text-xs-right">
            <v-edit-dialog
              :return-value.sync="props.item.key"
              large
              lazy
              persistent
            >
              <div>{{ props.item.key }}</div>
              <div
                slot="input"
                class="mt-3 title"
              >
                Update Iron
              </div>
              <v-text-field
                slot="input"
                label="Edit"
                v-model="props.item.key"
                single-line
                counter
                autofocus
                :rules="[max25chars]"
              ></v-text-field>
            </v-edit-dialog>
          </td>
        </template>
        <template
          slot="pageText"
          slot-scope="{ pageStart, pageStop }"
        >
          From {{ pageStart }} to {{ pageStop }}
        </template>
      </v-data-table>
    </div> -->
</template>
<script>
  export default {
    name: 'export',
    props: {
      title: {
        type: String,
        default: 'Export',
      },
      image: {
        type: String,
      },
    },
    data() {
      return {
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
        ],
      }
    },
    methods: {
      configure() {},
    },
  }
</script>
