import Vue from 'vue'
import Router from 'vue-router'

import MainPage from '@/pages/MainPage'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/save',
      name: 'Save',
      component: MainPage
    },
    {
      path: '/:page',
      redirect: '/',
    }
  ]
})

export default router
