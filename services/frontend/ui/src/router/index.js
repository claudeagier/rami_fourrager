import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../views/Auth/Login'
import Register from '../views/Auth/Register'
// import Dashboard from '../views/Dashboard'
// import UserList from '../views/Users/UserList'
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
  // {
  //   path: '/',
  //   name: 'Dashboard',
  //   component: Dashboard,
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },
  {
    path: '/',
    component: () => import('@/views/dashboard/Index'),
    children: [
      // Dashboard
      {
        name: 'Dashboard',
        path: '',
        component: () => import('@/views/dashboard/Dashboard'),
      },
      // Pages
      {
        name: 'User Profile',
        path: 'pages/user',
        component: () => import('@/views/dashboard/pages/UserProfile'),
      },
      {
        name: 'Notifications',
        path: 'components/notifications',
        component: () => import('@/views/dashboard/component/Notifications'),
      },
      {
        name: 'Icons',
        path: 'components/icons',
        component: () => import('@/views/dashboard/component/Icons'),
      },
      {
        name: 'Typography',
        path: 'components/typography',
        component: () => import('@/views/dashboard/component/Typography'),
      },
      // Tables
      {
        name: 'Users',
        path: 'user/list',
        component: () => import('@/views/user/List'),
      },
      // Maps
      {
        name: 'Google Maps',
        path: 'maps/google-maps',
        component: () => import('@/views/dashboard/maps/GoogleMaps'),
      },
      // Upgrade
      {
        name: 'Upgrade',
        path: 'upgrade',
        component: () => import('@/views/dashboard/Upgrade'),
      },
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
