import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Browse from '@/pages/Browse'
import BrowseVideos from '@/pages/BrowseVideos'
import BrowseEvents from '@/pages/BrowseEvents'
import BrowseAgencies from '@/pages/BrowseAgencies'
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
          component: BrowseVideos,
        },
        {
          path: 'events',
          name: 'Events',
          component: BrowseEvents,
        },
        {
          path: 'agencies',
          name: 'Agencies',
          component: BrowseAgencies,
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
      path: '/event/:eventId/:videoId',
      name: 'Video',
      component: Video,
    },
  ],
})
