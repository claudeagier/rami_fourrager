<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
  >
    <v-card
      id="settings"
      class="pa-1"
      color="rgba(0, 0, 0, .3)"
      dark
      flat
      link
      min-width="60"
      style="position: fixed; top: -20px; left: -5px; border-radius: 8px"
    >
      <v-btn
        class="mr-3"
        icon
        large
        dark
        @click="setDrawer(!show)"
      >
        <v-icon v-if="show"> mdi-menu-open </v-icon>
        <v-icon v-else> mdi-menu-close </v-icon>
      </v-btn>
    </v-card>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      text="$route.name"
    />
    <v-spacer />
    <breadCrumb />

    <v-spacer />

    <div class="mx-3" />
    <pretty-print />
    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/user/profile"
    >
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <logout />
  </v-app-bar>
</template>

<script>
  // Components
  import Logout from '@/views/auth/Logout.vue'
  import breadCrumb from './BreadCrumb.vue'
  // Utilities
  import { mapState, mapMutations } from 'vuex'
  import PrettyPrint from './PrettyPrint.vue'

  export default {
    name: 'AppCoreAppBar',

    components: {
      breadCrumb,
      Logout,
      PrettyPrint,
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        logoutDialog: false,
      }
    },

    computed: {
      ...mapState('drawer', { show: (state) => state.show }),
    },

    methods: {
      ...mapMutations('drawer', {
        setDrawer: 'SET_DRAWER',
      }),
    },
  }
</script>
