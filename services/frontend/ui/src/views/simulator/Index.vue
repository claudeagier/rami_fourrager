<template>
  <div>
    <v-dialog
      :value="!isLoaded"
      max-width="500"
      persistent
      no-click-animation
      outlined
    >
      <v-card class="text-center">
        <v-card-title class="text-h5"> {{ $t('dashboard.no_simulation_dialog.title') }} </v-card-title>
        <v-card-text class="text-body-1 text-center">
          {{ $t('dashboard.no_simulation_dialog.row1') }} <br />
          {{ $t('dashboard.no_simulation_dialog.for') }} <br />
          {{ $t('dashboard.no_simulation_dialog.row2') }} <br />
          {{ $t('dashboard.no_simulation_dialog.or') }} <br />
          {{ $t('dashboard.no_simulation_dialog.row3') }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="primary"
            outlined
            @click="goToWorkspace"
          >
            {{ $t('dashboard.no_simulation_dialog.btn_workspace') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-if="isLoaded">
      <router-view />
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    computed: {
      ...mapState('simulator', {
        isLoaded: (state) => state.loaded,
      }),
    },
    methods: {
      goToWorkspace() {
        this.$router.push('/workspace')
      },
    },
  }
</script>
