import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Me from '@/pages/Me'
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
      path: '/me',
      name: 'Me',
      component: Me,
    },
    {
      path: '/browse',
      name: 'Browse',
      component: Browse,
    },
    {
      path: '/:agencyId',
      name: 'Agency',
      component: Agency,
    },
    {
      path: '/:agencyId/:eventId',
      name: 'Event',
      component: Event,
    },
    {
      path: '/:agencyId/:eventId/:videoId',
      name: 'Video',
      component: Video,
    },
  ],
})
