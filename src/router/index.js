import Vue from 'vue'
import Router from 'vue-router'

import MainPage from '@/pages/MainPage/MainPage'
import Friends from '@/pages/Friends/Friends'

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
      path: '/friends',
      name: 'Friends',
      component: Friends
    },
    {
      path: '/:page',
      redirect: '/',
    }
  ]
})

export default router
