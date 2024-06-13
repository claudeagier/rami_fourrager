<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="setDrawer(!show)"
    >
      <v-icon v-if="value"> mdi-view-quilt </v-icon>
      <v-icon v-else> mdi-dots-vertical </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      text="$route.name"
    />
    <breadCrumb />

    <v-spacer />

    <!-- <v-text-field
      :label="$t('search')"
      color="secondary"
      hide-details
      style="max-width: 165px"
    >
      <template
        v-if="$vuetify.breakpoint.mdAndUp"
        v-slot:append-outer
      >
        <v-btn
          class="mt-n2"
          elevation="1"
          fab
          small
        >
          <v-icon> mdi-magnify </v-icon>
        </v-btn>
      </template>
    </v-text-field> -->

    <div class="mx-3" />

    <!-- <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/"
    >
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn> -->

    <!-- <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            color="red"
            overlap
            bordered
          >
            <template v-slot:badge>
              <span>5</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        nav
      >
        <div>
          <app-bar-item
            v-for="(n, i) in notifications"
            :key="`item-${i}`"
          >
            <v-list-item-title text-content="n" />
          </app-bar-item>
        </div>
      </v-list>
    </v-menu> -->

    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/user/profile"
    >
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn
      text
      @click="logout"
    >
      <span>Logout</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
  // Components
  import { VHover, VListItem } from 'vuetify/lib'
  import breadCrumb from './BreadCrumb.vue'

  // Utilities
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'AppCoreAppBar',

    components: {
      breadCrumb,
      // AppBarItem: {
      //   render(h) {
      //     return h(VHover, {
      //       scopedSlots: {
      //         default: ({ hover }) => {
      //           return h(
      //             VListItem,
      //             {
      //               attrs: this.$attrs,
      //               class: {
      //                 'black--text': !hover,
      //                 'white--text secondary elevation-12': hover,
      //               },
      //               props: {
      //                 activeClass: '',
      //                 dark: hover,
      //                 link: true,
      //                 ...this.$attrs,
      //               },
      //             },
      //             this.$slots.default,
      //           )
      //         },
      //       },
      //     })
      //   },
      // },
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      ...mapState('drawer', { show: (state) => state.show }),
    },

    methods: {
      ...mapMutations('drawer', {
        setDrawer: 'SET_DRAWER',
      }),
      logout: function () {
        this.$store.dispatch('auth/logout').then(() => {
          this.$router.push('/login')
        })
      },
    },
  }
</script>
