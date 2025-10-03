<template>
  <v-container>
    <slot name="graph" />
    <v-tabs
      centered
      :color="pageColor"
    >
      <v-tab
        v-for="(period, index) in periods"
        :key="index"
        @click="$emit('selected', index)"
        class="period-tab"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-bind="attrs"
              v-on="on"
            >
              {{ $t('periods.tab', { id: period.id }) }}
            </div>
          </template>
          <span>
            {{ period.dates }}
          </span>
        </v-tooltip>
      </v-tab>
      <v-tab-item
        v-for="(period, index) in periods"
        :key="index"
      >
        <v-toolbar
          color="white"
          flat
        >
          <v-toolbar-title> {{ $t(toolBarTitleKey, { id: period.id }) }} </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <base-duplicate-modal
            :ids="periods"
            :sourceItem="period"
            @duplicate="duplicate"
          />
          <v-btn
            :color="pageColor"
            @click="$emit('add-modal')"
            outlined
          >
            {{ $t('btn.add') }}
          </v-btn>
        </v-toolbar>
        <slot name="tab-item" />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Periodlayout',
    props: {
      pageColor: { type: String },
      toolBarTitleKey: {
        type: String,
      },
    },
    computed: {
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
    },
    methods: {
      duplicate({ source, targets }) {
        this.$emit('duplicate', { source: source, targets: targets })
      },
    },
  }
</script>
<style>
  .period-tab {
    min-width: 0.1vh;
  }
</style>
