<script>
import VideoCard from '@/components/VideoCard'
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'video-list',

  components: {
    VideoCard,
  },

  props: [
    'videos',
  ],

  computed: {
    ...mapState({
      areVideosLoaded: (state) => state.video.areVideosLoaded,
    }),
    doVideosExist () {
      return this.videos && this.videos.length > 0
    },
  },

  methods: {
    ...mapMutations({
      openNewVideoDialog: 'ui/openNewVideoDialog',
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
    max-width: 1000px
</style>
