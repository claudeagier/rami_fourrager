<template>
  <v-container
    id="workspace"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
        lg="6"
        class="pt-0 pb-0"
      >
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
              <v-alert
                text
                prominent
                type="warning"
              >
                {{
                  $t('workspace.referential.toUpdate', {
                    date: new Date(lastConnectionDate).toLocaleDateString('fr-FR'),
                  })
                }}
                <br />
                {{ $t('workspace.referential.description') }}
              </v-alert>
            </div>
          </v-card-text>
          <template v-slot:actions>
            <v-spacer></v-spacer>
            <v-btn
              :class="{ 'animate-button': animateReferentialButton }"
              outlined
              color="#F39C12"
              @click="refresh"
            >
              {{ $t('workspace.referential.btn_refresh') }}
            </v-btn>
          </template>
        </base-material-card>
      </v-col>
      <v-col
        cols="12"
        lg="6"
        class="pt-0 pb-0"
      >
        <actions />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        lg="12"
        class="pt-0 pb-0"
      >
        <base-material-card color="primary">
          <template v-slot:heading>
            <v-row>
              <v-col cols="10">
                <div class="text-h4 font-weight-light">{{ $t('workspace.content.title') }}</div>
              </v-col>
            </v-row>
          </template>
          <v-card-text>
            <div v-if="workspace.tag">
              <workspace-content />
            </div>
            <div v-else>
              <v-alert
                text
                prominent
                type="warning"
              >
                <div>pas de workspace</div>
              </v-alert>
              <v-skeleton-loader
                loading-text="PAS DE WORKSPACE"
                max-height="300px"
                class="mt-8"
                type="table"
              ></v-skeleton-loader>
            </div>
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
      if (this.lastConnectionDate !== undefined) {
        this.animateReferentialButton = false
      }
      if (this.lastConnectionDate === null) {
        this.loadReferential(false)
      }
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
    data() {
      return {
        isRefresh: false,
        animateReferentialButton: true,
        animateWorkspaceCreation: true,
      }
    },
    methods: {
      fetch(what, refresh) {
        this.$store
          .dispatch('referential/fetch', { what: what, refresh: refresh })
          .then((res) => {
            if (this.isRefresh) {
              this.$toast({
                message: this.$t('notifications.fetch.success', { itemName: this.$t(what) }),
                type: 'info', // 'info', 'warning', 'error'
                timeout: 300, // optional, defaults to 5000
              })
            }
          })
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
          'site',
          'climatic_year',
          'stic',
          'batch_type',
          'animal_profile',
          'feed_type',
          'concentrated_feed',
          'housing_type',
          'pasture_type',
        ]

        referential.forEach((what) => {
          this.fetch(what, refresh)
        })
        this.$store.commit('auth/setLastConnectionDate')
      },
      refresh() {
        this.isRefresh = true
        this.loadReferential(true)
      },
    },
  }
</script>
<style scoped>
  /* Définissez les animations CSS */
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Appliquez l'animation au bouton lorsque la classe animate-button est activée */
  .animate-button {
    animation: pulse 0.5s ease 3;
  }
</style>
