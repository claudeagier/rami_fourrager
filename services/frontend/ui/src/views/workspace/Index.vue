<template>
  <v-container
    id="workspace"
    fluid
    tag="section"
  >
    <div>
      <v-btn @click="refresh">{{ $t('btn.refresh_referential') }}</v-btn>
    </div>
    <div>
      <actions />
    </div>
  </v-container>
</template>
<script>
  import Actions from './Actions.vue'

  export default {
    name: 'workspaceView',
    components: {
      Actions,
    },
    created() {
      this.loadReferential(false)
    },
    methods: {
      loadReferential(refresh) {
        this.$store.dispatch('referential/fetchSites', refresh)
        this.$store.dispatch('referential/fetchClimaticYears', refresh)
        this.$store.dispatch('referential/fetchStics', refresh)
        this.$store.dispatch('referential/fetchBatchTypes', refresh)
        this.$store.dispatch('referential/fetchAnimalProfiles', refresh)
        this.$store.dispatch('referential/fetchFeedTypes', refresh)
        this.$store.dispatch('referential/fetchConcentratedFeeds', refresh)
        this.$store.dispatch('referential/fetchHousingTypes', refresh)
      },
      refresh() {
        this.loadReferential(true)
      },
    },
  }
</script>
