<template>
  <v-card>
    <v-img
      height="150px"
      src="@/assets/images/logo_cap2er.png"
    />
    <v-card-title class="text-center pa-3">
      <div>
        <h3 class="text-center">{{ "Exporter vers CAP'2ER Niveau 1" }}</h3>
      </div>
    </v-card-title>
    <v-card-actions class="pa-4">
      <v-spacer></v-spacer>
      <test-ges />
    </v-card-actions>
  </v-card>
</template>
<script>
  import TestGes from './TestGes.vue'

  export default {
    name: 'export',
    props: {
      title: {
        type: String,
        default: 'Export',
      },
    },
    components: {
      TestGes,
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
