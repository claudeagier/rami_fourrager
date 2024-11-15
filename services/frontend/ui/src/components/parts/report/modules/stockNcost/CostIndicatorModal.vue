<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      item-key="id"
      loading="true"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar
          color="white"
          flat
        >
          <v-toolbar-title class="text-h4 font-weight-light">
            {{ $t('report.main.modules.stockNcost.stockTable.costIndicator.modal.title') }}
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer></v-spacer>
          <cost-indicator pageColor="primary" />
        </v-toolbar>
      </template>
    </v-data-table>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="text-h6 mb-0">headline</h3>
          <div>description</div>
        </div>
      </v-card-title>
    </v-card>
  </div>
</template>
<script>
  export default {
    name: 'cost-indicator-modal',
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
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.name'),
            value: 'name',
            groupable: false,
            width: 200,
          },
          {
            text: this.$t('report.main.modules.stockNcost.stockTable.headers.name'),
            value: 'name',
            groupable: false,
            width: 200,
          },
        ],
        items: [],
      }
    },
  }
</script>
