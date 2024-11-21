<template>
  <div>
    <v-btn
      text
      @click="logout"
    >
      {{ $t('btn.logout') }}
    </v-btn>
    <v-dialog
      v-model="logoutDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>{{ $t('confirmation_logout.title') }}</v-card-title>
        <v-card-text>
          {{ $t('confirmation_logout.description') }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="confirmLogout"
          >
            {{ $t('btn.yes') }}
          </v-btn>
          <v-btn
            color="secondary"
            text
            @click="cancel"
          >
            {{ $t('btn.no') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import { EventBus } from '@/plugins/event_bus/eventBus'

  export default {
    name: 'logout',
    data() {
      return {
        logoutDialog: false,
      }
    },

    methods: {
      logout: function () {
        this.logoutDialog = true
      },
      cancel() {
        EventBus.$emit('update-store', {
          key: 'auth/setLogoutCanceled',
          value: true,
        })
        this.logoutDialog = false
        if (this.$router.currentRoute.path !== '/workspace') {
          this.$router.push('/workspace')
        }
      },
      confirmLogout() {
        this.logoutDialog = false
        EventBus.$emit('update-store', {
          key: 'auth/setLogoutCanceled',
          value: true,
        })
        this.$store.dispatch('auth/logout').then(() => {
          this.$router.push('/login')
        })
      },
      handleBeforeUnload(event) {
        event.preventDefault()
        event.returnValue = '' // Nécessaire pour certains navigateurs
        this.logoutDialog = true // Affiche le dialogue
      },
    },
    mounted() {
      window.addEventListener('beforeunload', this.handleBeforeUnload)
    },
    beforeDestroy() {
      window.removeEventListener('beforeunload', this.handleBeforeUnload)
    },
  }
</script>
