import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Browse from '@/pages/Browse'
import Agency from '@/pages/Agency'
import Event from '@/pages/Event'
import Video from '@/pages/Video'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'Home',
      component: Home,
    },
    {
      path: '/browse',
      redirect: '/browse/videos',
      name: 'Browse',
      component: Browse,
      children: [
        {
          path: 'videos',
          name: 'Videos',
        },
        {
          path: 'events',
          name: 'Events',
        },
        {
          path: 'agencies',
          name: 'Agencies',
        },
      ],
    },
    {
      path: '/agency/:agencyId',
      name: 'Agency',
      component: Agency,
    },
    {
      path: '/event/:eventId',
      name: 'Event',
      component: Event,
    },
    {
      path: '/video/:videoId',
      name: 'Video',
      component: Video,
    },
  ],
})
