<template>
  <v-container
    id="workspace"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
        lg="3"
        class="pt-0 pb-0"
      >
        <!-- referential -->
        <base-material-card color="#F39C12">
          <template v-slot:heading>
            <v-row>
              <v-col
                cols="12"
                lg="10"
              >
                <div class="text-h4 font-weight-light">{{ $t('workspace.referential.title') }}</div>
              </v-col>
            </v-row>
          </template>
          <v-card-text class="text-body-2">
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
              class="text-h6"
            >
              {{ $t('workspace.referential.btn_refresh') }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
        <actions />
      </v-col>
      <v-col
        cols="12"
        lg="9"
        class="pt-0 pb-0"
      >
        <base-material-card
          color="primary"
          min-height="38em"
        >
          <template v-slot:heading>
            <v-row>
              <v-col cols="10">
                <div class="text-h4 font-weight-light">{{ $t('workspace.content.title') }}</div>
              </v-col>
            </v-row>
          </template>
          <v-card-text>
            <workspace-content />
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        lg="12"
        class="pt-0 pb-0"
      >
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
      fetch(what, refresh) {
        const url = 'referential/fetch' + what
        this.$store
          .dispatch(url, refresh)
          .then(
            this.$toast({
              message: this.$t('notifications.fetch.success', { itemName: this.$t(what) }),
              type: 'info', // 'info', 'warning', 'error'
              timeout: 300, // optional, defaults to 5000
            })
          )
          .catch((err) => {
            console.error(err)
            this.$toast({
              message: this.$t('notifications.fetch.error', { itemName: what }),
              type: 'error', // 'info', 'warning', 'error'
              icon: 'mdi-check-circle', // any Vuetify icon
              timeout: 5000, // optional, defaults to 5000
            })
          })
      },
      loadReferential(refresh) {
        const referential = [
          'Sites',
          'ClimaticYears',
          'Stics',
          'BatchTypes',
          'AnimalProfiles',
          'FeedTypes',
          'ConcentratedFeeds',
          'HousingTypes',
          'PastureTypes',
        ]

        referential.forEach((what) => {
          this.fetch(what, refresh)
        })
      },
      refresh() {
        this.loadReferential(true)
      },
    },
  }
</script>
