<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import {mapGettersWithParams} from '@/utilities'
import VideoCard from '@/components/VideoCard'

export default {
  name: 'video-list',

  components: {
    VideoCard,
  },

  props: [
    'videos',
    'showEvents',
  ],

  created () {
    if (this.showEvents) this.loadEvents()
  },

  computed: {
    ...mapState({
      areVideosLoaded: (state) => state.video.areVideosLoaded,
    }),
    doVideosExist () {
      return this.videos && this.videos.length > 0
    },
  },

  methods: {
    ...mapGettersWithParams({
      getEventById: 'event/getEventById',
    }),
    ...mapMutations({
      openNewVideoDialog: 'ui/openNewVideoDialog',
    }),
    ...mapActions({
      loadEvents: 'event/loadEvents',
    }),
  },
}
</script>

<template lang="pug">
  .video-list-container
    md-empty-state(
    v-if="!doVideosExist && areVideosLoaded"
    md-icon="video_library"
    md-label="We're out of videos!"
    md-description="You can submit a video now, or check here later."
    )
      md-button.md-raised.md-primary(@click="openNewVideoDialog") Submit video
    .video-list(v-if="doVideosExist")
      video-card(
      v-for="video in videos"
      :key="video['.key']"
      :video="video"
      :event="showEvents && getEventById(video.event)"
      )
</template>

<style scoped lang="sass">
  .video-list-container
    display: flex
    justify-content: center
  .video-list
    display: flex
    justify-content: center
    flex-wrap: wrap
    margin: 16px
    max-width: 1200px
</style>
