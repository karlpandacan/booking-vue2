import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
/** Home(Login) Import */
import Home from './views/Home.vue'
import Account from './views/Account.vue'
import Register from './views/Register.vue'
import Booking from './views/Booking.vue'

/** Common Imports End Here */
Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: false, title: 'Home' },
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      meta: { requiresAuth: false, title: 'Register' },
      component: Register
    },
    {
      path: '/bookings',
      name: 'bookings',
      meta: { requiresAuth: false, title: 'Bookings' },
      component: Booking
    },
    {
      path: '/my-account',
      name: 'account',
      meta: { requiresAuth: true, title: 'My Account' },
      component: Account
    },
    {
      path: "/unauthorized",
      name: 'unauthorized',
      meta: { requiresAuth: false, title: 'Unauthorized (401)' },
      component: () => import('./views/Unauthorized.vue')
    },
    {
      path: "/*",
      name: 'pagenotfound',
      meta: { requiresAuth: false, title: 'Page Not Found (404)' },
      component: () => import('./views/PageNotFound.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      store.dispatch('checkSession').then(() => {
        document.title = process.env.VUE_APP_TITLE + ' - ' + to.meta.title
        next()
      }).catch(() => {
        store.dispatch('logout');
        next('/')
      })
      return
    }
    next('/')
  } else {
    document.title = (process.env.VUE_APP_TITLE + ' - ' + to.meta.title)
    next()
  }
})

export default router
