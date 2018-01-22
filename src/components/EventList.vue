<script>
import {mapState, mapActions} from 'vuex'
import {mapGettersWithParams} from '@/utilities'
import EventCard from '@/components/EventCard'

export default {
  name: 'event-list',

  components: {
    EventCard,
  },

  props: [
    'events',
  ],

  created () {
    this.loadVideos()
  },

  computed: {
    ...mapState({
      videos: (state) => state.video.videos,
      areVideosLoaded: (state) => state.video.areVideosLoaded,
    }),
  },

  methods: {
    ...mapGettersWithParams({
      getImage: 'event/getImage',
    }),
    ...mapActions({
      loadVideos: 'video/loadVideos',
    }),
  },
}
</script>

<template lang="pug">
  .event-list(v-if="areVideosLoaded")
    event-card(v-for="event in events" :key="event['.key']" :event="event" :image="getImage(event)")
</template>

<style scoped lang="sass">
  .event-list
    margin: 16px
</style>


    <!--md-empty-state(-->
    <!--v-if="!doEventsExist && areEventsLoaded"-->
    <!--md-icon="event"-->
    <!--md-label="No events right now"-->
    <!--md-description="As soon as an event occurs, it will appear here."-->
    <!--)-->
      <!--md-button.md-raised.md-primary(@click="openNewEventDialog") Create new event-->
