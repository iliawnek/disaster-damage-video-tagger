import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Browse from '@/pages/Browse'
import Agency from '@/pages/Agency'
import Event from '@/pages/Event'
import Video from '@/pages/Video'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '',
      name: 'home',
      component: Home,
    },
    {
      path: '/browse',
      redirect: '/browse/videos',
      name: 'browse',
      component: Browse,
      children: [
        {
          path: 'videos',
          name: 'videos',
        },
        {
          path: 'events',
          name: 'events',
        },
        {
          path: 'agencies',
          name: 'agencies',
        },
      ],
    },
    {
      path: '/agency/:agencyId',
      name: 'agency',
      component: Agency,
    },
    {
      path: '/event/:eventId',
      name: 'event',
      component: Event,
    },
    {
      path: '/video/:videoId',
      name: 'video',
      component: Video,
    },
  ],
})

// redirect to home if not signed in
router.beforeEach((to, from, next) => {
  const isSignedIn = store.getters['auth/isSignedIn']
  if (to.name !== 'home' && !isSignedIn) {
    next({name: 'home'})
  } else {
    next()
  }
})

export default router
