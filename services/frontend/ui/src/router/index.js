import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/auth/Login'
import Register from '../views/auth/Register'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  { path: '/', redirect: '/workspace' },
  {
    path: '/',
    component: () => import('@/views/Index'),
    children: [
      // Workspace
      {
        name: 'workspace',
        path: 'workspace',
        component: () => import('@/views/workspace/Index'),
        meta: {
          breadCrumb(route) {
            // const paramToPageB = route.params.paramToPageB;
            return [
              {
                text: 'breadcrumb.workspace',
                to: { name: 'workspace' },
              },
            ]
          },
        },
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/',
    component: () => import('@/views/Index'),
    children: [
      // Dashboard
      {
        name: 'simulation',
        path: 'simulation',
        component: () => import('@/views/simulator/Index'),
        children: [
          {
            name: 'dashboard',
            path: 'dashboard',
            component: () => import('@/views/simulator/Dashboard'),
            meta: {
              breadCrumb(route) {
                // const paramToPageB = route.params.paramToPageB;
                return [
                  {
                    text: 'breadcrumb.simulation',
                    to: { name: 'simulation' },
                  },
                ]
              },
            },
          },
          {
            name: 'barn',
            path: 'barn',
            component: () => import('@/views/simulator/barn/Main'),
            meta: {
              breadCrumb(route) {
                // const paramToPageB = route.params.paramToPageB;
                return [
                  {
                    text: 'breadcrumb.simulation',
                    to: { name: 'simulation' },
                  },
                  {
                    text: 'breadcrumb.farm',
                    to: { name: 'barn' },
                  },
                ]
              },
            },
          },
          {
            name: 'farm',
            path: 'farm',
            component: () => import('@/views/simulator/farm/Main'),
            meta: {
              breadCrumb(route) {
                // const paramToPageB = route.params.paramToPageB;
                return [
                  {
                    text: 'breadcrumb.simulation',
                    to: { name: 'simulation' },
                  },
                  {
                    text: 'breadcrumb.farm',
                    to: { name: 'farm' },
                  },
                ]
              },
            },
          },
          {
            name: 'herd',
            path: 'herd',
            component: () => import('@/views/simulator/herd/Main'),
            meta: {
              breadCrumb(route) {
                // const paramToPageB = route.params.paramToPageB;
                return [
                  {
                    text: 'breadcrumb.simulation',
                    to: { name: 'simulation' },
                  },
                  {
                    text: 'breadcrumb.herd',
                    to: { name: 'herd' },
                  },
                ]
              },
            },
          },
        ],
      },

      // Tables
      {
        name: 'users',
        path: 'user/list',
        component: () => import('@/views/user/List'),
        meta: {
          breadCrumb(route) {
            // const paramToPageB = route.params.paramToPageB;
            return [
              {
                text: 'breadcrumb.users',
                to: { name: 'users' },
              },
            ]
          },
          isAdmin: true,
        },
      },

      {
        name: 'userProfile',
        path: 'user/profile',
        component: () => import('@/views/user/Profile'),
        meta: {
          breadCrumb(route) {
            // const paramToPageB = route.params.paramToPageB;
            return [
              {
                text: 'breadcrumb.users',
                to: { name: 'users' },
              },
              {
                text: 'breadcrumb.profile',
                to: { name: 'userProfile' },
              },
            ]
          },
        },
      },
      // // Maps
      // {
      //   name: 'notifications',
      //   path: '/notifications',
      //   component: () => import('@/components/examples/Notifications'),
      // },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
  // {
  //   path: '/list-user-data',
  //   name: 'Users List',
  //   component: UserList,
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// TODO-FRONT ajouter la gestion des roles pour admin
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters['auth/isLoggedIn'] || localStorage.getItem('token') === 'null') {
      await store.restored
      next({
        path: '/login',
        params: { redirect: to.fullPath },
      })
    } else {
      if (to.matched.some((record) => record.meta.isAdmin)) {
        // Check if the user is an admin
        if (store.getters['auth/isAdmin']) {
          next()
        } else {
          next({ name: 'workspace' }) // Redirect to a non-admin page or show an error
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
