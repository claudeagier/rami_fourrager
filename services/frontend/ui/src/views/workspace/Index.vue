<template>
  <v-container
    id="workspace"
    fluid
    tag="section"
  >
    <v-row>
      <v-col cols="6">
        <base-material-card color="#F39C12">
          <template v-slot:heading>
            <v-row>
              <v-col cols="10">
                <div class="text-h3 font-weight-light">{{ $t('workspace.referential.title') }}</div>
              </v-col>
            </v-row>
          </template>
          <v-card-text>
            <div v-if="lastConnectionDate">
              {{
                $t('workspace.referential.uptodate', { date: new Date(lastConnectionDate).toLocaleDateString('fr-FR') })
              }}
              <br />
              <br />
              {{ $t('workspace.referential.description') }}
            </div>
            <div v-else>
              {{
                $t('workspace.referential.toUpdate', { date: new Date(lastConnectionDate).toLocaleDateString('fr-FR') })
              }}
              <br />
              <br />
              {{ $t('workspace.referential.description') }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              outlined
              color="#F39C12"
              @click="refresh"
            >
              {{ $t('workspace.referential.btn_refresh') }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-col>
      <v-col>
        <actions />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <base-material-card color="primary">
          <template v-slot:heading>
            <v-row>
              <v-col cols="10">
                <div class="text-h3 font-weight-light">{{ $t('workspace.content.title') }}</div>
              </v-col>
            </v-row>
          </template>
          <v-card-text>
            <workspace-content />
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import { mapState, mapGetters } from 'vuex'
  import Actions from './Actions.vue'
  import WorkspaceContent from './Content.vue'

  export default {
    name: 'workspaceView',
    components: {
      Actions,
      WorkspaceContent,
    },
    created() {
      this.loadReferential(false)
    },
    computed: {
      ...mapState('auth', {
        lastConnectionDate: 'lastConnectionDate',
      }),
      ...mapGetters('workspace', {
        getWorkspace: 'getWorkspace',
      }),
      workspace: {
        get() {
          return this.getWorkspace
        },
      },
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
