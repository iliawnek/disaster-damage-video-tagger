import Vue from 'vue'
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

export default router
