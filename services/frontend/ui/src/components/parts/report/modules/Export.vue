<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="4">
        <ges />
      </v-col>
      <v-col cols="4">
        <custom />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import Custom from './export/Custom.vue'
  import Ges from './export/Ges.vue'

  export default {
    name: 'export',
    components: {
      Ges,
      Custom,
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
    methods: {},
  }
</script>
