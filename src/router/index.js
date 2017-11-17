import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Browse from '@/pages/Browse'
import BrowseVideos from '@/pages/BrowseVideos'
import BrowseEvents from '@/pages/BrowseEvents'
import BrowseAgencies from '@/pages/BrowseAgencies'
import Video from '@/pages/Video'
import Event from '@/pages/Event'
import Agency from '@/pages/Agency'

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
          component: BrowseVideos,
        },
        {
          path: 'events',
          component: BrowseEvents,
        },
        {
          path: 'agencies',
          component: BrowseAgencies,
        },
      ],
    },
    {
      path: '/video/:videoId',
      name: 'Video',
      component: Video,
    },
    {
      path: '/event/:eventId',
      name: 'Event',
      component: Event,
    },
    {
      path: '/agency/:agencyId',
      name: 'Agency',
      component: Agency,
    },
  ],
})
