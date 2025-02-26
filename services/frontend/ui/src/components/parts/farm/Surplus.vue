<template>
  <div>
    <v-data-table
      :headers="surplus.headers"
      :items="surplus.items"
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
            {{ $t('report.main.modules.work.pasture.surplus.title') }}
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
              class="text-start"
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
        getSurplus: 'getPastureSurplusesByPeriod',
      }),
      surplus() {
        const resp = {
          headers: [],
          items: [],
        }
        const surplusItem = {}
        this.periods.forEach((p, index) => {
          resp.headers.push({ text: this.$t('periods.tab', { id: p.id }), value: p.name, tooltip: p.dates })
          surplusItem[p.name] = this.getSurplus(index)
        })
        if (this.withTotal) {
          const total = Object.values(surplusItem).reduce((acc, curr) => {
            return acc + curr
          }, 0)
          surplusItem['total'] = total
          resp.headers.push({
            text: this.$t('report.main.modules.work.work.headers.total'),
            value: 'total',
            groupable: false,
            width: 80,
          })
        }
        resp.items.push(surplusItem)

        return resp
      },
    },
  }
</script>
