<template>
  <div>
    <v-data-table
      :headers="harvest.headers"
      :items="harvest.items"
      class="elevation-1"
      item-key="id"
      loading="true"
      hide-default-footer
      hide-default-header
    >
      <template v-slot:top>
        <v-toolbar
          color="white"
          flat
        >
          <v-toolbar-title class="text-h4 font-weight-light">
            {{ $t('report.main.modules.work.work.harvest.title') }}
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

      <template v-slot:header="{ props }">
        <thead class="v-data-table-header">
          <tr>
            <th
              v-for="head in props.headers"
              :key="head.text"
            >
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ head.text }}
                  </div>
                </template>
                <span>
                  {{ head.tooltip }}
                </span>
              </v-tooltip>
            </th>
          </tr>
        </thead>
      </template>
    </v-data-table>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      withTotal: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
      ...mapGetters('simulator/farm', {
        getHarvest: 'getReportHarvestByperiod',
      }),
      harvest() {
        const resp = {
          headers: [],
          items: [],
        }
        const harvest = {}
        this.periods.forEach((p, index) => {
          resp.headers.push({ text: this.$t('periods.tab', { id: p.id }), value: p.name, tooltip: p.dates })
          harvest[p.name] = this.getHarvest(p.id)
        })
        if (this.withTotal) {
          const total = Object.values(harvest).reduce((acc, curr) => {
            return acc + curr
          }, 0)
          harvest['total'] = total

          resp.headers.push({
            text: this.$t('report.main.modules.work.work.headers.total'),
            value: 'total',
            groupable: false,
            width: 80,
          })
        }

        resp.items.push(harvest)

        return resp
      },
    },
  }
</script>
