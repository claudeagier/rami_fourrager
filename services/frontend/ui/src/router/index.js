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
  {
    path: '/',
    component: () => import('@/views/Index'),
    children: [
      // Dashboard
      {
        name: 'Dashboard',
        path: '',
        component: () => import('@/views/simulator/Dashboard'),
        meta: {
          breadCrumb(route) {
            // const paramToPageB = route.params.paramToPageB;
            return [
              {
                text: 'Simulator',
                to: { name: 'Dashboard' },
              },
            ]
          },
        },
      },
      // Tables
      {
        name: 'Users',
        path: 'user/list',
        component: () => import('@/views/user/List'),
        meta: {
          breadCrumb(route) {
            // const paramToPageB = route.params.paramToPageB;
            return [
              {
                text: 'Users',
                to: { name: 'Users' },
              },
            ]
          },
        },
      },
      {
        name: 'User Profile',
        path: 'user/profile',
        component: () => import('@/views/user/Profile'),
      },
      // // Maps
      // {
      //   name: 'Google Maps',
      //   path: 'maps/google-maps',
      //   component: () => import('@/views/simulator/maps/GoogleMaps'),
      // },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: Home,
  // },
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
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.token || localStorage.getItem('token') === 'null') {
      next({
        path: '/login',
        params: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
