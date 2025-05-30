<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="true"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    mobile-breakpoint="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:prepend>
      <div class="pa-5">
        <v-img
          class="rounded-xl rounded-br-0"
          src="@/assets/images/logoRami.jpg"
        />
      </div>
    </template>

    <!-- <v-divider class="mb-1" />

    <v-list
      dense
      nav
    >
      <v-list-item>
        <v-list-item-avatar
          class="align-self-center"
          color="white"
          contain
        >
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="text-h4" />
        </v-list-item-content>
      </v-list-item>
    </v-list> -->
    <v-divider class="mb-2" />
    <v-list
      expand
      nav
    >
      <div />
      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
        >
          <!--  -->
        </base-item-group>

        <base-item
          v-else
          :key="`item-${i}`"
          :item="item"
        />
      </template>
      <div />
    </v-list>
    <template v-slot:append>
      <div>
        <v-divider></v-divider>
        <div class="text-h4 font-weight-light white--text text-center pa-3">
          {{ 'Avec le soutient de :' }}
        </div>
        <div
          class="text-center"
          style="padding: 0px 55px 30px 55px"
        >
          <v-img
            class="rounded-xl rounded-br-0"
            src="@/assets/images/logo_centrevaldeloire2.png"
          />
        </div>
      </div>
      <!-- <v-row>
        <v-col cols="4">
        </v-col>
        <v-col cols="2">
          <img src="@/assets/images/BlocMarque-INRAE.jpg" />
        </v-col>
      </v-row> -->
    </template>
  </v-navigation-drawer>
</template>

<script>
  // TODO changer les logos
  import { mapState, mapMutations, mapGetters } from 'vuex'

  export default {
    name: 'AppCoreDrawer',

    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },

    data: () => {
      const items = [
        { title: 'Workspace', icon: 'mdi-folder-cog-outline', to: '/workspace' },
        {
          title: 'Simulation',
          icon: 'mdi-head-cog-outline',
          // to: '/',
          group: '/simulation',
          children: [
            { title: 'dashboard.title', to: 'dashboard', icon: 'mdi-view-dashboard' },
            { title: 'barn.title', to: 'barn', icon: 'mdi-silo-outline' },
            { title: 'farm.title', to: 'farm', icon: 'mdi-land-plots' },
            { title: 'herd.title', to: 'herd', icon: 'mdi-cow' },
            { title: 'report.title', to: 'report', icon: 'mdi-chart-box-outline' },
          ],
        },
        {
          icon: 'mdi-account-outline',
          title: 'user.profile.title',
          to: '/user/profile',
        },
        {
          title: 'user.list.title',
          icon: 'mdi-account-multiple-plus-outline',
          to: '/user/list',
        },
      ]
      return {
        items: [],
      }
    },
    created() {
      this.items = this.makeItems()
    },

    computed: {
      ...mapState('drawer', { show: (state) => state.show }),
      ...mapState('auth', { isAuthAdmin: (state) => state.isAdmin }),
      drawer: {
        get() {
          return this.show
        },
        set(val) {
          this.setDrawer(val)
        },
      },
      computedItems() {
        return this.items.map(this.mapItem)
      },
      profile() {
        return {
          avatar: true,
          title: this.$t('avatar'),
        }
      },
    },

    methods: {
      ...mapMutations('drawer', {
        setDrawer: 'SET_DRAWER',
      }),
      mapItem(item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: this.$t(item.title),
        }
      },

      makeItems() {
        const items = [
          { title: 'Workspace', icon: 'mdi-folder-cog-outline', to: '/workspace' },
          {
            title: 'Simulation',
            icon: 'mdi-head-cog-outline',
            // to: '/',
            group: '/simulation',
            children: [
              { title: 'dashboard.title', to: 'dashboard', icon: 'mdi-view-dashboard' },
              { title: 'barn.title', to: 'barn', icon: 'mdi-silo-outline' },
              { title: 'farm.title', to: 'farm', icon: 'mdi-land-plots' },
              { title: 'herd.title', to: 'herd', icon: 'mdi-cow' },
              { title: 'report.title', to: 'report', icon: 'mdi-chart-box-outline' },
            ],
          },
          {
            icon: 'mdi-account-outline',
            title: 'user.profile.title',
            to: '/user/profile',
          },
        ]

        if (this.isAuthAdmin) {
          items.push({
            title: 'user.list.title',
            icon: 'mdi-account-multiple-plus-outline',
            to: '/user/list',
          })
        }
        return items
      },
    },
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
</style>
