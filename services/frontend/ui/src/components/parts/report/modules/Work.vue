<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        class="pt-0 pb-0"
      >
        <v-card
          outlined
          elevation="2"
          class="mb-1"
          style="height: 100%"
        >
          <v-card-title class="text-h4 font-weight-light">
            {{ $t('report.main.modules.work.work.title') }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row justify="center">
              <v-col cols="5">
                <v-card
                  outlined
                  class="kpi-card--content"
                >
                  <v-card-text>
                    <div class="kpi-value text-center">
                      <span class="text-h3 font-weight-bold kpi-number">{{ kpis.distribution }}</span>
                    </div>
                  </v-card-text>
                  <v-card-subtitle class="text-center kpi-subtitle">
                    {{ $t('report.main.modules.work.work.distribution') }}
                  </v-card-subtitle>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card
                  outlined
                  class="kpi-card--content"
                >
                  <v-card-text>
                    <div class="kpi-value text-center">
                      <span class="text-h3 font-weight-bold kpi-number">{{ kpis.withoutPasture }}</span>
                    </div>
                  </v-card-text>
                  <v-card-subtitle class="text-center kpi-subtitle">
                    {{ $t('report.main.modules.work.work.withoutPasture') }}
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
            <v-data-table
              :headers="housing.headers"
              :items="housing.items"
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
                    {{ $t('report.main.modules.work.work.housing.title') }}
                  </v-toolbar-title>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  />
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
            </v-data-table>
            <!-- recolte -->
            <harvest />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="pt-0 pb-0"
      >
        <v-card
          outlined
          elevation="2"
          class="mb-1"
          style="height: 100%"
        >
          <v-card-title class="text-h4 font-weight-light">{{
            $t('report.main.modules.work.pasture.title')
          }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <surplus />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Harvest from '@/components/parts/farm/Harvest.vue'
  import Surplus from '@/components/parts/farm/Surplus.vue'

  export default {
    components: {
      Harvest,
      Surplus,
    },
    computed: {
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
      ...mapGetters('simulator/herd', {
        getHousing: 'getReportHousingDetailsByPeriod',
        getDistribution: 'getDistribution',
        getWithoutPasture: 'getWithoutPasture',
      }),
      housing() {
        const resp = {
          headers: [],
          items: [],
        }
        const presence = {}
        this.periods.forEach((p, index) => {
          resp.headers.push({ text: this.$t('periods.tab', { id: p.id }), value: p.name })
          presence[p.name] = this.getHousing(index)
        })
        resp.items.push(presence)

        return resp
      },
      kpis() {
        return {
          distribution: this.getDistribution(),
          withoutPasture: this.getWithoutPasture(),
        }
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
    color: #888;
  }
</style>
