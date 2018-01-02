<script>
import {mapActions} from 'vuex'
import VideoTaggerPlayer from '@/components/VideoTaggerPlayer'

export default {
  name: 'Video',

  components: {
    'video-tagger-player': VideoTaggerPlayer,
  },

  created () {
    const {videoId} = this.$route.params
    this.loadVideo({videoId})
  },

  methods: {
    ...mapActions({
      loadVideo: 'video/loadVideo',
    }),
  },
}
</script>

<template lang="pug">
  #video
    video-tagger-player
</template>

<style scoped lang="sass">
</style>
