<template>
  <v-dialog
    v-model="dialog"
    persistent
    fullscreen
  >
    <v-card>
      <v-card-title>
        <span
          v-if="!copyDisabled"
          class="text-h5"
        >
          {{ $t('workspace.content.datatables.stic.create.dialog.create_title') }}
        </span>
        <span
          v-if="copyDisabled"
          class="text-h5"
        >
          {{ $t('workspace.content.datatables.stic.create.dialog.update_title') }}
        </span>
      </v-card-title>
      <v-form
        ref="sticForm"
        @submit.prevent="saveItem"
        v-model="valid"
        lazy-validation
      >
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-sheet
                elevation="2"
                class="pa-6"
              >
                <v-subheader>{{ $t('workspace.content.datatables.stic.create.dialog.subheader.copy') }}</v-subheader>
                <v-row justify="center">
                  <v-col cols="10">
                    <v-select
                      v-model="site"
                      :items="siteList"
                      :label="$t('workspace.content.datatables.stic.create.dialog.site')"
                      item-text="name"
                      item-value="id"
                      clearable
                      @change="handleSiteChange"
                      :disabled="copyDisabled"
                    >
                    </v-select>
                    <v-select
                      v-model="climaticYear"
                      :items="climaticYears"
                      :label="$t('workspace.content.datatables.stic.create.dialog.climatic_year')"
                      item-text="name"
                      item-value="id"
                      clearable
                      @change="handleCYchange"
                      :disabled="copyDisabled"
                    >
                    </v-select>

                    <v-autocomplete
                      v-model="sticToCopy"
                      :items="sticList"
                      :label="$t('workspace.content.datatables.stic.create.dialog.stic_to_copy')"
                      item-text="name"
                      item-value="id"
                      dense
                      filled
                      return-object
                      class="autocomplet-transparent-background"
                      :disabled="copyDisabled"
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row justify="end">
                  <v-btn
                    color="primary"
                    outlined
                    @click="copyStic"
                    :disabled="copyDisabled"
                  >
                    {{ $t('btn.copy') }}
                  </v-btn>
                </v-row>
              </v-sheet>
              <v-divider class="mt-5"></v-divider>
              <v-subheader>{{
                $t('workspace.content.datatables.stic.create.dialog.subheader.pasture_type')
              }}</v-subheader>
              <v-sheet
                elevation="2"
                class="pa-6"
              >
                <!-- select -->
                <v-select
                  v-model="stic.pasture_type"
                  :items="pastureTypeList"
                  :label="$t('workspace.content.datatables.stic.create.dialog.pasture_select')"
                  item-text="name"
                  item-value="id"
                  return-object
                  clearable
                >
                </v-select>
              </v-sheet>
            </v-col>
            <v-col>
              <v-tabs
                centered
                color="primary"
                fixed-tabs
              >
                <v-tab
                  v-for="(tab, tabIndex) in ['infos', 'productions']"
                  :key="tabIndex"
                >
                  {{ $t('workspace.content.datatables.stic.create.dialog.tabs.' + tab) }}
                </v-tab>
                <v-tab-item>
                  <v-sheet
                    elevation="2"
                    class="pa-6"
                  >
                    <v-text-field
                      v-model="stic.name"
                      :label="$t('workspace.content.datatables.stic.create.dialog.name')"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="stic.type"
                      :label="$t('workspace.content.datatables.stic.create.dialog.type')"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="stic.rendement"
                      :label="$t('workspace.content.datatables.stic.create.dialog.rendement')"
                    ></v-text-field>
                    <v-text-field
                      v-model="stic.designation"
                      :label="$t('workspace.content.datatables.stic.create.dialog.designation')"
                    ></v-text-field>
                    <v-text-field
                      v-model="stic.RU"
                      :label="$t('workspace.content.datatables.stic.create.dialog.RU')"
                    ></v-text-field>
                    <v-text-field
                      v-model="stic.IN"
                      :label="$t('workspace.content.datatables.stic.create.dialog.IN')"
                    ></v-text-field>
                    <v-text-field
                      v-model="stic.ITK"
                      :label="$t('workspace.content.datatables.stic.create.dialog.ITK')"
                    ></v-text-field>
                    <v-text-field
                      v-model="stic.detail_ITK"
                      :label="$t('workspace.content.datatables.stic.create.dialog.detail_ITK')"
                    ></v-text-field>
                  </v-sheet>
                </v-tab-item>
                <v-tab-item>
                  <v-sheet elevation="2">
                    <v-data-table
                      :headers="periodHeaders"
                      :items="stic.stic_periods"
                      item-value="id"
                      class="elevation-1"
                      hide-default-footer
                      dense
                      :options="{ itemsPerPage: 13 }"
                    >
                      <template v-slot:[`item.production`]="{ item }">
                        <v-text-field
                          v-model.number="item.production"
                          :label="$t('workspace.content.datatables.stic.create.dialog.production')"
                          hide-details
                          dense
                          single-line
                          :rules="[rules.number]"
                          type="number"
                          min="0"
                          hide-spin-buttons
                        ></v-text-field>
                      </template>
                      <template v-slot:[`item.farming_method`]="{ item }">
                        <v-select
                          v-model="item.farming_method"
                          :items="farmingMethods"
                          :item-text="formatFarmingMethod"
                          item-value="code"
                          :label="$t('workspace.content.datatables.stic.create.dialog.farming_method')"
                          hide-details
                          clearable
                          single-line
                          dense
                        ></v-select>
                      </template>
                    </v-data-table>
                  </v-sheet>
                </v-tab-item>
              </v-tabs>
              <!-- <v-divider class="mt-5"></v-divider> -->
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="cancelModal"
            color="grey"
            text
          >
            {{ $t('btn.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            outlined
            :disabled="!valid"
          >
            {{ $t('btn.save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { deepCopy, transformToAppCode } from '@/plugins/utils'

  export default {
    name: 'SticModal',
    props: {
      item: {
        type: null,
        required: true,
      },
      dialog: Boolean,
    },
    watch: {
      item: {
        immediate: true,
        handler(newValue, oldValue) {
          if (newValue != null) {
            // update
            this.stic = newValue
            this.copyDisabled = true
          } else {
            // create
            this.stic = {
              climatic_year_id: 0,
              code: '',
              name: '',
              type: '',
              rendement: '',
              designation: '',
              RU: '',
              IN: '',
              ITK: '',
              detail_ITK: '',
              stic_periods: Array.from({ length: 13 }, (v, k) => ({
                id: k + 1,
                period_id: k + 1,
                prodcution: 0,
                farming_method: '',
              })),
              pasture_type: {},
            }
            this.copyDisabled = false
          }
        },
      },
    },
    data() {
      return {
        sticList: [],
        climaticYears: [],
        sticToCopy: null,
        copyDisabled: false,
        stic: {},
        periodHeaders: [
          {
            text: this.$t('workspace.content.datatables.stic.create.dialog.period'),
            value: 'period_id',
            align: 'start',
          },
          { text: this.$t('workspace.content.datatables.stic.create.dialog.production'), value: 'production' },
          { text: this.$t('workspace.content.datatables.stic.create.dialog.farming_method'), value: 'farming_method' },
        ],
        valid: true,
        rules: {
          required: (value) => !!value || this.$t('validation.required'),
          number: (value) => (!isNaN(value) && isFinite(value)) || this.$t('validation.number'),
        },
      }
    },
    computed: {
      ...mapGetters('referential', {
        pastureTypeList: 'pastureTypeList',
        getSticList: 'sticList',
        siteList: 'siteList',
        getClimaticYearList: 'climaticYearList',
        farmingMethods: 'farmingMethodList',
        getSite: 'getSiteByClimaticYearId',
        getClimaticYearById: 'getClimaticYearById',
      }),

      site: {
        get() {
          if (this.copyDisabled) {
            const s = this.getSite(this.stic.climatic_year_id)
            this.handleSiteChange(s.id)
            return s
          }
          return {}
        },
        set(val) {},
      },
      climaticYear: {
        get() {
          if (this.copyDisabled) {
            const s = this.getClimaticYearById(this.stic.climatic_year_id)
            return s
          }
          return {}
        },
        set(val) {
          if (val) {
            this.stic.climatic_year_id = val
          }
        },
      },
    },
    methods: {
      formatFarmingMethod(item) {
        return item.code + ' - ' + item.name
      },

      handleSiteChange(id) {
        this.climaticYears = this.getClimaticYearList(id)
      },
      handleCYchange(id) {
        this.stic.climatic_year_id = id
        this.sticList = this.getSticList(id)
      },
      copyStic() {
        this.stic = deepCopy(this.sticToCopy)
      },

      cancelModal() {
        this.clearItem()
        this.$emit('cancel-modal', 'stic')
      },
      clearItem() {
        this.$refs.sticForm.reset()
        this.stic = {}
      },
      saveItem() {
        if (this.$refs.sticForm.validate()) {
          if (this.stic.id) {
            delete this.stic.id
          }
          this.stic.code = transformToAppCode(this.stic.name)
          this.$emit('add-item', { dialogName: 'stic', item: deepCopy(this.stic) })
          this.clearItem()
        } else {
          return false
        }
      },
    },
  }
</script>

<style scoped>
  .v-text-field {
    margin-bottom: 16px;
  }
</style>
